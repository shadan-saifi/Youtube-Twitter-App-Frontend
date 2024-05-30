import React from 'react';
import { GetPlaylistDetails, GetPlaylistVideos } from '../../components';
import { useSearchParams } from 'react-router-dom';

function GetPlaylistPage() {
    const [searchParams, _] = useSearchParams();
    const playlistId = searchParams.get("list");

    return (
        <div className=' ml-14 flex lg:flex-row flex-col lg:justify-start justify-center lg:items-start items-center'>
            <div className="lg:max-h-screen max-h-[400px] max-w-full lg:max-w-96  overflow-y-auto">
                <GetPlaylistDetails playlistId={playlistId} />
            </div>
            <div className='ml-14 max-w-[650px] '>
                <GetPlaylistVideos playlistId={playlistId}/> 
            </div>
        </div>
    ); 
}

export default GetPlaylistPage;
