import React from 'react';
import { GetUserSearchedVideos } from '../../components';
import { useParams, useSearchParams } from 'react-router-dom';

function UserSearchPage(props) {
    const { username } = useParams()


    return (
        <div>
            <GetUserSearchedVideos username={username}/>
        </div>
    );
}

export default UserSearchPage;