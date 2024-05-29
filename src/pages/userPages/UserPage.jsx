import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import { UserProfile } from '../../components';
import { Input } from '@/components/ui/input';
import { Separator } from "@/components/ui/separator"


function UserPage() {

    const { username } = useParams()
    const [query, setQuery] = useState("")
    const navigate = useNavigate()
    const handleSearch = (e) => {
        if (e.key === 'Enter') {
          navigate(`/${username}/search?q=${encodeURIComponent(query)}`);
        }
      };

    const navItems = [
        // {
        //     name: "Home",
        //     to: `/${username}/featured`,
        // },
        {
            name: "Videos",
            to: `/${username}/videos`,
        },
        {
            name: "Playlists",
            to: `/${username}/playlists`,
        },
        // {
        //     name: "Tweets",
        //     to: `/${username}/tweets`,
        // },
    ]
    return (
        <div>
            <UserProfile username={username} />
            <Separator />
            <nav className="relative flex flex- sm:flex-row flex-col sm:justify-around justify-center items-center  shadow-lg  gap-4 w-full bg-blue-500 dark:bg-transparent text-white rounded-lg py-0.5 mt-2">
                {navItems.map((item) => (
                    <NavLink key={item.name} to={item.to}
                        className={({ isActive, isTransitioning, isPending }) => [
                            isActive ? 'bg-blue-400 dark:bg-gray-800' : '',
                            isTransitioning ? 'bg-blue-600 dark:bg-gray-900' : '',
                            isPending ? 'bg-blue-300 dark:bg-gray-600' : '',
                            "border-2 border-blue-500 dark:border-gray-500 hover:border-blue-800 dark:hover:border-gray-600 hover:bg-blue-400 dark:hover:bg-gray-950 active:scale-95 h-full px-3 py-1 rounded-lg"
                        ].join(' ')}>
                        {item.name}
                    </NavLink>
                ))}
                <Input
                    type="search"
                    placeholder="Search the channel videos"
                    autoCorrect="off"
                    spellCheck="false"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    className="dark:bg-off-white text-black dark:text-white max-w-full mr-3 sm:max-w-36 md:max-w-72"
                    
                />
            </nav>

            <Outlet />
        </div>
    );
}

export default UserPage;