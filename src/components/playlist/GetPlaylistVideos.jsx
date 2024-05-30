import React from 'react';
import usePlaylistInfo from '../../hooks/usePlaylistInfo';
import handleDuration from "../../hooks/handleDuration.js"
import handleViews from "../../hooks/handleViews.js"
import handleUploadDate from '../../hooks/handleUploadDate';
import { Link, NavLink } from 'react-router-dom';
function GetPlaylistVideos({ playlistId }) {
    const { error, loading, playlist } = usePlaylistInfo({ playlistId })

    return !loading ? (
        !error ? (
            playlist?.data?.allVideos?.map((video, i) => (
                <NavLink key={video?._id} to={`/watch?v=${encodeURIComponent(video?._id)}&list=${encodeURIComponent(playlist?.data?._id)}&index=${i + 1}`}
                >
                    <div className='flex flex-row justify-start items-start w-full dark:hover:bg-gray-900 hover:bg-gray-100 active:scale-95 rounded-xl px-2'>
                        <div className="text-center text-xl p-4 my-auto">{i + 1}</div>
                        <div className=' relative'>
                            <img src={video?.thumbnail?.secure_url} alt={video?.title} className='bg-gray-100 rounded-xl max-w-56 my-4 aspect-video' />
                            <span className="absolute right-2 bottom-6 text-lg text-white px-1 bg-gray-600 bg-opacity-70 rounded-md">
                                {handleDuration(video?.duration)}
                            </span>
                        </div>
                        <div className=' p-4 my-4 w-full flex flex-col justify-start items-start grow'>
                            <div className='text-xl font-semibold'>{video?.title}</div>
                            <div className='w-full flex flex-row justify-between items-center space-x-6'>
                                <div>{video?.owner?.fullname}</div>
                                <div>{handleViews(video?.views)}</div>
                                <div>{handleUploadDate(video?.createdAt)}</div>
                            </div>
                        </div>
                    </div>
                </NavLink>
            ))
        ) : null
    ) : null;
}

export default GetPlaylistVideos;