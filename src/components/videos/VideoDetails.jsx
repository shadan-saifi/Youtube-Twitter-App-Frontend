import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ToggleSubscription from '../userProfile/ToggleSubscription';
import ToggleLike from '../likes/ToggleLike';
import { getVideoById } from '../../services/videoService';
import handleSubscribersCount from '../../hooks/handleSubscribersCount';

function VideoDetails({ videoId }) {
    const [isSubscribed, setIsSubscribed] = useState("")
    const [video, setVideo] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        (async () => {
            if (videoId) {
                try {
                    setLoading(true);
                    const videoData = await getVideoById({ videoId });
                    if (videoData?.data) {
                        setVideo(videoData?.data);
                        setIsSubscribed(videoData?.data?.isSubscribed)
                    } else {
                        setError("Video details not found");
                    }
                } catch (error) {
                    setError(error.response?.data?.message || "An error occurred while fetching the video details");
                } finally {
                    setLoading(false);
                }
            }
        })()
    }, [videoId, isSubscribed]);

    const handleSubscriptionChange = (newSubscriptionStatus) => {
        setIsSubscribed(newSubscriptionStatus);
    };

    return !loading ? (
        error ? <p className="text-red-600 m-3 p-3 text-center">{error}</p>
            : (
                <div className='md:my-4 my-1 max-w-[850px] flex flex-row justify-between items-center'>
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
                        <ToggleLike videoId={videoId} />
                    </div>
                </div>

            )
    ) : (<div>...Loading</div>)

}

export default VideoDetails;