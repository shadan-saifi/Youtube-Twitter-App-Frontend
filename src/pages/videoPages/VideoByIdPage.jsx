import React, { useEffect, useState } from 'react';
import { VideoById, VideoDescription, VideoDetails } from '../../components';
import { useSearchParams } from 'react-router-dom';
import { getVideoById } from '../../services/videoService';
function VideoByIdPage(props) {

    const [video, setVideo] = useState(null)

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const [searchParams, _] = useSearchParams();
    const videoId = searchParams.get("v")


    useEffect(() => {
        ; (async () => {
            if (videoId) {

                try {
                    setLoading(true);
                    const videoData = await getVideoById({ videoId });
                    if (videoData?.data) {
                        setVideo(videoData?.data);
                    } else {
                        setError("Video not found");
                    }
                } catch (error) {
                    setError(error.response?.data?.message || "An error occurred while fetching the video");
                } finally {
                    setLoading(false);
                }
            };
        }
        )();
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
                        <VideoDetails videoId={videoId} />
                    </div>
                    <div>
                        <VideoDescription video={video}/>
                    </div>
                </div>

            )
    ) : (<div>...Loading</div>)
}

export default VideoByIdPage;