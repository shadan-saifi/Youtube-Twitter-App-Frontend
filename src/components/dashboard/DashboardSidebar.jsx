import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DashboardIcon from '../icons/DashboardIcon';
import YourVideosIcon from '../icons/YourVideosIcon';
import PlaylistIcon from '../icons/PlaylistIcon';
import AllPostsIcon from '../icons/AllPostsIcon';
import CommentIcon from '../icons/CommentIcon';
import UploadVideoIcon from '../icons/UploadVideoIcon';

function DashboardSidebar(props) {
    const user = useSelector(state => state.auth.userData)
    return (
        <div className='flex  flex-col justify-start items-center w-full'>
            <img src={user?.data?.avatar?.secure_url} alt="avatar image"
                className='xl:max-w-44 lg:max-w-40 md:max-w-36 sm:max-w-32 max-w-24 rounded-lg aspect-square object-cover' />
            <div className='mt-6'>Your own channel</div>
            <div className='font-semibold text-blue-600'>{user?.data?.fullname}</div>
            <hr className="my-4 w-full border-t-2 border-blue-500" />
            <br />
            <div className='font-semibold space-y-1 w-full'>
                <div className='grid grid-cols-1 gap-4'>
                    <Link to={`/channel/dashboard`} className='hover:bg-cyan-400 dark:hover:bg-gray-800 hover:text-white p-1 rounded-lg active:scale-95 flex flex-row justify-start items-center gap-4'>
                        <div>
                            <DashboardIcon />
                        </div>
                        <span>Dashboard</span>
                    </Link>
                    <Link to={"/channel/videos"} className='hover:bg-cyan-400 dark:hover:bg-gray-800 hover:text-white p-1 rounded-lg active:scale-95 flex flex-row justify-start items-center gap-4'>
                        <div>
                            <YourVideosIcon />
                        </div>
                        <span>Your Videos</span>
                    </Link>
                    <Link to={"/"} className='hover:bg-cyan-400 dark:hover:bg-gray-800 hover:text-white p-1 rounded-lg active:scale-95 flex flex-row justify-start items-center gap-4'>
                        <div>
                            <PlaylistIcon />
                        </div>
                        <span>Your Playlists</span>
                    </Link>
                    {/* <Link to={"/"} className='hover:bg-cyan-400 dark:hover:bg-gray-800 hover:text-white p-1 rounded-lg active:scale-95 flex flex-row justify-start items-center gap-4'>
                        <div>
                            <AllPostsIcon />
                        </div>
                        <span>Your Posts</span>
                    </Link> */}
                    <Link to={"/"} className='hover:bg-cyan-400 dark:hover:bg-gray-800 hover:text-white p-1 rounded-lg active:scale-95 flex flex-row justify-start items-center gap-4'>
                        <div>
                            <CommentIcon />
                        </div>
                        <span>Comments</span>
                    </Link>
                    <Link to={'/channel/uploadvideo'} className='hover:bg-cyan-400 dark:hover:bg-gray-800 hover:text-white p-1 rounded-lg active:scale-95 flex flex-row justify-start items-center gap-4'>
                        <div>
                            <UploadVideoIcon />
                        </div>
                        <span>Upload Video</span>
                    </Link>
                </div>
            </div>

        </div>
    );
}

export default DashboardSidebar;