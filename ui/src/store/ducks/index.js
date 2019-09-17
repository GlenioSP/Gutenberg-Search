import { combineReducers } from "redux";

import books from "./books";
import bookParagraphs from "./bookParagraphs";

export default combineReducers({
  books,
  bookParagraphs
});
