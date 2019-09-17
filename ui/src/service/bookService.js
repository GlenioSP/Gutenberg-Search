import axios from "axios";

let baseUrl = "http://localhost:5000";

if (process.env.BOOK_SERVICE_URL) {
  baseUrl = process.env.BOOK_SERVICE_URL;
}

export const SearchBooks = async (query, page, perPage, newEndpoint) => {
  if (newEndpoint) {
    const response = await axios.get(baseUrl + newEndpoint);
    return response.data;
  }
  const response = await axios.get(`${baseUrl}/books/search`, {
    params: { q: query, page, per_page: perPage }
  });
  return response.data;
};

export const SearchBookParagraphs = async (
  bookTitle,
  start,
  offset,
  newEndpoint
) => {
  if (newEndpoint) {
    const response = await axios.get(baseUrl + newEndpoint);
    return response.data;
  }
  const response = await axios.get(`${baseUrl}/books/paragraphs`, {
    params: { book_title: bookTitle, start, offset }
  });
  return response.data;
};
