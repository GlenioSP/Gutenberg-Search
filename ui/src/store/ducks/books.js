export const Types = {
  FETCH_BOOKS_START: "books/FETCH_BOOKS_START",
  FETCH_BOOKS_END: "books/FETCH_BOOKS_END",
  FETCH_BOOKS_ERROR: "books/FETCH_BOOKS_ERROR",
  SELECT_PARAGRAPH: "books/SELECT_PARAGRAPH",
  UNSELECT_PARAGRAPH: "books/UNSELECT_PARAGRAPH"
};

const INITIAL_STATE = {
  fetching: false,
  fetched: false,
  books: null,
  selectedParagraph: null,
  error: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Types.FETCH_BOOKS_START:
      return { ...state, fetching: true };
    case Types.FETCH_BOOKS_END:
      return {
        ...state,
        fetching: false,
        fetched: true,
        books: action.payload,
        error: null
      };
    case Types.FETCH_BOOKS_ERROR:
      return {
        ...state,
        fetching: false,
        fetched: true,
        books: null,
        error: action.payload
      };
    case Types.SELECT_PARAGRAPH:
      return {
        ...state,
        selectedParagraph: action.payload
      };
    case Types.UNSELECT_PARAGRAPH:
      return {
        ...state,
        selectedParagraph: null
      };
    default:
      return {
        ...state,
        fetching: false
      };
  }
};

export const Creators = {
  // With parenthesis there is no need to do a explicit return of the object inside the arrow func.
  // The object is returned automatically.
  fetchBooksStart: () => ({
    type: Types.FETCH_BOOKS_START
  }),
  fetchBooksEnd: books => ({
    type: Types.FETCH_BOOKS_END,
    payload: books
  }),
  fetchBooksError: error => ({
    type: Types.FETCH_BOOKS_ERROR,
    payload: error
  }),
  SearchBooks: (query, page, perPage, newEndpoint) => async (
    dispatch,
    getState,
    bookService
  ) => {
    dispatch(Creators.fetchBooksStart());
    const { SearchBooks } = bookService;
    const books = await SearchBooks(query, page, perPage, newEndpoint);
    return books;
  },
  selectParagraph: bookParagraph => ({
    type: Types.SELECT_PARAGRAPH,
    payload: bookParagraph
  }),
  unselectParagraph: () => ({
    type: Types.UNSELECT_PARAGRAPH
  })
};
