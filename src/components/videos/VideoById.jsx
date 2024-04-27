import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import VideoJS from './VideoJS';


function VideoById({ video }) {
    const videoRef = useRef(null)

    const playerRef = React.useRef(null);

    const videoJsOptions = {
        autoplay: false,
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
            },
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

    return (
        <div className='h-full aspect-video mt-10 ' >
            <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
        </div>
    )
}

export default VideoById;