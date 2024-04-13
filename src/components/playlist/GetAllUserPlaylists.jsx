import React, { useEffect, useState } from 'react';
import { getUserPlaylists } from '../../services/playlistService';
import { Link } from 'react-router-dom';
import handleUploadDate from '../../hooks/handleUploadDate';

function GetAllUserPlaylists({ username }) {
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [allPlaylists, setAllPlaylists] = useState([])


    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                const response = await getUserPlaylists({ username })
                if (response) {
                    setAllPlaylists(response)
                    setLoading(false)
                }
            } catch (error) {
                setError(error.response?.data?.message || "An error occurred");
                setLoading(false)
            }
        })
            ()
    }, [])


    return !loading ? (
        <div>
            {error && <p className="text-red-600 m-3 p-3 text-center">{error}</p>}
            <div className=" grid grid-flow-row sm:grid-cols-2 md:grid-cols-4 grid-cols-1 gap-4 my-16">
                {
                    allPlaylists?.data?.playlists?.length !== 0 ? (
                        allPlaylists?.data?.playlists?.map((playlist) => (
                            <div key={playlist?._id} className="max-w-72 hover:scale-[1.01] ">
                                <Link to={`/watch?v=${encodeURIComponent(playlist?.allVideos[0]?._id)}&list=${encodeURIComponent(playlist?._id)}`}>
                                    <div className="relative">
                                        <img src={playlist?.allVideos[0]?.thumbnail?.secure_url} alt={playlist?.allVideos[0]?.title}
                                            className="rounded-2xl"
                                        />
                                        <span className="absolute right-3 bottom-1 text-lg text-white px-1  bg-gray-600 bg-opacity-70 rounded-md">
                                            {playlist?.TotalVideos} Videos</span>
                                    </div>
                                </Link>
                                <div className='m-2 flex flex-col justify-center items-between'>
                                    <div className='flex flex-row justify-between items-center'>
                                        <div className='text-lg font-semibold'>{playlist?.name}</div>
                                        <div>{handleUploadDate(playlist?.updatedAt)}</div>
                                    </div>
                                    <Link to={`/playlist?list=${encodeURIComponent(playlist?._id)}`} className='hover:font-semibold hover:text-blue-500 active:scale-95'>
                                        See full playlist
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (<div>{allPlaylists?.message || "No playlists to show"}</div>)
                }
            </div>
        </div >
    ) : (<div>...Loading</div>)
}

export default GetAllUserPlaylists;