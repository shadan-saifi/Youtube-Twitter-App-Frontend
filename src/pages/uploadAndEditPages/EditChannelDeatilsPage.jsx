import React, { useEffect, useState } from 'react';
import {  EditChannelDetails } from '../../components';
import { useParams } from 'react-router-dom';
import { getUserChannelProfile } from '../../services/userService';

function EditChannelDeatilsPage(props) {
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
            <EditChannelDetails username={username} user={user} />
        </div>
    );
}

export default EditChannelDeatilsPage;