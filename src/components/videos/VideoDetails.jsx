import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ToggleSubscription from '../userProfile/ToggleSubscription';
import ToggleLike from '../likes/ToggleLike';
import { getVideoById } from '../../services/videoService';
import handleSubscribersCount from '../../hooks/handleSubscribersCount';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"


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
        <div>
            {error && <p className="text-red-600 m-3 p-3 text-center">{error}</p>}
            <div className='flex flex-col justify-center items-start'>
                <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                    {video?.title}
                </h2>
                <div className='md:my-4 my-1 max-w-[850px] flex flex-row justify-between items-center w-full'>
                    <Link to={`/${video?.owner?.username}`} className='flex flex-row justify-center items-center'>
                        <Avatar className="max-w-[120px] size-12 sm:size-14 md:size-16">
                            <AvatarImage src={video?.owner?.avatar?.secure_url} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className='ml-4 flex flex-col justify-center items-start'>
                            <h3 className='md:text-2xl text-xl text-blue-500 scroll-m-20 font-semibold tracking-tight'>{video?.owner?.fullname}</h3>
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
            </div>
        </div>
    ) :  (
        <div className=" flex flex-col justify-center items-center w-full h-svh space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>)

}

export default VideoDetails;