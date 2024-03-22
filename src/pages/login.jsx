import { Helmet } from 'react-helmet-async';

import { AdminLoginView } from 'src/sections/login';

export default function Login() {
    return (
        <>
            <Helmet>
                <title>Login</title>
            </Helmet>

            <AdminLoginView />
        </>
    )
}