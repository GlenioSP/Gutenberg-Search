import os


class Config(object):
    LOG_TO_STDOUT = os.environ.get('LOG_TO_STDOUT') or False
    DEFAULT_NUM_RESULTS_PER_PAGE = int(os.environ.get('DEFAULT_NUM_RESULTS_PER_PAGE')) \
        if os.environ.get('DEFAULT_NUM_RESULTS_PER_PAGE') is not None else 10
    DEFAULT_PAGE_NUM = int(os.environ.get('DEFAULT_PAGE_NUM')) \
        if os.environ.get('DEFAULT_PAGE_NUM') is not None else 1
    MAXIMUM_NUM_RESULTS_PER_PAGE = int(os.environ.get('MAXIMUM_NUM_RESULTS_PER_PAGE')) \
        if os.environ.get('DEFAULT_PAGE_NUM') is not None else 100
    ELASTICSEARCH_URL = os.environ.get('ELASTICSEARCH_URL')
