import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import {  InputBox, UserProfile } from '../../components';

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
        {
            name: "Home",
            to: `/${username}/featured`,
        },
        {
            name: "Videos",
            to: `/${username}/videos`,
        },
        {
            name: "Playlists",
            to: `/${username}/playlists`,
        },
        {
            name: "Tweets",
            to: `/${username}/tweets`,
        },
    ]
    return (
        <div>
            <UserProfile username={username} />
            <nav className="relative flex flex- sm:flex-row flex-col sm:justify-between justify-center items-center  shadow-lg  gap-4 w-full bg-blue-500 text-white rounded-lg">
                {navItems.map((item) => (
                    <NavLink key={item.name} to={item.to}
                        className={({ isActive, isTransitioning, isPending }) => [
                            isActive ? 'bg-blue-400' : '',
                            isTransitioning ? 'bg-blue-600 ' : '',
                            isPending ? 'bg-blue-300 ' : '',
                            "border-b-2 border-blue-500 hover:border-blue-800 hover:bg-blue-400 active:scale-95 h-full p-3 rounded-lg"
                        ].join(' ')}>
                        {item.name}
                    </NavLink>
                ))}
                <InputBox
                    type="search"
                    placeholder="Search the channel videos"
                    autoCorrect="off"
                    spellCheck="false"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    className={`text-black outline-none  max-w-full mr-3 sm:max-w-36 md:max-w-72  border-none`}
                />
            </nav>

            <Outlet />
        </div>
    );
}

export default UserPage;