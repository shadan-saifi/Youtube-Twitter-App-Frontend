import { GetChannelPlaylists } from '@/components';
import React from 'react';
import { useSelector } from 'react-redux';

function GetChannelPlaylistsPage(props) {
    const user = useSelector((state) => state.auth.userData);

    return (
        <div>
            <GetChannelPlaylists username={user?.data?.username}/>
        </div>
    );
}

export default GetChannelPlaylistsPage;