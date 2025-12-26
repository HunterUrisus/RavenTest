"use strict";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './styles/index.css'
import Root from "./pages/Root.jsx";
import Test from "./pages/Test.jsx";
import Error404 from "./pages/Error404.jsx";
import TestPage from "./pages/TestPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: "/test",
        element: <TestPage />,
      },
      {
        path: "/raven",
        element: <Test />
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
