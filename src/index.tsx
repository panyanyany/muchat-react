import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouteObject, RouterProvider} from "react-router-dom";
import './util/i18n-util'
import { Provider } from 'react-redux';
import store from "./store/store";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const routes: RouteObject[] = []

if (location.hostname === 'a.ai37.top') {
    //
} else {
    routes.push({
        path: "/*",
        element: <Provider store={store}><App/></Provider>,
    })
}

const router = createBrowserRouter(routes);

root.render(
    <React.StrictMode>
        <RouterProvider router={router}></RouterProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
