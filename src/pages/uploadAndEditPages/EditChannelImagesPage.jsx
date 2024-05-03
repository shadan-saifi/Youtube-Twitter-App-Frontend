import React, { useEffect, useState } from 'react';
import { EditChannelAvatar, EditChannelCoverImage } from '../../components';
import { useParams } from 'react-router-dom';
import { getUserChannelProfile } from '../../services/userService';

function EditChannelImagesPage(props) {
    const [user, setUser] = useState("")

    const {username} = useParams()

    useEffect(() => {
        (async () => {
            try {
                if (username) {
                    const response = await getUserChannelProfile({ username })
                    if (response) setUser(response?.data)
                }
            } catch (error) {
                throw error
            }
        })()
    }, [username])
    return (
        <div className='w-full'>
            <EditChannelAvatar username={username} user={user} />
            <hr className="my-4 w-full border-t-2 border-blue-500" />
            <EditChannelCoverImage username={username} user={user}/>
        </div>
    );
}

export default EditChannelImagesPage;