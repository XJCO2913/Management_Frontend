import React from "react";
import AvatarCard from "../components/AvatarCard";

const Admins = [
    {   
        name: "Erfei Yu",
        description: "Golang Developer",
        avatarUrl: "./yuerfei.JPG",
        githubUrl: "https://github.com/454270186"
    },
    {
        name: "Loda",
        description: "Frontend Developer",
        avatarUrl: "./loda.JPG",
        githubUrl: "https://github.com/454270186"
    },
    {
        name: "Deck Wang",
        description: "Backend Developer",
        avatarUrl: "./deck.JPG",
        githubUrl: "https://github.com/454270186"
    },
    {
        name: "Bi6666",
        description: "Frontend Developer",
        avatarUrl: "./bi666.JPG",
        githubUrl: "https://github.com/454270186"
    },
]

const Login = () => {
    return (
        <div className="bg-white dark:bg-gray-900 h-screen">
            <section>
                <div className="container px-6 py-10 mx-auto">
                    <h1 className="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl dark:text-white">
                        <span className="text-green-600">PathPals</span> Administrators
                    </h1>

                    <p className="max-w-2xl mx-auto my-6 text-center text-gray-500 dark:text-gray-300">
                        Click Avatar to Login
                    </p>

                    <div className="grid grid-cols-1 gap-0 mt-8 xl:mx-28 xl:mt-16 md:grid-cols-2 xl:grid-cols-4">
                        {Admins.map((admin, index) => (
                            <AvatarCard
                                key={index}
                                name={admin.name}
                                avatarUrl={admin.avatarUrl}
                                description={admin.description}
                                githubUrl={admin.githubUrl}
                            />
                        ))}
                    </div>
                </div>
            </section>
            <section>
                <div className="container flex flex-col items-center px-8 py-6 mx-auto text-center">
                    <h2 className="max-w-2xl mx-auto text-2xl font-semibold tracking-tight text-gray-800 xl:text-3xl dark:text-white">
                        This site is only for <span className="text-green-600">Administrators</span>
                    </h2>

                    <p className="max-w-4xl mt-6 text-center text-gray-500 dark:text-gray-300">
                        If you are customer, please visit our user website
                    </p>

                    <div className="inline-flex w-full mt-6 sm:w-auto">
                        <a href="http://43.136.232.116/login" className="inline-flex items-center justify-center w-full px-6 py-2 text-white duration-300 bg-green-600 rounded-lg hover:bg-green-500 focus:ring focus:ring-green-300 focus:ring-opacity-80">
                            Go to PathPals
                        </a>
                    </div>
                </div>
            </section>
        </div>


    )
}

export default Login