class SearchPage(object):
    def __init__(self, page, per_page, pages=0, total=0):
        self._page = page
        self._per_page = per_page
        self._pages = pages
        self._total = total

    @property
    def page(self):
        return self._page

    @page.setter
    def page(self, page):
        self._page = page

    @property
    def per_page(self):
        return self._per_page

    @per_page.setter
    def per_page(self, per_page):
        self._per_page = per_page

    @property
    def pages(self):
        return self._pages

    @pages.setter
    def pages(self, pages):
        self._pages = pages

    @property
    def total(self):
        return self._total

    @total.setter
    def total(self, total):
        self._total = total
