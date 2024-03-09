import React, { useEffect, useState } from 'react';
import { getVideoComments } from '../../services/commentService';

function GetVideoComments({ videoId }) {
    const [allComments, setAllComments] = useState("")

    useEffect(() => {
        (async () => {
            try {
                const response = await getVideoComments({ videoId })
                if (response) {
                    setAllComments(response)
                }
            } catch (error) {

            }
        })()
    })
    return (
        <div>
           
        </div>
    );
}

export default GetVideoComments;