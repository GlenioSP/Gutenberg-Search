import React from "react";
import { Provider } from "react-redux";

import store from "./store";

import Book from "./Book";

const App = () => (
  <Provider store={store}>
    <Book />
  </Provider>
);

export default App;
