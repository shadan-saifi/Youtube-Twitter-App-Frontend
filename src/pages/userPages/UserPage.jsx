import React from 'react';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import { InputSearch, UserProfile } from '../../components';

function UserPage() {

    const { username } = useParams()


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
            <div className="flex flex-col justify-start items-center">
                <nav className="relative flex sm:flex-row flex-col sm:justify-between justify-center sm:items-center  shadow-lg  gap-4 w-full bg-blue-500 text-white rounded-lg">
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
                    <InputSearch username={username} className="absolute"/>
                </nav>
            </div>
            <Outlet/>
        </div>
    );
}

export default UserPage;