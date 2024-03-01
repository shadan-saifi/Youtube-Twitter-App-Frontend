import React, { useEffect, useState } from 'react';
import { VideoById, VideoDetails } from '../../components';
import { useSearchParams } from 'react-router-dom';
import { getVideoById } from '../../services/videoService';
function VideoByIdPage(props) {

    const [video, setVideo] = useState(null)
    const [isSubscribed, setIsSubscribed] = useState(false)

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const [searchParams, _] = useSearchParams();
    const videoId = searchParams.get("v")


    useEffect(() => {
        if (videoId) {
            (async () => {
                try {
                    setLoading(true);
                    const videoData = await getVideoById({ videoId });
                    if (videoData?.data) {
                        setVideo(videoData?.data);
                        setIsSubscribed(videoData?.data?.isSubscribed)
                    } else {
                        setError("Video not found");
                    }
                } catch (error) {
                    setError(error.response?.data?.message || "An error occurred while fetching the video");
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [videoId]);
    console.log("video:", video);

    return !loading ? (
        error ? <p className="text-red-600 m-3 p-3 text-center">{error}</p>
            : (
                <div>
                    <div>
                        <VideoById video={video} />
                    </div>
                    <div>
                        <VideoDetails video={video} isSubscribed={isSubscribed} setIsSubscribed={setIsSubscribed} />
                    </div>
                </div>

            )
    ) : (<div>...Loading</div>)
}

export default VideoByIdPage;