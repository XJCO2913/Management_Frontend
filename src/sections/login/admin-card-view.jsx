import React, { useState } from "react";
import { useAuthContext } from 'src/auth/hooks'
import { useRouter } from 'src/routes/hooks';

export default function AvatarCard({ avatarUrl, name, description, githubUrl, onLoginError }) {
    const [isLogin, setIsLogin] = useState(false)
    const [password, setPassword] = useState('')
    const { login } = useAuthContext()
    const router = useRouter()

    const handleChange = (e) => {
        setPassword(e.target.value)
    }

    const handleLogin = async () => {
        const res = await login?.(name, password)

        if (res.success) {
            router.push('/dashboard')
        } else {
            onLoginError(res.errMsg)
        }
    }

    return (
        <div
            className="flex flex-col items-center py-6 scale-95 transition-all duration-300 transform border rounded-xl hover:border-transparent group hover:bg-green-700 dark:border-gray-700 dark:hover:border-transparent"
        >
            <img className="object-cover w-24 h-24 rounded-full ring-4 ring-gray-300 cursor-pointer transition-transform duration-300 hover:rotate-45" src={avatarUrl} alt="" onClick={() => { setIsLogin(true) }} />

            <h1 className="mt-4 text-2xl font-semibold text-gray-700 capitalize dark:text-white group-hover:text-white">{name}</h1>
            {
                isLogin ?
                    <div className="relative flex flex-col items-center mt-2">
                        <div className="relative flex items-center mt-2 mx-6">
                            <button className="absolute right-0 focus:outline-none rtl:left-0 rtl:right-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mx-4 text-gray-400 transition-colors duration-300 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400">
                                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                                </svg>
                            </button>

                            <input 
                                type="password" 
                                placeholder="Enter password" 
                                className="block w-full py-2.5 text-gray-700 placeholder-gray-400/70 bg-white border border-gray-200 rounded-lg pl-5 pr-11 rtl:pr-5 rtl:pl-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" 
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex items-center justify-between mt-4 space-x-2">
                            <button
                                className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-400 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                                onClick={() => { setIsLogin(false) }}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-50"
                                onClick={handleLogin}
                            >
                                Sign In
                            </button>
                        </div>
                    </div> :
                    <>
                        <p className="mt-2 text-gray-500 capitalize dark:text-gray-300 group-hover:text-gray-300">{description}</p>
                        <div className="flex mt-3 -mx-2">
                            <a href={githubUrl} className="mx-2 text-gray-600 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-300 group-hover:text-white" aria-label="Github">
                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M12.026 2C7.13295 1.99937 2.96183 5.54799 2.17842 10.3779C1.395 15.2079 4.23061 19.893 8.87302 21.439C9.37302 21.529 9.55202 21.222 9.55202 20.958C9.55202 20.721 9.54402 20.093 9.54102 19.258C6.76602 19.858 6.18002 17.92 6.18002 17.92C5.99733 17.317 5.60459 16.7993 5.07302 16.461C4.17302 15.842 5.14202 15.856 5.14202 15.856C5.78269 15.9438 6.34657 16.3235 6.66902 16.884C6.94195 17.3803 7.40177 17.747 7.94632 17.9026C8.49087 18.0583 9.07503 17.99 9.56902 17.713C9.61544 17.207 9.84055 16.7341 10.204 16.379C7.99002 16.128 5.66202 15.272 5.66202 11.449C5.64973 10.4602 6.01691 9.5043 6.68802 8.778C6.38437 7.91731 6.42013 6.97325 6.78802 6.138C6.78802 6.138 7.62502 5.869 9.53002 7.159C11.1639 6.71101 12.8882 6.71101 14.522 7.159C16.428 5.868 17.264 6.138 17.264 6.138C17.6336 6.97286 17.6694 7.91757 17.364 8.778C18.0376 9.50423 18.4045 10.4626 18.388 11.453C18.388 15.286 16.058 16.128 13.836 16.375C14.3153 16.8651 14.5612 17.5373 14.511 18.221C14.511 19.555 14.499 20.631 14.499 20.958C14.499 21.225 14.677 21.535 15.186 21.437C19.8265 19.8884 22.6591 15.203 21.874 10.3743C21.089 5.54565 16.9181 1.99888 12.026 2Z">
                                    </path>
                                </svg>
                            </a>
                        </div>
                    </>
            }
        </div>
    )
}