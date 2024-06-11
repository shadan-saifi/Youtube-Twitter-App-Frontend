import React, { useState } from 'react';
import usePlaylistInfo from '../../hooks/usePlaylistInfo';
import handleDuration from "../../hooks/handleDuration.js"
import handleViews from "../../hooks/handleViews.js"
import handleUploadDate from '../../hooks/handleUploadDate';
import { NavLink } from 'react-router-dom';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ThreeDotsMenuIcon from '../icons/ThreeDotsMenuIcon';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';
import { removeVideoFromPlaylist } from '@/services/playlistService';

function GetPlaylistVideos({ playlistId }) {
    const { error, loading, playlist } = usePlaylistInfo({ playlistId })
    const handleDeleteVideoFromPlaylist = async ({ playlistId, videoId }) => {
        try {
            const response = await removeVideoFromPlaylist({ playlistId, videoId })
            if (response.success === true) {
                window.location.reload();
            }
        } catch (error) {
            console.log("error while deleting video from playlist:", error);
            alert(error.response?.data?.message || "An error occurred while deleting video from playlist")
        }
    }

    return !loading ? (
        !error ? (
            playlist?.data?.allVideos?.map((video, i) => (

                <div className='flex flex-row justify-start items-start w-full'>
                    <div className="text-center text-xl p-4 my-auto">{i + 1}</div>
                    <NavLink key={video?._id} to={`/watch?v=${encodeURIComponent(video?._id)}&list=${encodeURIComponent(playlist?.data?._id)}&index=${i + 1}`}>
                        <div className=' relative w-full  dark:hover:bg-gray-900 hover:bg-gray-100 active:scale-95 rounded-xl px-2 py-[1px]'>
                            <img src={video?.thumbnail?.secure_url} alt={video?.title} className={`bg-gray-100 rounded-xl0 ${video?.thumbnail?.secure_url ? `max-w-56` : `w-48`} my-4 aspect-video object-cover`} />
                            <span className="absolute right-8 bottom-6 text-lg text-white px-1 bg-gray-600 bg-opacity-70 rounded-md">
                                {handleDuration(video?.duration)}
                            </span>
                        </div>
                    </NavLink>
                    <div className=' p-4 my-4 w-full flex flex-col justify-start items-start grow'>
                        <div className='text-xl font-semibold'>{video?.title}</div>
                        <div className='flex flex-row justify-between items-center w-full'>
                            <div>{video?.owner?.fullname}</div>
                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <ThreeDotsMenuIcon />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <div variant="ghost" onClick={() => handleDeleteVideoFromPlaylist({ playlistId, videoId: video?._id })}>Delete Video From Playlist</div>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                    </DropdownMenuContent>
                                </DropdownMenu>

                            </div>
                        </div>
                        <div className='w-full flex flex-row justify-between items-center space-x-6'>
                            <div>{handleViews(video?.views)}</div>
                            <div>{handleUploadDate(video?.createdAt)}</div>
                        </div>
                    </div>
                </div>
            ))
        ) : null
    ) : null;
}

export default GetPlaylistVideos;