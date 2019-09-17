from flask import current_app, request, jsonify
from app.book import bp
from app.book import services as book_service
from app.book.models import Book
from app.error.handlers import bad_request
from app.search.models import SearchPage


@bp.before_request
def before_request():
    book_service.check_connection()


@bp.route('/load', methods=['POST'])
def load_data():
    data = request.get_json() or {}
    if 'book_url' not in data:
        return bad_request('must include book url for downloading')

    book_service.read_and_insert_books(data['book_url'])
    return jsonify({'message': 'successfully inserted book data'})


@bp.route('/search', methods=['GET'])
def search():
    query = request.args.get('q')
    page = request.args.get('page', current_app.config['DEFAULT_PAGE_NUM'], type=int)
    per_page = min(
        request.args.get(
            'per_page',
            current_app.config['DEFAULT_NUM_RESULTS_PER_PAGE'],
            type=int
        ),
        current_app.config['MAXIMUM_NUM_RESULTS_PER_PAGE']
    )

    search_page = SearchPage(page, per_page)

    total, ids, hits = book_service.search_book_data(query, search_page)
    search_page.total = total
    search_page.pages = search_page.total // per_page + (search_page.total % per_page > 0)

    result = Book.to_collection_dict(hits, query, search_page, 'books.search')
    return jsonify(result)


@bp.route('/paragraphs', methods=['GET'])
def get_paragraphs():
    book_title = request.args.get('book_title')
    start = int(request.args.get('start'))
    offset = int(request.args.get('offset'))
    end = start + offset

    total, ids, hits = book_service.get_book_paragraphs(book_title, start, end)

    result = Book.to_paragraph_collection_dict(hits, book_title, start, offset, total, 'books.get_paragraphs')
    return jsonify(result)
