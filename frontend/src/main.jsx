"use strict";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/index.css";
import Root from "./pages/Root.jsx";
import Test from "./pages/Test.jsx";
import Error404 from "./pages/Error404.jsx";
import TestPage from "./pages/TestPage.jsx";
import Results from "./pages/Results.jsx";
import AnalisisEstudiante from "./pages/AnalisisEstudiante.jsx";
import DetalleTest from "./pages/DetalleTest.jsx";

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
        element: <Test />,
      },
      {
        path: "/results",
        element: <Results />,
      },
      {
        path: "/results/student/:rut",
        element: <AnalisisEstudiante />,
      },
      {
        path: "/results/student/:rut/test/:testId",
        element: <DetalleTest />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
