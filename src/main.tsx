import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./style.css";
import Homepage from "./routes/homepage/homepage.tsx";
import DashboardPage from "./routes/dashboard/dashboardPage.tsx";
import ChatPage from "./routes/chatPage/chatPage.tsx";
import RootLayout from "./layouts/rootLayouts/RootLayout.tsx";
import DashboardLayout from "./layouts/dashboardLayout/dashboardLayout.tsx";
import SignInPage from "./routes/signInPage/signInPage.tsx";
import SignUpPage from "./routes/signUpPage/signUpPage.tsx";

// Create routes
const router = createBrowserRouter([
        {
                element:<RootLayout/>,
                children: [
                    {
                        path: "/",
                        element: (<Homepage/>)
                    },
                    {
                        path: "/sign-in/*",
                        element: (<SignInPage/>)
                    },
                    {
                        path: "/sign-up/*",
                        element: (<SignUpPage/>)
                    },
                    {
                        element:<DashboardLayout/>,
                        children:[
                            {
                                path: "/dashboard",
                                element: (<DashboardPage/>),
                            },
                            {
                                path: '/dashboard/chats/:id',
                                element: <ChatPage/>
                            }
                        ]
                    }
                ]
        }
]);

// Render with RouterProvider
ReactDOM.createRoot(document.getElementById("app")!).render(
    <React.StrictMode>
            <RouterProvider router={router} />
    </React.StrictMode>
);
