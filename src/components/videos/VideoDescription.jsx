import React, { useState } from 'react';
import handleViews from "../../hooks/handleViews"
import handleUploadDate from "../../hooks/handleUploadDate"

function VideoDescription({ video }) {
    const [showFullDescription, setShowFullDescription] = useState(false);

    const words = video?.description?.trim()?.split(" ")
    const shortDescription = words?.slice(0, 6).join(" ")
    const fullDescription = words?.join(" ")

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription)
    }

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