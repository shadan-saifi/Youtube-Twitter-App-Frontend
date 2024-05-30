import React from 'react';
import { useParams } from 'react-router-dom';
import { GetAllUserPlaylists } from '../../components';

function UserPlaylistPage() {
    const { username } = useParams()

    return (
        <div>
            <GetAllUserPlaylists username={username} />
        </div>
    );
}

export default UserPlaylistPage;