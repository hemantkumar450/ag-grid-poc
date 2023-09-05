import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import GridComponent from "./components/grid.component";
import HomePage from "./components/home";
import ErrorPage from "./components/error";
import RootLayout from "./components/root";
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/grid", element: <GridComponent /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
