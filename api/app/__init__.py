import logging
from logging.handlers import RotatingFileHandler
import os
from flask import Flask
from flask_cors import CORS
from config import Config
from elasticsearch import Elasticsearch


def create_app(config_class=Config):
    app_name = "guttenberg-search"

    app = Flask(__name__)
    CORS(app, resources={r'/*': {'origins': '*'}})

    app.config.from_object(config_class)

    elasticsearch_url = app.config['ELASTICSEARCH_URL']
    app.elasticsearch = Elasticsearch([elasticsearch_url])

    with app.app_context():
        from app.error import bp as errors_bp
        app.register_blueprint(errors_bp)

        from app.book import bp as book_bp
        app.register_blueprint(book_bp, url_prefix='/api/books')

    if not app.debug and not app.testing:
        if app.config['LOG_TO_STDOUT']:
            stream_handler = logging.StreamHandler()
            stream_handler.setLevel(logging.INFO)
            app.logger.addHandler(stream_handler)
        else:
            if not os.path.exists('logs'):
                os.mkdir('logs')
            file_handler = RotatingFileHandler(f'logs/{app_name}.log',
                                               maxBytes=10240, backupCount=10)
            file_handler.setFormatter(logging.Formatter(
                '%(asctime)s %(levelname)s: %(message)s '
                '[in %(pathname)s:%(lineno)d]'))
            file_handler.setLevel(logging.INFO)
            app.logger.addHandler(file_handler)

        app.logger.setLevel(logging.INFO)
        app.logger.info(f'{app_name.capitalize()} startup')

    app.logger.info(f'Using elasticsearch service through {elasticsearch_url}')

    return app
