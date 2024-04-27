import React from 'react';
import { GetChannelVideos } from '../../components';
import { useSelector } from 'react-redux';

function GetChannnelVideosPage(props) {

    const user = useSelector((state) => state.auth.userData);

    return (
        <div>
            <GetChannelVideos username={user?.data?.username}/>
        </div>
    );
}

export default GetChannnelVideosPage;