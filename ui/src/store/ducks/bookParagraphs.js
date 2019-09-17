export const Types = {
  FETCH_BOOK_PARAGRAPHS_START: "books/FETCH_BOOK_PARAGRAPHS_START",
  FETCH_BOOK_PARAGRAPHS_END: "books/FETCH_BOOK_PARAGRAPHS_END",
  FETCH_BOOK_PARAGRAPHS_ERROR: "books/FETCH_BOOK_PARAGRAPHS_ERROR"
};

const INITIAL_STATE = {
  fetching: false,
  fetched: false,
  paragraphs: null,
  error: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Types.FETCH_BOOK_PARAGRAPHS_START:
      return { ...state, fetching: true };
    case Types.FETCH_BOOK_PARAGRAPHS_END:
      return {
        ...state,
        fetching: false,
        fetched: true,
        paragraphs: action.payload,
        error: null
      };
    case Types.FETCH_BOOK_PARAGRAPHS_ERROR:
      return {
        ...state,
        fetching: false,
        fetched: true,
        paragraphs: null,
        error: action.payload
      };
    default:
      return {
        ...state,
        fetching: false,
        paragraphs: null
      };
  }
};

export const Creators = {
  fetchBookParagraphsStart: () => ({
    type: Types.FETCH_BOOK_PARAGRAPHS_START
  }),
  fetchBookParagraphsEnd: paragraphs => ({
    type: Types.FETCH_BOOK_PARAGRAPHS_END,
    payload: paragraphs
  }),
  fetchBookParagraphsError: error => ({
    type: Types.FETCH_BOOK_PARAGRAPHS_ERROR,
    payload: error
  }),
  SearchBookParagraphs: (bookTitle, start, offset, newEndpoint) => async (
    dispatch,
    getState,
    bookService
  ) => {
    dispatch(Creators.fetchBookParagraphsStart());
    const { SearchBookParagraphs } = bookService;
    const bookParagraphs = await SearchBookParagraphs(
      bookTitle,
      start,
      offset,
      newEndpoint
    );
    return bookParagraphs;
  }
};
