import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getVideoById } from '../../services/videoService';

function VideoById(props) {
    const [video, setVideo] = useState(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const [searchParams, _] = useSearchParams();
    const videoId = searchParams.get("v")
    console.log("video id on component", videoId);
    useEffect(() => {
        if (videoId) {
            (async () => {
                try {
                    setLoading(true);
                    const videoData = await getVideoById({ videoId });
                    console.log("videoData:",videoData);
                    if (videoData?.data?.videoFile) {
                        setVideo(videoData?.data?.videoFile?.url);
                    } else {
                        setError("Video not found");
                    }
                } catch (error) {
                    setError("An error occurred while fetching the video");
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [videoId]);
    console.log("video url", video);


    return (
        <div>
            <video src={video} type='video/mp4' controls loop autoPlay width={400} height={350} >
                
            </video>
        </div>
    );
}

export default VideoById;