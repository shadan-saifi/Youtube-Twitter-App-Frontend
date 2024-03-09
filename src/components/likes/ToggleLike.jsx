import React, { useEffect, useMemo, useState } from 'react';
import { toggleVideoLike } from '../../services/likeService';
import { getVideoById } from '../../services/videoService';
import { useSelector } from 'react-redux';

function ToggleLike({ videoId }) {
    const [error, setError] = useState("")
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
                        setError("error");
                    }
                } catch (error) {
                    console.log(error.response?.data?.message);
                    setError( "error ");
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
    }, [videoId, video, user, likeActionPerformed]); 
    


    const handleLike = async () => {
        try {
            setError("");
            const response = await toggleVideoLike({ videoId });
            console.log("response of togglemliek:", response);
            setIsLiked(response?.message === "video liked successfully")
            setLikeActionPerformed(true); // Set like action performed flag

        } catch (error) {
            console.log(error.response?.data?.message || "An error occurred");
            setError("error");
        }
    };
  
    const handleLikeCount = useMemo(() => {
        return (count) => {
            console.log("count of like", count);
            if (count < 1000) {
                return `${count} like${count !== 1 ? "s" : ""}`;
            } else if (count >= 1000 && count < 100000) {
                return `${Math.floor(count / 1000)}k likes`;
            } else if (count >= 100000 && count < 10000000) {
                return `${Math.floor(count / 100000)}lakh likes`;
            } else {
                return `${Math.floor(count / 10000000)}crore likes`;
            }
        };
    }, []);
    console.log("isLiked:", isLiked);

    return (
        <div>
            {error && <p className="text-red-600 m-3 p-3 text-center">{error}</p>}
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