
import { createBrowserRouter } from "react-router-dom";

import Login from "../components/Login";
import Browse from "../components/Browse";

export const AppRouter = createBrowserRouter(
    [
        {
            path: "/",
            element: <Login />
        },
        {
            path: "/browse",
            element: <Browse />
        }
    ]
);