import axios from "axios";

let baseUrl = "http://localhost:5000/api";

if (process.env.REACT_APP_USING_DOCKER === '1') {
  /* 
    When running inside docker the API is requested as a local web path. 
    NGINX will then proxy the request to the right docker container service url. 
  */
  baseUrl = "/api";
}

export const SearchBooks = async(query, page, perPage, newEndpoint) => {
  if (newEndpoint) {
    const response = await axios.get(baseUrl + newEndpoint);
    return response.data;
  }
  const response = await axios.get(
      `${baseUrl}/books/search`, {params: {q: query, page, per_page: perPage}});
  return response.data;
};

export const SearchBookParagraphs =
    async(bookTitle, start, offset, newEndpoint) => {
      if (newEndpoint) {
        const response = await axios.get(baseUrl + newEndpoint);
        return response.data;
      }
      const response =
          await axios.get(`${baseUrl}/books/paragraphs`,
                          {params: {book_title: bookTitle, start, offset}});
      return response.data;
    };
