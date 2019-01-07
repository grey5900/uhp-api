/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import createStore from './redux/create';
import ApiClient from './helpers/ApiClient';
import {Provider} from 'react-redux';
import {Router, browserHistory, match} from 'react-router';
import {ReduxAsyncConnect} from 'redux-connect';
import useScroll from 'scroll-behavior/lib/useStandardScroll';
// import a11y from 'react-a11y';

import getRoutes from './routes';
import jQuery from 'jquery';
window.jQuery = window.$ = jQuery;
require('./theme/semantic-ui/semantic.min');
require('./lib/area');

const client = new ApiClient();
const history = useScroll(() => browserHistory)();
const dest = document.getElementById('content');
const store = createStore(history, client, window.__data);

const routes = getRoutes(store);

match({ history, routes }, (error, redirectLocation, renderProps) => {
  const component = (
    <Router {...renderProps} render={(props) =>
          <ReduxAsyncConnect {...props} helpers={{client}} filter={item => !item.deferred} />
        } history={history} routes={routes} />
  );

  ReactDOM.render(
    <Provider store={store} key="provider">
      {component}
    </Provider>,
    dest
  );

  if (process.env.NODE_ENV !== 'production') {
    window.React = React; // enable debugger

    if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
      console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
    }
  }

  if (__DEVTOOLS__ && !window.devToolsExtension) {
    const DevTools = require('./containers/DevTools/DevTools');
    ReactDOM.render(
      <Provider store={store} key="provider">
        <div>
          {component}
          <DevTools />
        </div>
      </Provider>,
      dest
    );
  }
});
