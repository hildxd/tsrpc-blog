import { Layout } from "./Layout";
import { createBrowserRouter } from "react-router-dom";
import { HomePage, LoginPage, RegisterPage, PostPage } from "../pages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "post",
        element: <PostPage />,
      },
    ],
  },
]);

export default router;
