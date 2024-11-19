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
import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@/components/ui/menubar"

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

            <Menubar className="flex flex-row justify-between items-center bg-gradient-to-r from-black to-gray-800 rounded-lg p-2 px-8 dark:from-gray-900 dark:to-gray-700 sm:h-16 h-12 w-full text-white">
                <MenubarMenu>
                    <div className="flex-auto max-w-[120px] sm:mr-12 mr-8">
                        <Link to="/">
                            <Logo />
                        </Link>
                    </div>
                </MenubarMenu>
                <MenubarMenu>
                    <ModeToggle />
                </MenubarMenu>
                {navItems.map((item) => (
                    <MenubarMenu key={item.name}>
                        {item.active && item.name !== "Search" && (
                            <Button variant="ghost" onClick={() => navigate(item.to)} className=" text-wrap w-12">{item.name}</Button>
                        )}
                        {item.name === "Search" && (
                            <div className="divide-x divide-gray-500 hidden sm:flex flex-row justify-center items-center ">
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
                    </MenubarMenu>
                ))
                }
                {authStatus &&
                    <MenubarMenu>
                        <MenubarTrigger>
                            <div>
                                <VideoIcon className="sm:w-8 sm:h-8  text-white " />
                                <span className="sm:text-sm text-xs font-extralight text-white text-center">Upload</span>
                            </div>
                        </MenubarTrigger>
                        <MenubarContent>
                            {/* <MenubarItem>
                                <Link to={`/${user?.data?.username}/tweets`} >Create Tweet</Link>
                            </MenubarItem>
                            <MenubarSeparator /> */}
                            <MenubarItem>
                                <Link to={'/channel/uploadvideo'} >Upload Video</Link>
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                }
                {authStatus &&
                    <MenubarMenu>
                        <MenubarTrigger>
                            <Avatar className="max-w-[120px] sm:h-14 h-10 sm:w-14 w-10">
                                <AvatarImage src={user?.data?.avatar?.secure_url} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </MenubarTrigger>
                        <MenubarContent>
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
                            <MenubarSeparator />
                            <MenubarItem>
                                <Link to={`/${user?.data?.username}/videos`} >View your channel</Link>
                            </MenubarItem>
                            <MenubarItem>
                                <Link to={`/channel/dashboard`} >View your dashboard</Link>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem>
                                <LogoutBtn />
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                }
            </Menubar>
        </header>
    )

}

export default Header