import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Container from "../containers/Container"
import Logo from "../Logo";
import LogoutBtn from "./LogoutButton.jsx";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import InputBox from "../InputBox.jsx";


function Header() {

    const [userDropdown, setUserDropdown] = useState(false)
    const [query, setQuery] = useState("")
    const navigate = useNavigate()

    const authStatus = useSelector((state) => state.auth.status)
    const user = useSelector((state) => state.auth.userData)
    const dropdownRef = useRef(null)

    const handleSearch = (e) => {
        if (query.trim()!=="") {
          navigate(`/search?q=${encodeURIComponent(query)}`);
        }
      };
    const handleKeyDown=(e)=>{
        if (e.key === 'Enter')
            handleSearch()
    }  
    const handleUserDropdown = () => {
        setUserDropdown(!userDropdown)
    }
    useEffect(() => {
        const closeDropdown = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setUserDropdown(false);
            }
        };

        document.addEventListener("mousedown", closeDropdown);

        return () => {
            document.removeEventListener("mousedown", closeDropdown);
        };
    }, []);
    const navItems = [
        {
            name: "Home",
            to: "/",
            active: true
        },
        {
            name: "Search",
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
                                    {item.active && item.name !== "Search" && (
                                        <button onClick={() => navigate(item.to)}>{item.name}</button>
                                    )}
                                    {item.name === "Search" && (
                                        <div className="divide-x divide-gray-500  border rounded border-gray-500 grow hidden sm:flex flex-row justify-center items-center ">
                                            <InputBox
                                                type="search"
                                                placeholder="Search the channel videos"
                                                autoCorrect="off"
                                                spellCheck="false"
                                                value={query}
                                                onChange={(e) => setQuery(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                className={`text-black outline-none border-none `}
                                            />
                                            <button className=" px-2 py-1 " onClick={handleSearch}>{item.name}</button>
                                        </div>
                                    )}
                                </li>
                            ))

                        }
                    </ul>
                    {
                        authStatus && (
                            <button onClick={handleUserDropdown} className="focus:outline-none">
                                <img src={user?.data?.avatar?.url} alt="Avatar" className="object-cover aspect-square md:max-w-16 sm:max-w-12 max-w-12 rounded-full" />
                            </button>
                        )
                    }

                </nav>
            </Container>
            <div className="relative" ref={dropdownRef} onClick={handleUserDropdown}>
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