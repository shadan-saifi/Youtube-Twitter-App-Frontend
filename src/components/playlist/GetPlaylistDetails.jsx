import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import handleUploadDate from '../../hooks/handleUploadDate';
import usePlaylistInfo from '../../hooks/usePlaylistInfo';

function GetPlaylistDetails({ playlistId }) {
    const { error, loading, playlist } = usePlaylistInfo({ playlistId })

    return !loading ? (
        <div >
            {error ?( <p className=" text-red-600 m-3 p-3 text-center">{error}</p>):(
            <div className='h-full w-full p-6 bg-slate-500 flex flex-col justify-center items-center rounded-2xl '>
                <div className='max-w-80 group hover:opacity-50'>
                    <Link to={`/watch?v=${encodeURIComponent(playlist?.data?.allVideos[0]?._id)}&list=${encodeURIComponent(playlist?.data?._id)}`}
                        className="w-full relative  ">
                        <img src={playlist?.data?.allVideos[0]?.thumbnail?.secure_url} alt={playlist?.data?.allVideos[0]?.title} />
                        <button className='group-active:scale-95 group-hover:opacity-100 opacity-0 text-white text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>Play All</button>
                    </Link>
                </div>
                <div className='text-white flex flex-col justify-center items-start w-full ml-4 my-2'>
                    <div className='font-semibold text-3xl '>{playlist?.data?.name}</div>
                    <div className='font-semibold text-lg '>{playlist?.data?.owner?.fullname}</div>
                    <div className='w-full flex flex-row justify-between items-center'>
                        <div >{playlist?.data?.totalVideos} videos</div>
                        <div>{playlist?.data?.totalViews} views</div>
                        <div>Last updated {handleUploadDate(playlist?.data?.createdAt)}</div>
                    </div>
                    <Link to={`/watch?v=${encodeURIComponent(playlist?.data?.allVideos[0]?._id)}&list=${encodeURIComponent(playlist?.data?._id)}`}
                        className='max-w-64 w-32 bg-white text-black text-xl text-center p-2 my-2 rounded-full hover:bg-gray-200 active:scale-95'>
                        Play all
                    </Link>
                    <div >{playlist?.data?.description}</div>
                </div>
            </div>)}
        </div>
    ) : (<div>...loading</div>)
}

export default GetPlaylistDetails;