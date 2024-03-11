import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async' // 导入 HelmetProvider
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import UserListPage from './pages/list'

const router = createBrowserRouter([
    {
        path: "/users",
        element: <UserListPage />,
    }
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <HelmetProvider>
            <RouterProvider router={router} />
        </HelmetProvider>
    </React.StrictMode>,
)
