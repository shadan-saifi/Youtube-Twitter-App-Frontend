import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Container from "../containers/Container"
import Logo from "../Logo";
import LogoutBtn from "./LogoutButton.jsx";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import InputBox from "../InputBox.jsx";


function Header() {

    const [userDropdown, setUserDropdown] = useState(false);
    const [uploadDropdown, setUploadDropdown] = useState(false);

    const [query, setQuery] = useState("")
    const navigate = useNavigate()

    const authStatus = useSelector((state) => state.auth.status)
    const user = useSelector((state) => state.auth.userData)

    const userDropdownRef = useRef(null)
    const uploadDropdownRef = useRef(null)

    const handleSearch = (e) => {
        if (query.trim() !== "") {
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter')
            handleSearch()
    }
    const handleUserDropdown = () => {
        setUserDropdown(prev => !prev)
    }
    const handleUploadDropdown = () => {
        setUploadDropdown(prev => !prev)
    }
    useEffect(() => {
        const closeDropdown = (event) => {
            if (
                userDropdownRef.current &&
                !userDropdownRef.current.contains(event.target)
            ) {
                setUserDropdown(false);
            }
            if (
                uploadDropdownRef.current &&
                !uploadDropdownRef.current.contains(event.target)
            ) {
                setUploadDropdown(false);
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
        <header className=" bg-gradient-to-r from-cyan-300 to-blue-300 rounded-lg py-2">
            <Container>
                <nav className="flex flex-row justify-between items-center" >
                    <div className="flex-auto max-w-[120px] mr-12">
                        <Link to="/">
                            <Logo className="" />
                        </Link>
                    </div>
                    <ul className="flex sm:space-x-2 md:space-x-8 lg:space-x-24 xl:space-x-36 2xl:space-x-48 space-x-4 flex-row justify-between items-center text-lg" >
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
                    <div>
                        {
                            authStatus && (
                                <button onClick={handleUploadDropdown} className="focus:outline-none">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="pointer-events-none w-8 h-8"
                                        viewBox="0 0 24 24"
                                        focusable="false"
                                    >
                                        <path d="M14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2zm3-7H3v12h14v-6.39l4 1.83V8.56l-4 1.83V6m1-1v3.83L22 7v8l-4-1.83V19H2V5h16z" />
                                    </svg>
                                </button>
                            )
                        }
                    </div>
                    <div>
                        {
                            authStatus && (
                                <button onClick={handleUserDropdown} className="focus:outline-none">
                                    <img src={user?.data?.avatar?.url} alt="Avatar" className="object-cover aspect-square md:max-w-16 sm:max-w-12 max-w-12 rounded-full" />
                                </button>
                            )
                        }
                    </div>

                </nav>
            </Container>
            <div className="relative" ref={uploadDropdownRef}>
                {
                    authStatus && uploadDropdown && (
                        <div className="z-10 flex flex-col justify-between items-center absolute xl:right-40 lg:right-20 md:right-16 sm:right-4 right-14 top-0 font-semibold bg-white rounded-md p-2 my-2 shadow ">
                            <Link to={'/channel/uploadvideo'} className="text-blue-900 hover:bg-blue-200 active:scale-95 px-2 py-1 rounded">Upload Video</Link>
                            {/* <Link to={`/${user?.data?.username}/tweets`} className="text-blue-900 hover:bg-blue-200 active:scale-95 px-2 py-1 rounded">Create Tweet</Link> */}
                        </div>
                    )
                }
            </div>
            <div className="relative" ref={userDropdownRef} >
                {
                    authStatus && userDropdown && (
                        <ul className="z-10 space-y-2 flex flex-col justify-between items-center absolute right-0 top-0 bg-blue-300 rounded-md p-4 shadow  ">
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
                            <li><Link to={`/channel/dashboard`} className="text-blue-900 hover:bg-blue-200 px-2 py-1 rounded">View your dashboard</Link></li>                            
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