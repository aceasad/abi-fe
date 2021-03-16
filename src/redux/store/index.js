import { createStore, applyMiddleware, compose } from "redux";
import reducers from "../reducers";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../sagas/index";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];
const history = createBrowserHistory();

function configureStore(preloadedState) {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    reducers(history),
    preloadedState,
    composeEnhancers(applyMiddleware(...middlewares, routerMiddleware(history)))
  );

  sagaMiddleware.run(rootSaga);

  if (module.hot) {
    module.hot.accept("../reducers/index", () => {
      const nextRootReducer = require("../reducers/index");
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

const store = configureStore();

export default store;
