import requests
import re
import uuid
from flask import current_app
from app.book.models import Book, SearchableBookMapping, searchable_book_index, searchable_book_doc_type
from app.search import services as es_service


def check_connection():
    if not es_service.check_connection():
        raise ValueError("Connection to search/storage service is unavailable. Please try again.")
    return True


def create_index_with_mapping():
    es_service.create_index(searchable_book_index)
    es_service.add_mapping_to_index(searchable_book_index, searchable_book_doc_type, SearchableBookMapping)


def read_and_insert_books(book_url):
    res = requests.get(book_url)
    res.encoding = res.apparent_encoding
    book_text = res.text

    book_data = parse_book_file(book_text)
    insert_book_bulk_data(book_data)


def parse_book_file(book_text) -> Book:
    title_regex = re.compile(r'^Title:\s(.+)$', re.MULTILINE)
    title = 'Unknown title'
    author_regex = re.compile(r'^Author:\s(.+)$', re.MULTILINE)
    author = 'Unknown author'
    start_of_book_regex = re.compile(r'^\*{3}\s*START(.+)\*{3}', re.MULTILINE)
    end_of_book_regex = re.compile(r'^\*{3}\s*END(.+)\*{3}', re.MULTILINE)
    split_lines_regex = re.compile(r'\n\s+\n', re.MULTILINE)

    match = title_regex.search(book_text)
    if match:
        title = match.group(1).rstrip().strip()

    match = author_regex.search(book_text)
    if match:
        author = match.group(1).rstrip().strip()

    current_app.logger.info(f'Reading Book - {title} By {author}')

    start_of_book_match = start_of_book_regex.search(book_text)
    start_of_book_index = start_of_book_match.start() + len(start_of_book_match.group())
    end_of_book_index = end_of_book_regex.search(book_text).start()

    book_text = book_text[start_of_book_index:end_of_book_index]
    book_paragraphs = split_lines_regex.split(book_text)

    book_paragraphs_no_carriage = [paragraph.replace('\r', '') for paragraph in book_paragraphs]
    book_paragraphs_no_new_line = [paragraph.replace('\n', ' ') for paragraph in book_paragraphs_no_carriage]
    book_paragraphs_no_italic_signal = [paragraph.replace('_', '') for paragraph in book_paragraphs_no_new_line]
    cleaned_book_paragraphs = [paragraph for paragraph in book_paragraphs_no_italic_signal if paragraph]

    current_app.logger.info(f'Parsed {len(cleaned_book_paragraphs)} book paragraphs')

    return Book(title, author, cleaned_book_paragraphs)


def insert_book_bulk_data(book_data):
    data = []
    for i, paragraph in enumerate(book_data.paragraphs):
        data.append({'index': {'_index': 'library', '_type': 'book', '_id': str(uuid.uuid4())}})
        data.append({
            'author': book_data.author,
            'title': book_data.title,
            'location': i,
            'text': paragraph
        })

        # Do bulk insert after every 500 paragraphs
        if i > 0 and i % 500 == 0:
            es_service.add_bulk_data(data)
            data = []
            current_app.logger.info(f'Indexed paragraphs {i - 499} - {i}')

    es_service.add_bulk_data(data)
    current_app.logger.info(f'Indexed paragraphs {len(book_data.paragraphs) - len(data)/2} - {len(book_data.paragraphs)}')


def search_book_data(query, search_page):
    body = {
        'from': (search_page.page - 1) * search_page.per_page,
        'size': search_page.per_page,
        'query': {
            'match': {
                'text': {
                    'query': query,
                    'operator': 'and',
                    'fuzziness': 'auto'
                }
            }
        },
        'highlight': {
            'fields': {
                'text': {}
            }
        }
    }
    return es_service.query_index_page(searchable_book_index, body)


def get_book_paragraphs(book_title, start, end):
    query_filter = [
        {'term': {'title': book_title}},
        {'range': {'location': {'gte': start, 'lte': end}}}
    ]
    body = {
        'size': end - start,
        'sort': {'location': 'asc'},
        'query': {'bool': {'filter': query_filter}}
    }
    return es_service.query_index_page(searchable_book_index, body)
