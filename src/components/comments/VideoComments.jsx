import React, { useState, useEffect, useRef } from 'react';
import { getVideoComments } from '../../services/commentService';
import AddVideoComment from './AddVideoComment';
import { useSelector } from 'react-redux';
import DeleteVideoComment from './DeleteVideoComment';
import MenuIcon from '../icons/MenuIcon';
import GetVideoComment from './GetAndUpdateVideoComment';
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuGroup,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function VideoComments({ videoId }) {
    const [allComments, setAllComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("")
    const commentsContainerRef = useRef(null);
    const deleteCommentsRef = useRef(null);
    const commentDropdownRef = useRef(null);
    const dropdownButtonsRef = useRef(null)
    const videoCommentRef = useRef(null)
    const [addComment, setAddComment] = useState(false);
    const [activeCommentIndex, setActiveCommentIndex] = useState(null);
    const [activeUpdate, setActiveUpdate] = useState(false)
    const [textareaClicked, setTextareaClicked] = useState(false);

    const authStatus = useSelector((state) => state.auth.status)

    const fetchCommentsAndObserve = async (skip, limit) => {
        setLoading(true);
        try {
            const response = await getVideoComments({ videoId, skip, limit });
            if (response.success && Array.isArray(response.data)) {
                if (addComment === true && skip === 0) {
                    setAllComments(prevComments => [...response.data, ...prevComments]);
                } else {
                    setAllComments(prevComments => [...prevComments, ...response.data]);
                }
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
            setError(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let skip = 0;
        let limit = 1; // Number of comments to fetch per request

        const observerCallback = (entries) => {
            console.log("entries[0].isIntersecting", entries[0].isIntersecting);
            if (entries[0].isIntersecting && !loading && allComments.length % limit === 0) {
                fetchCommentsAndObserve(skip, limit);
                skip += limit;
            }
        };

        const observer = new IntersectionObserver(observerCallback, { root: null, threshold: 0.9 });

        if (commentsContainerRef.current) {
            observer.observe(commentsContainerRef.current);
        }

        if (addComment === true) {
            fetchCommentsAndObserve(0, 1);
            setAddComment(false);
        }

        return () => {
            if (commentsContainerRef.current) {
                observer.unobserve(commentsContainerRef.current);
            }
        };
    }, [videoId, addComment]);


    const toggleOptionDropdown = (index) => {
        setActiveCommentIndex(index === activeCommentIndex ? null : index)
        setActiveUpdate(false)
    }
    // useEffect(() => {
    //     const closeDropdown = (event) => {
    //         if (
    //             (commentDropdownRef.current &&
    //                 !commentDropdownRef.current.contains(event.target)) &&
    //             (dropdownButtonsRef.current &&
    //                 !dropdownButtonsRef.current.contains(event.target)) &&
    //             (videoCommentRef.current &&
    //                 !videoCommentRef.current.contains(event.target)) &&
    //             activeCommentIndex !== null
    //         ) {
    //             setActiveCommentIndex(null);
    //             setActiveUpdate(false)
    //             console.log("dropdown closed via useEffect");
    //         }
    //     };

    //     document.addEventListener("mousedown", closeDropdown,);
    //     return () => {
    //         document.removeEventListener("mousedown", closeDropdown);
    //     };
    // }, [activeCommentIndex]);


    return (
        <div className='h-full'>
            <div>
                <AddVideoComment videoId={videoId} setAddComment={setAddComment} setError={setError} />
            </div>
            <div>
                {error && <p className="text-red-600 m-3 p-3 text-center">{error}</p>}
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    allComments?.length !== 0 ? (
                        <>
                            <div className='h-full' >
                                {allComments?.map((comment, index) => ( 
                                    <div key={index} >
                                        <div ref={deleteCommentsRef} className='flex flex-row justify-between items-center my-4'>
                                            <GetVideoComment comment={comment} setError={setError} commentId={(activeCommentIndex === index && activeUpdate) ? comment?._id : null} setAddComment={setAddComment} videoCommentRef={videoCommentRef} textareaClicked={textareaClicked} setTextareaClicked={setTextareaClicked} setActiveCommentIndex={setActiveCommentIndex} setAllComments={setAllComments} />

                                            {authStatus && !textareaClicked &&
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger>
                                                        <Button variant="secondary" onClick={(e) => { toggleOptionDropdown(index); e.stopPropagation(); }}><MenuIcon /></Button>
                                                    </DropdownMenuTrigger>
                                                    {authStatus && activeCommentIndex === index &&
                                                        <DropdownMenuContent>
                                                            <DropdownMenuItem>
                                                                <DeleteVideoComment commentId={comment._id} setAllComments={setAllComments} setError={setError} deleteCommentRef={deleteCommentsRef} />
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem>
                                                                <Button variant="ghost" onClick={(e) => { setActiveUpdate(true); setTextareaClicked(true); e.stopPropagation() }} >Edit</Button>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>}
                                                </DropdownMenu>
                                            }
{/* 
                                            {authStatus && !textareaClicked &&
                                                <div ref={commentDropdownRef} className={`flex flex-col justify-start items-end }`} >
                                                    {authStatus &&
                                                        <div onClick={(e) => { toggleOptionDropdown(index); e.stopPropagation(); }}>
                                                            <MenuIcon />
                                                        </div>
                                                    }
                                                    <div >
                                                        {
                                                            authStatus && activeCommentIndex === index && <div ref={dropdownButtonsRef}>
                                                                <DeleteVideoComment commentId={comment._id} setAllComments={setAllComments} setError={setError} deleteCommentRef={deleteCommentsRef} setActiveCommentIndex={setActiveCommentIndex} />

                                                                <button className='bg-gray-200 px-2 rounded-xl ring-1 ring-gray-600 active:scale-95 hover:bg-gray-400' onClick={(e) => { setActiveUpdate(true); setTextareaClicked(true); e.stopPropagation() }} >Edit</button>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            } */}
                                        </div>
                                    </div>
                                ))}
                                {loading && <div>Loading more comments...</div>}
                            </div>

                        </>
                    ) : (
                        <div>No comments yet</div>
                    )
                )}
                <div ref={commentsContainerRef}> </div>
            </div>
        </div>
    );

}

export default VideoComments;
