from flask import current_app


def check_connection():
    if current_app.elasticsearch is None:
        return False
    return current_app.elasticsearch.ping()


def create_index(index):
    if not current_app.elasticsearch.indices.exists(index=index):
        current_app.elasticsearch.indices.create(index=index)


def add_mapping_to_index(index, doc_type, mapping):
    if not current_app.elasticsearch.indices.exists_type(index=index, doc_type=doc_type):
        current_app.elasticsearch.indices.put_mapping(index=index, doc_type=doc_type, body=mapping)


def remove_from_index(index, data_id):
    current_app.elasticsearch.delete(index=index, id=data_id)


def reset_index(index):
    if current_app.elasticsearch.indices.exists(index=index):
        current_app.elasticsearch.indices.delete(index=index)
    else:
        current_app.elasticsearch.indices.create(index=index)


def add_bulk_data(data):
    current_app.elasticsearch.bulk(body=data)


def query_index_page(index, body):
    search = current_app.elasticsearch.search(index=index, body=body)
    ids = [str(hit['_id']) for hit in search['hits']['hits']]
    return search['hits']['total'], ids, search['hits']['hits']
