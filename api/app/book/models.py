from dataclasses import dataclass
from flask import url_for


@dataclass
class Book(object):
    title: str
    author: str
    paragraphs: [str]

    @staticmethod
    def remove_api_prefix_from_link_keys(links):
        new_links = {}
        for k, v in links.items():
            if v:
                new_links[k] = v.split("/api")[1]
        return new_links

    @staticmethod
    def to_collection_dict(items, query, search_page, endpoint):
        has_next_url = search_page.total > search_page.page * search_page.per_page
        has_prev_url = search_page.page > 1
        data = {
            'items': [item for item in items],
            '_meta': {
                'page': search_page.page,
                'per_page': search_page.per_page,
                'total_pages': search_page.pages,
                'total_items': search_page.total
            }
        }
        links = {
            'self': url_for(endpoint, q=query, page=search_page.page,
                            per_page=search_page.per_page),
            'next': url_for(endpoint, q=query, page=search_page.page + 1,
                            per_page=search_page.per_page) if has_next_url else None,
            'prev': url_for(endpoint, q=query, page=search_page.page - 1,
                            per_page=search_page.per_page) if has_prev_url else None
        }
        data.update({
            '_links': Book.remove_api_prefix_from_link_keys(links)
        })
        return data

    @staticmethod
    def to_paragraph_collection_dict(items, book_title, start, offset, total, endpoint):
        end = start + offset
        new_prev_start = start - offset if (start - offset >= 0) else 0
        has_next_url = total >= offset
        data = {
            'items': [item for item in items],
            '_meta': {
                'start': start,
                'offset': offset,
                'end': end,
                'total_items': total
            }
        }
        links = {
            'self': url_for(endpoint, book_title=book_title, start=start,
                            offset=offset),
            'next': url_for(endpoint, book_title=book_title, start=end,
                            offset=offset) if has_next_url else None,
            'prev': url_for(endpoint, book_title=book_title, start=new_prev_start,
                            offset=offset)
        }
        data.update({
            '_links': Book.remove_api_prefix_from_link_keys(links)
        })
        return data


'''
The Book class method 'to_collection_dict' has many parameters.
One of the parameters is 'items', which is a list containing multiple objects of the form:
{
    '_index': 'my_index',
    '_type': 'my_type',
    '_id': '1',
    '_score': 0.5753642,
    '_source': {
        'title': 'book title',
        'author': 'book author',
        'location': 'book_paragraph_position' -> the paragraph's position inside the entire book text string
        'text': 'paragraph text'
    }
}
So, the '_source' field contains the mapping below represented by SearchableBookMapping. As an observation, you don't
need to put the 'mapping' field as a parent for the 'properties' field, as the Elasticsearch put_mapping function 
in python will already do this. 
'''
SearchableBookMapping = {
    'properties': {
        'title': {'type': 'keyword'},
        'author': {'type': 'keyword'},
        'location': {'type': 'integer'},
        'text': {'type': 'text'}
    }
}

searchable_book_index = 'library'
searchable_book_doc_type = 'book'
