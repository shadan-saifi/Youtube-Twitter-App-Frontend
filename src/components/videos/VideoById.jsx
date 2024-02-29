import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getVideoById } from '../../services/videoService';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import VideoJS from './VideoJS';


function VideoById(props) {
    const [video, setVideo] = useState(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const videoRef = useRef(null)

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

    const playerRef = React.useRef(null);

    const videoJsOptions = {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        muted: true,
        // aspectRatio: "16:9",
        enableSmoothSeeking: true,
        nativeControlsForTouch: true,
        notSupportedMessage: "video format not supported",
        playbackRates: [0.5, 1, 1.5, 2],
        playsinline: true,
        preferFullWindow: true,
        techCanOverridePoster: true,
        userActions: {
            hotkeys: true
        },
      
        controlBar: {
            skipButtons: {
                forward: 10,
                backward: 10
            }
        },
        poster: video?.thumbnail?.secure_url,
        sources: [{
            src: video?.videoFile?.secure_url,
            type: 'video/mp4'
        }]
    };

    const handlePlayerReady = (player) => {
        playerRef.current = player;

        // You can handle player events here, for example:
        player.on('waiting', () => {
            videojs.log('player is waiting');
        });

        player.on('dispose', () => {
            videojs.log('player will dispose');
        });
    };

    return !loading ? (
        <div className='max-h-[480px] aspect-video mt-10 ' >
            <VideoJS options={videoJsOptions} onReady={handlePlayerReady}  />

            {/* <video src={video?.videoFile?.secure_url} type="video/*" poster={video?.thumbnail?.secure_url} controls loop autoPlay playsInline
                ref={videoRef} className="video-js" >
                {video?.title}
            </video> */}
        </div>
    ) : (<div>...Loading</div>)
}

export default VideoById;