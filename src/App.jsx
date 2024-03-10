import React from "react";
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Login from './pages/login'

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />
    }
])

const App = () => (
    <RouterProvider router={router} />
)

export default App