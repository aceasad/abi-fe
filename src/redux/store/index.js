import { createStore, applyMiddleware, compose } from 'redux';
import reducers from '../reducers';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas/index';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

export const history = createBrowserHistory();

function configureStore(preloadedState) {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    reducers(history),
    preloadedState,
    composeEnhancers(applyMiddleware(...middlewares, routerMiddleware(history)))
  );

  sagaMiddleware.run(rootSaga);

  if (import.meta.hot) {
    import.meta.hot.accept('../reducers', (newRootReducer) => {
      store.replaceReducer(newRootReducer.default(history));
    });
  }

  return store;
}

const store = configureStore();

export default store;
