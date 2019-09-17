import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import rootReducer from "./ducks";

import * as bookService from "../service/bookService";

// redux-logger constantly logs the state and actions changes.
// so its much easier to follow what's happening.
const loggerMiddleware = createLogger();

const middleware = [thunk.withExtraArgument(bookService)];

const enhancers = [];

if (process.env.NODE_ENV === "development") {
  const { devToolsExtension } = window;

  if (typeof devToolsExtension === "function") {
    enhancers.push(devToolsExtension());
  }

  middleware.push(loggerMiddleware);
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
);

const store = createStore(rootReducer, composedEnhancers);

export default store;
