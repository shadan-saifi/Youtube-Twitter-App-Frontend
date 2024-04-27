import React, { useEffect, useState } from 'react';
import { UploadAndEditVideo } from '../../components';
import { getVideoById } from '../../services/videoService';
import { useParams } from 'react-router-dom';

function UploadAndEditVideoPage() {
    const [video,setVideo]=useState("")

    const { videoId } = useParams()
    useEffect(() => {
        (async () => {
            try {
                if (videoId) {
                    const response = await getVideoById({ videoId })
                    setVideo(response?.data)
                }
            } catch (error) {

            }
        })()
    }, [videoId])

    return (
        <div className='bg-gray-100 rounded-2xl p-8 mx-auto max-w-[800px] content-center'>
            {
                videoId === null ? (<UploadAndEditVideo className="w-full" />
                ) : (<UploadAndEditVideo className="w-full" video={video}/>
                )
            }
        </div>
    );
}

export default UploadAndEditVideoPage;