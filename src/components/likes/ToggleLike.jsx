import React, { useEffect, useMemo, useState } from 'react';
import { toggleVideoLike } from '../../services/likeService';
import { getVideoById } from '../../services/videoService';
import { useSelector } from 'react-redux';
import handleLikeCount from '../../hooks/handleLikeCount';

function ToggleLike({ videoId }) {
    const [video, setVideo] = useState("")
    const [isLiked, setIsLiked] = useState("")
    const [likeActionPerformed, setLikeActionPerformed] = useState(false); // Flag state

    const authStatus = useSelector((state) => state.auth.status);
    const user = useSelector((state) => state.auth.userData);
    console.log("user:::",user);

    useEffect(() => {
        (async () => {
            if (videoId) {
                try {
                    const videoData = await getVideoById({ videoId });
                    if (videoData?.data) {
                        setVideo(videoData?.data);
                    } else {
                        console.log("error while fetching video details");
                    }
                } catch (error) {
                    console.log(error.response?.data?.message);
                }
            }
        })()
    }, [videoId, isLiked]);

    useEffect(() => {
        if (video?.likes && !likeActionPerformed) { 
            console.log("video.likes:", video?.likes);
            const isLikedByCurrentUser = video.likes.some(like => like?.likedBy === user?.data?._id);
            console.log("isLikedByCurrentUser:", isLikedByCurrentUser);
            setIsLiked(isLikedByCurrentUser);
        }
    }, [video, likeActionPerformed]); 
    
    const handleLike = async () => {
        try {
            const response = await toggleVideoLike({ videoId });
            console.log("response of togglemliek:", response);
            setIsLiked(response?.message === "video liked successfully")
            setLikeActionPerformed(true); // Set like action performed flag

        } catch (error) {
            console.log(error.response?.data?.message || "An error occurred");
        }
    };
  
  
    console.log("isLiked:", isLiked);

    return (
        <div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 cursor-pointer ${isLiked ? 'text-red-600 fill-red-600' : 'text-gray-500 fill-none'}  hover:text-red-900 active:scale-95`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={authStatus ? handleLike:() => alert("Please login to like video.")}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41 1.11 4.5 2.5C14.09 4.11 15.76 3 17.5 3c3.08 0 5.5 2.42 5.5 5.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"
                />
            </svg>
            <div>{handleLikeCount(video?.likesCount)}</div>
        </div>
    );
}

export default ToggleLike;