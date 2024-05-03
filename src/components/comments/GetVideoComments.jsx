import React, { useState, useEffect, useRef } from 'react';
import { getVideoComments } from '../../services/commentService';
import { Link } from 'react-router-dom';
import handleUploadDate from '../../hooks/handleUploadDate';
import AddAndEditVideoComment from './AddAndEditVideoComment';

function GetVideoComments({ videoId }) {
    const [allComments, setAllComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("")
    const commentsContainerRef = useRef(null);
    const [updateComment, setUpdateComment] = useState(false);


    const fetchComments = async (skip, limit) => {
        setLoading(true);
        try {
            const response = await getVideoComments({ videoId, skip, limit });
            if (response.success && Array.isArray(response.data)) {
                if (updateComment && skip === 0) {
                    setAllComments([...response.data, ...allComments]);
                } else {
                    setAllComments(prevComments => [...prevComments, ...response.data]);
                }
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
            setError(error.response.data.message)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let skip = 0;
        let limit = 1; // Number of comments to fetch per request

        const observer = new IntersectionObserver(     //a browser API for lazy loading, scrolling comments etc
            entries => {
                if (entries[0].isIntersecting && !loading )   // comments are only fetched when the observer detects intersection and the loading state is not active. This prevents multiple fetches happening simultaneously.
                {
                    fetchComments(skip, limit)
                    skip += limit; // Increment skip when reaching bottom
                }
            },
            { root: null, threshold: 0.4 }
        );

        if (commentsContainerRef.current) {
            observer.observe(commentsContainerRef.current);
        }

        return () => {
            if (commentsContainerRef.current) {
                observer.unobserve(commentsContainerRef.current);
            }
        };
    }, [videoId]);

    useEffect(()=>{
        if(updateComment===true){
            fetchComments(0,1)
        }
    },[updateComment])
 console.log("updateComment:",updateComment);


    console.log("commentdh:", allComments);
    return (
        <div>
            <div>
                <AddAndEditVideoComment videoId={videoId} setUpdateComment={setUpdateComment} />
            </div>
            {error && <p className="text-red-600 m-3 p-3 text-center">{error}</p>}
            {loading ? (
                <div>Loading...</div>
            ) : (
                allComments?.data?.length !== 0 ? (
                    <div ref={commentsContainerRef}>
                        {allComments?.map((comment, index) => (
                            <div key={index} className='flex flex-row justify-start items-start my-4'>
                                <Link to={`/${comment?.ownerOfComment?.username}`} className='min-w-12 m-2'>
                                    <img src={comment?.ownerOfComment?.avatar?.secure_url} alt={comment?.ownerOfComment?.fullname}
                                        className='object-cover sm:size-10 md:size-12 size-8 rounded-full' />
                                </Link>
                                <div className='flex flex-col justify-start items-start'>
                                    <div>
                                        <Link to={`/${comment?.ownerOfComment?.username}`} className='font-bold'>@{comment?.ownerOfComment?.username}</Link>
                                        <span className='text-sm mx-2'>{handleUploadDate(comment?.createdAt)}</span>
                                    </div>
                                    <span >{comment?.content}</span>
                                </div>
                            </div>
                        ))}
                        {loading && <div>Loading more comments...</div>}
                    </div>
                ) : (
                    <div>No comments yet</div>
                )
            )}
        </div>
    );

}

export default GetVideoComments;
