import React, { useEffect, useState } from 'react';
import { GetPlaylistVideos, VideoById, VideoComments, VideoDescription, VideoDetails } from '../../components';
import { useSearchParams } from 'react-router-dom';
import { getVideoById } from '../../services/videoService';
import { Skeleton } from "@/components/ui/skeleton"


function VideoByIdPage(props) {

    const [video, setVideo] = useState("")

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const [searchParams, _] = useSearchParams();
    const videoId = searchParams.get("v")
    const playlistId = searchParams.get("list")
    const index = searchParams.get("index")

    const [videoLoaded, setVideoLoaded] = useState(false);



    useEffect(() => {
        ; (async () => {
            if (videoId) {
                try {
                    setVideoLoaded(false)
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
                    setVideoLoaded(true); // Set videoLoaded to true when video data is fetched
                }
            } else if (playlistId && videoId) {
                try {
                    const { error, loading, playlist } = usePlaylistInfo({ playlistId })
                    setLoading(loading)
                    setVideoLoaded(false)
                    setError(error)
                    if (playlist?.data) {
                        if (index) {
                            setVideo(playlist?.data?.allVideos[index - 1])
                            setVideoLoaded(true)
                        }
                    } else {
                        setError("playlist not found")
                    }
                } catch (error) {
                    setError(error.response?.data?.message || "An error occurred while fetching the video");
                } finally {
                    setLoading(false);
                }
            }
        }
        )();
    }, [videoId, playlistId, index]);

    return !loading ? (
        <div className='h-full'>
            {error && <p className="text-red-600 m-3 p-3 text-center">{error}</p>}

            <div className='h-full'>
                {
                    videoId && !playlistId ? (
                        <div className="max-w-[840px] mx-auto">
                            <VideoById video={video} />
                        </div>
                    ) : (
                        <div className='bg-gray-200 dark:bg-transparent dark:border rounded-2xl lg:h-[540px] max-h-screen  space-y-14 flex flex-col lg:flex-row  justify-start items-start'>
                            <div className=' lg:h-[480px] sm:h-[1800px] h-[1280px] pl-6'>
                                <VideoById video={video} />
                            </div>
                            <div className=" lg:max-h-[480px] max-h-screen overflow-y-auto overflow-x-hidden" >
                                <GetPlaylistVideos playlistId={playlistId} />
                            </div>
                        </div>
                    )
                }
                <div className='max-w-[840px] mx-auto'>
                    {
                        videoLoaded && (
                            <div>
                                <div>
                                    <VideoDetails videoId={videoId} />
                                </div>
                                <div>
                                    <VideoDescription video={video} />
                                </div>
                                <div className='h-full w-full'>
                                    <VideoComments videoId={videoId} />
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>

    ) : (<div className=" flex flex-col justify-center items-center w-full h-svh space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
        </div>
    </div>)
}

export default VideoByIdPage;