import React, { useEffect, useState } from 'react';
import { GetPlaylistVideos, GetVideoComments, VideoById, VideoDescription, VideoDetails } from '../../components';
import { useSearchParams } from 'react-router-dom';
import { getVideoById } from '../../services/videoService';
function VideoByIdPage(props) {

    const [video, setVideo] = useState("")

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const [searchParams, _] = useSearchParams();
    const videoId = searchParams.get("v")
    const playlistId = searchParams.get("list")
    const index = searchParams.get("index")

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
            }else if(playlistId && videoId){
                const { error, loading, playlist } = usePlaylistInfo({ playlistId })
                setLoading(loading)
                setError(error)
                if(playlist?.data){
                    if(index){
                        setVideo(playlist?.data?.allVideos[index-1])
                    }
                    else{
                    }
                }else{
                    setError("playlist not found")
                }
            }
        }
        )();
    }, [videoId,playlistId,index]);
    console.log("video:", video);

    return !loading ? (
        error ? <p className="text-red-600 m-3 p-3 text-center">{error}</p>
            : (
                <div>
                    {
                        videoId && !playlistId ? (
                            <div className="max-w-[840px]">
                                <VideoById  video={video} />
                            </div>
                        ) : (
                            <div className='bg-gray-200 rounded-2xl lg:h-[540px] max-h-screen  space-y-14 flex flex-col lg:flex-row  justify-start items-start'>
                                <div className=' lg:h-[480px] sm:h-[1800px] h-[1280px] pl-6'>
                                    <VideoById video={video} />
                                </div>
                                <div className=" lg:max-h-[480px] max-h-screen overflow-y-auto overflow-x-hidden" >
                                    <GetPlaylistVideos playlistId={playlistId} />
                                </div>
                            </div>
                        )
                    }
                    <div>
                        <VideoDetails videoId={videoId} />
                    </div>
                    <div>
                        <VideoDescription video={video} />
                    </div>
                    <div className='h-full w-full'>
                        <GetVideoComments videoId={videoId} />
                    </div>
                </div>

            )
    ) : (<div>...Loading</div>)
}

export default VideoByIdPage;