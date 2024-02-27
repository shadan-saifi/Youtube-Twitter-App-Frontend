import React from 'react';
import { GetAllUserVideos } from '../../components';
import { useParams } from 'react-router-dom';

function UserSearchPage(props) {
    const { username } = useParams()


    return (
        <div>
            <GetAllUserVideos username={username}/>
        </div>
    );
}

export default UserSearchPage;