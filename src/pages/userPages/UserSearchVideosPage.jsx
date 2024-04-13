import React from 'react';
import { useParams } from 'react-router-dom';
import { GetVideos } from '../../components';

function UserSearchVideosPage(props) {
    const { username } = useParams()


    return (
        <div>
            <GetVideos username={username}/>
        </div>
    );
}

export default UserSearchVideosPage;