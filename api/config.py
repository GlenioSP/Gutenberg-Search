from os import environ


class Config(object):
    LOG_TO_STDOUT = environ.get('LOG_TO_STDOUT') or False
    DEFAULT_NUM_RESULTS_PER_PAGE = int(environ.get('DEFAULT_NUM_RESULTS_PER_PAGE', 10))
    DEFAULT_PAGE_NUM = int(environ.get('DEFAULT_PAGE_NUM', 1))
    MAXIMUM_NUM_RESULTS_PER_PAGE = int(environ.get('MAXIMUM_NUM_RESULTS_PER_PAGE', 100))
    ELASTICSEARCH_URL = environ.get('ELASTICSEARCH_URL', 'http://localhost:9200')
