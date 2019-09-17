from flask import Blueprint

bp = Blueprint('books', __name__)

from app.book import books, services

if services.check_connection():
    services.create_index_with_mapping()
