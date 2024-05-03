import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function DashboardSidebar(props) {
    const authStatus = useSelector(state => state.auth.status)
    const user = useSelector(state => state.auth.userData)
    console.log("user:", user);
    return (
        <div className='flex  flex-col justify-start items-center w-full'>
            <img src={user?.data?.avatar?.secure_url} alt="avatar image"
                className='xl:max-w-44 lg:max-w-40 md:max-w-36 sm:max-w-32 max-w-24 rounded-lg aspect-square object-cover' />
            <div className='mt-6'>Your own channel</div>
            <div className='font-semibold text-blue-600'>{user?.data?.fullname}</div>
            <hr className="my-4 w-full border-t-2 border-blue-500" />
            <br />
            <div className='font-semibold space-y-1 flex  flex-col justify-start items-center w-full'>
                <div className='flex flex-row justify-center items-center space-x-4 hover:bg-cyan-400 hover:text-white p-1 rounded-lg active:scale-95'>
                    <div>
                        <svg
                            viewBox="0 0 24 24"
                            preserveAspectRatio="xMidYMid meet"
                            focusable="false"
                            className="w-6 h-6" // Tailwind CSS classes to set width and height
                        >
                            <g>
                                <path
                                    d="M10 16V20H4V16H10ZM11 15H3V21H11V15ZM20 4V8H14V4H20ZM21 3H13V9H21V3ZM3 3V13H11V3H3ZM10 12H4V4H10V12ZM13 11V21H21V11H13ZM20 20H14V12H20V20Z"
                                    className="fill-current text-black" // Tailwind CSS class to set the fill color
                                ></path>
                            </g>
                        </svg>
                    </div>
                    <Link to={`/channel/dashboard`} >Dashboard</Link>
                </div>
                <div className='flex flex-row justify-center items-center space-x-4 hover:bg-cyan-400 hover:text-white p-1 rounded-lg active:scale-95'>
                    <div >
                        <svg
                            viewBox="0 0 24 24"
                            preserveAspectRatio="xMidYMid meet"
                            focusable="false"
                            className="w-6 h-6" // Tailwind CSS classes to set width and height
                        >
                            <g>
                                <path
                                    d="M4 5.99982H3V20.9998H18V19.9998H4V5.99982Z"
                                    className="fill-current text-black" // Tailwind CSS class to set the fill color
                                ></path>
                                <path
                                    d="M6 2.99982V17.9998H21V2.99982H6ZM11 13.9998V6.99982L17 10.4998L11 13.9998Z"
                                    className="fill-current text-black" // Tailwind CSS class to set the fill color
                                ></path>
                            </g>
                        </svg>
                    </div>
                    <Link to={"/channel/videos"}>Your Videos</Link>
                </div>
                <div className='flex flex-row justify-center items-center space-x-4 hover:bg-cyan-400 hover:text-white p-1 rounded-lg active:scale-95'>
                    <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-6 h-6" // Adjust width and height as needed
                        >
                            <path
                                className="fill-current text-black" // Set fill color to black
                                d="M22 7H2v1h20V7zm-9 5H2v-1h11v1zm0 4H2v-1h11v1zm2 3v-8l7 4-7 4z"
                            />
                        </svg>
                    </div>
                    <Link to={"/"}>Your Playlists</Link>
                </div>
                {/* <div className='flex flex-row justify-center items-center space-x-4 hover:bg-cyan-400 hover:text-white p-1 rounded-lg active:scale-95'>
                    <div>
                        <svg
                            viewBox="0 0 24 24"
                            className="w-6 h-6" // Adjust width and height as needed
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g>
                                <path
                                    className="stroke-current text-black" // Set stroke color to black
                                    d="M5 11H7V13H5V11ZM15 15H5V17H15V15ZM19 15H17V17H19V15ZM19 11H9V13H19V11ZM22 6H2V20H22V6ZM3 7H21V19H3V7Z"
                                />
                            </g>
                        </svg>
                    </div>
                    <Link to={"/"}>Your Posts</Link>
                </div> */}
                <div className='flex flex-row justify-center items-center space-x-4 hover:bg-cyan-400 hover:text-white p-1 rounded-lg active:scale-95'>
                    <div>
                        <svg
                            viewBox="0 0 24 24"
                            preserveAspectRatio="xMidYMid meet"
                            focusable="false"
                            className="w-6 h-6" // Tailwind CSS classes to set width and height
                        >
                            <g>
                                <path
                                    d="M8 7H16V9H8V7ZM8 13H13V11H8V13ZM5 3V16H15H15.41L15.7 16.29L19 19.59V3H5ZM4 2H20V22L15 17H4V2Z"
                                    className="fill-current text-black" // Tailwind CSS class to set the fill color
                                ></path>
                            </g>
                        </svg>
                    </div>
                    <Link to={"/"}>Comments</Link>
                </div>
                <div className='flex flex-row justify-center items-center space-x-4 hover:bg-cyan-400 hover:text-white p-1 rounded-lg active:scale-95'>
                    <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="pointer-events-none w-6 h-6"
                            viewBox="0 0 24 24"
                            focusable="false"
                        >
                            <path d="M14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2zm3-7H3v12h14v-6.39l4 1.83V8.56l-4 1.83V6m1-1v3.83L22 7v8l-4-1.83V19H2V5h16z" />
                        </svg>
                    </div>
                    <Link to={'/channel/uploadvideo'}>Upload Video</Link>
                </div>
            </div>
        </div>
    );
}

export default DashboardSidebar;