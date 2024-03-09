import React, { useState } from 'react';

function VideoDescription({ video }) {
    const [showFullDescription, setShowFullDescription] = useState(false);

    const words = video?.description?.trim()?.split(" ")
    const shortDescription = words?.slice(0, 6).join(" ")
    const fullDescription = words?.join(" ")

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription)
    }

    const handleViews = (views) => {
        if (views < 1000) {
            return `${views} view${views !== 1 ? "s" : ""}`
        } else if (views >= 1000 && views < 100000) {
            return `${Math.floor(views / 1000)}k views`
        } else if (views >= 100000 && views < 10000000) {
            return `${Math.floor(views / 100000)}lakh views`
        } else {
            return `${Math.floor(views / 10000000)}crore views`
        }
    }
    const handleUploadDate = (createdAt) => {
        const currentDate = new Date();
        const createdAtDate = new Date(createdAt);

        const timeDifferenceInSeconds = Math.floor((currentDate - createdAtDate) / 1000);

        if (timeDifferenceInSeconds < 60) {
            return `${timeDifferenceInSeconds} second${timeDifferenceInSeconds !== 1 ? 's' : ''} ago`;
        } else if (timeDifferenceInSeconds < 3600) {
            const minutes = Math.floor(timeDifferenceInSeconds / 60);
            return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        } else if (timeDifferenceInSeconds < 86400) {
            const hours = Math.floor(timeDifferenceInSeconds / 3600);
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        } else if (timeDifferenceInSeconds < 2592000) {
            const days = Math.floor(timeDifferenceInSeconds / 86400);
            return `${days} day${days !== 1 ? 's' : ''} ago`;
        } else if (timeDifferenceInSeconds < 31536000) {
            const months = Math.floor(timeDifferenceInSeconds / 2592000);
            return `${months} month${months !== 1 ? 's' : ''} ago`;
        } else {
            const years = Math.floor(timeDifferenceInSeconds / 31536000);
            return `${years} year${years !== 1 ? 's' : ''} ago`;
        }
    };

    return (
        <div className='my-4 bg-blue-200 rounded-xl max-w-[850px] '>
            <div className='pt-2 flex justify-start items-center ml-4 gap-4 font-semibold'>
                <div>{handleViews(video?.views)}</div>
                <div>{handleUploadDate(video?.createdAt)}</div>
            </div>
            <div className='p-4 text-left '>
                {showFullDescription ? fullDescription : shortDescription}
                {!showFullDescription && words?.length>6 && <span onClick={toggleDescription} className='text-blue-700 font-semibold ml-2 cursor-pointer'>...show more</span>}
                {showFullDescription && words?.length>6 && <span onClick={toggleDescription} className='text-blue-700 font-semibold mi-2 cursor-pointer'>...show less</span>}
            </div>
        </div>
    );
}

export default VideoDescription;