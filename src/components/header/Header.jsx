import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Container from "../containers/Container"
import Logo from "../Logo";
import LogoutBtn from "./LogoutButton.jsx";
import { Link } from "react-router-dom";
import { useState } from "react";


function Header() {
    const navigate = useNavigate()
    const authStatus = useSelector((state) => state.auth.status)
    const user = useSelector((state) => state.auth.userData)
    const [userDropdown, setUserDropdown] = useState(false)

    const handleUserDropdown = () => {
        setUserDropdown(!userDropdown)
    }

    const navItems = [
        {
            name: "Home",
            to: "/",
            active: true
        },
        {
            name: "Search",
            to: "/search-video",
            active: authStatus
        },
        {
            name: "Login",
            to: "/login",
            active: !authStatus
        },
        {
            name: "Create Account",
            to: "/create-account",
            active: !authStatus
        },

    ]

    return (
        <header className="bg-white py-2">
            <Container>
                <nav className="flex flex-row " >
                    <div className="basis-1/4 flex-auto">
                        <Link to="/">
                            <Logo className="" />
                        </Link>
                    </div>
                    <ul className="sm:flex flex-row justify-around flex-auto basis-3/4 items-center text-lg" >
                        {
                            navItems.map((item) => (
                                <li key={item.name} >
                                    {item.active && (
                                        <button onClick={() => navigate(item.to)}>{item.name}</button>
                                    )}
                                    {item.active && item.name === "Search" && (
                                        <button key={item.name} className="grow hidden sm:flex ">
                                            <input type="text" className="border"  /> {item.name}
                                        </button>
                                    )}
                                </li>
                            ))

                        }
                    </ul>
                    {
                        authStatus && (
                            <button onClick={handleUserDropdown} className="focus:outline-none">
                                <img src={user?.data?.avatar?.url} alt="Avatar" className="h-24 w-24 rounded-full" />
                            </button>
                        )
                    }

                </nav>
            </Container>
            <div className="relative">
                {
                    authStatus && userDropdown && (
                        <ul className="z-10 flex flex-col justify-between items-center absolute right-0 top-0 bg-blue-300 rounded-md p-4 shadow ">
                            <li className="flex flex-row justify-center items-center">
                                <div className="">
                                    <img src={user?.data?.avatar?.url} alt="Avatar" className="h-20 w-20 rounded-full" />
                                </div>
                                <div className="p-2 flex flex-col justify-between items-center">
                                    <div className="text-lg font-semibold">{user?.data?.username}</div>
                                    <div className=" font-medium">{user?.data?.email}</div>
                                </div>
                            </li>
                            <hr className="my-4 w-full border-t-2 border-blue-500" />
                            <li><Link to={`/${user?.data?.username}/videos`} className="text-blue-900 hover:bg-blue-200 px-2 py-1 rounded">View your channel</Link></li>
                            <li className=" text-lg font-medium hover:bg-blue-200 px-2 py-1 mt-2 rounded">
                                <LogoutBtn />
                            </li>
                        </ul>
                    )
                }
            </div>
        </header>
    )

}

export default Header