import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Container from "../containers/Container"
import Logo from "../Logo";
import LogoutBtn from "./LogoutButton.jsx";
import { Link } from "react-router-dom";
import { useState } from "react";
import VideoIcon from "../icons/UploadVideoIcon.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuGroup,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "../ui/ModeToggle";
import { Input } from "../ui/input";
import { Button } from "../ui/button";


function Header() {

    const [query, setQuery] = useState("")
    const navigate = useNavigate()

    const authStatus = useSelector((state) => state.auth.status)
    const user = useSelector((state) => state.auth.userData)

    const handleSearch = (e) => {
        if (query.trim() !== "") {
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter')
            handleSearch()
    }

    const navItems = [
        // {
        //     name: "Home",
        //     to: "/",
        //     active: true
        // },
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
        <header >
            <Container className=" bg-gradient-to-r from-cyan-300 to-blue-300 rounded-lg py-2 dark:from-gray-500 dark:to-gray-300">
                <nav className="flex flex-row justify-between items-center" >
                    <div className="flex-auto max-w-[120px] mr-12">
                        <Link to="/">
                            <Logo />
                        </Link>
                    </div>
                    <ModeToggle/>
                    <ul className="flex sm:space-x-2 md:space-x-8 lg:space-x-24 xl:space-x-36 2xl:space-x-48 space-x-4 flex-row justify-between items-center text-lg" >
                        {
                            navItems.map((item) => (
                                <li key={item.name} >
                                    {item.active && item.name !== "Search" && (
                                        <Button variant="ghost" onClick={() => navigate(item.to)}>{item.name}</Button>
                                    )}
                                    {item.name === "Search" && (
                                        <div className="divide-x divide-gray-500 grow hidden sm:flex flex-row justify-center items-center ">
                                            <Input
                                                type="search"
                                                placeholder="Search the channel videos"
                                                autoCorrect="off"
                                                spellCheck="false"
                                                value={query}
                                                onChange={(e) => setQuery(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                               className="dark:bg-off-white"
                                            />
                                            <Button onClick={handleSearch}>{item.name}</Button>
                                        </div>
                                    )}
                                </li>
                            ))

                        }
                    </ul>
                    <div className="flex flex-row justify-between items-center sm:space-x-2 md:space-x-8 lg:space-x-24 xl:space-x-36 2xl:space-x-48 space-x-4 " >
                        <div>
                            {
                                authStatus && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <div>
                                                <VideoIcon className="w-8 h-8 text-red-600" />
                                                <span className="text-sm font-extralight text-red-600 text-center">Upload</span>
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>Upload</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                <Link to={'/channel/uploadvideo'} >Upload Video</Link>
                                            </DropdownMenuItem>
                                            {/* <DropdownMenuItem>
                                            <Link to={`/${user?.data?.username}/tweets`} >Create Tweet</Link>
                                        </DropdownMenuItem> */}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )
                            }
                        </div>
                        <div>
                            {
                                authStatus &&
                                (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <Avatar className="max-w-[120px] h-14 w-14">
                                                <AvatarImage src={user?.data?.avatar?.secure_url} />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel >
                                                <li className="flex flex-row justify-center items-center">
                                                    <Avatar>
                                                        <AvatarImage src={user?.data?.avatar?.secure_url} />
                                                        <AvatarFallback>CN</AvatarFallback>
                                                    </Avatar>

                                                    <div className="p-2 flex flex-col justify-between items-center">
                                                        <div className="text-lg font-semibold">{user?.data?.username}</div>
                                                        <div className=" font-medium">{user?.data?.email}</div>
                                                    </div>
                                                </li>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem>
                                                    <Link to={`/${user?.data?.username}/videos`} >View your channel</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Link to={`/channel/dashboard`} >View your dashboard</Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup className="text-center">
                                                <LogoutBtn />
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )
                            }
                        </div>
                    </div>
                </nav>
            </Container>
        </header>
    )

}

export default Header