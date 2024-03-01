import React from 'react';
import { Link } from 'react-router-dom';
import ToggleSubscription from '../userProfile/ToggleSubscription';

function VideoDetails({ video, isSubscribed, setIsSubscribed }) {

    const handleSubscriptionChange = (newSubscriptionStatus) => {
        setIsSubscribed(newSubscriptionStatus);
    };



    const handleSubscribersCount = (count) => {
        if (count < 1000) {
            return `${count} subscriber${count !== 1 && 0 ? "s" : ""}`
        } else if (count >= 1000 && count < 100000) {
            return `${Math.floor(count / 1000)}k subscribers`
        } else if (count >= 100000 && count < 10000000) {
            return `${Math.floor(count / 100000)}lakh subscribers`
        } else {
            return `${Math.floor(count / 10000000)}crore subscribers`
        }
    }


    return (
        <div className='md:my-4 my-1 flex flex-row justify-between items-center'>
            <Link to={`/${video?.owner?.username}`} className='flex flex-row justify-center items-center'>
                <img src={video?.owner?.avatar?.secure_url} alt="avatar image" 
               className="object-cover aspect-square md:max-w-16 sm:max-w-12 max-w-12 rounded-full" />
                <div className='ml-4 flex flex-col justify-center items-start'>
                    <div className=' font-bold md:text-2xl text-xl text-blue-500'>{video?.owner?.fullname}</div>
                    <div>{handleSubscribersCount(video?.subscribersCount)}</div>
                </div>
            </Link>
            <div>
                <ToggleSubscription isSubscribed={isSubscribed} username={video?.owner?.username} onSubscriptionChange={handleSubscriptionChange} />
            </div>
            <div>

            </div>
        </div>
    );

}

export default VideoDetails;