import React, { useEffect, useState } from 'react';
import { UploadAndEditVideo } from '../../components';
import { getVideoById } from '../../services/videoService';
import { useParams } from 'react-router-dom';

function EditVideoPage() {
    const [video, setVideo] = useState("")

    const { videoId } = useParams()
    useEffect(() => {
        (async () => {
            try {
                if (videoId) {
                    const response = await getVideoById({ videoId })
                    setVideo(response?.data)
                }
            } catch (error) {
               throw error
            }
        })()
    }, [videoId])

    return (
            <UploadAndEditVideo className="w-full" video={video} />
    );
}

export default EditVideoPage;