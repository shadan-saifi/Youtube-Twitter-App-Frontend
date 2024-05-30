import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import handleUploadDate from '../../hooks/handleUploadDate';
import { updateComment } from '../../services/commentService';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


function GetAndUpdateVideoComment({ comment, commentId = null, setError, videoCommentRef, setTextareaClicked, textareaClicked, setActiveCommentIndex, setAllComments }) {

    const authStatus = useSelector((state) => state.auth.status)

    const { register, formState: { errors }, handleSubmit, reset } = useForm({
        defaultValues: {
            content: comment?.content
        }
    });

    const update = async (data) => {
        setError("")
        try {
            const { content } = data;
            const trimmedContent = content.trim();
            if (trimmedContent !== "") {
                const response = await updateComment({ commentId, content: trimmedContent });
                if (response.success === true) {

                    setAllComments(prevComments => prevComments.map(prev => {
                        if (prev._id === commentId) {
                            return { ...prev, content: trimmedContent };
                        }
                        return prev;
                    }));
                    setTextareaClicked(false)
                    setActiveCommentIndex(null)
                }
            } else {
                setError("Enter a non-empty comment to submit");

            }
        } catch (error) {
            setError(error.response.data.message || "Error while editing comment");
            setTextareaClicked(false)
        }
    }

    const handleCancel = () => {
        reset()
        setTextareaClicked(false)
        setActiveCommentIndex(null)
    }

    return (
        <div className='flex flex-row justify-start items-center'>
            <Link to={`/${comment?.ownerOfComment?.username}`} className='min-w-12 m-2'>
                <Avatar className="max-w-[120px] sm:size-10 md:size-12 size-8">
                    <AvatarImage src={comment?.ownerOfComment?.avatar?.secure_url} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </Link>
            <div className='flex flex-col justify-start items-start'>
                <div>
                    <Link to={`/${comment?.ownerOfComment?.username}`} className='font-bold'>@{comment?.ownerOfComment?.username}</Link>
                    <span className='text-sm mx-2'>{handleUploadDate(comment?.createdAt)}</span>
                </div>
                {authStatus && commentId ? (
                    <form onSubmit={handleSubmit(update)} ref={videoCommentRef} >
                        <div className='flex grow'>
                            <label htmlFor="content" className="font-semibold text-lg pb-1 text-blue-500 hidden">Content:</label>
                            <Textarea
                                placeholder="Enter comment here"
                                id='content'
                                maxLength={500}
                                onClick={() => setTextareaClicked(true)}
                                {...register("content", { required: "This field is required" })}
                                aria-invalid={errors.content ? "true" : "false"}
                            />
                            {errors.content && (
                                <ul>
                                    {errors.content.type === "required" && <li role="alert">{errors.content.message}</li>}
                                </ul>
                            )}
                        </div>
                        <div>
                            {authStatus && textareaClicked && (
                                <div>
                                    <Button type='button' onClick={handleCancel} variant="ghost" >Cancel</Button>
                                    <Button type="submit" variant="ghost" >Comment</Button>
                                </div>
                            )}
                        </div>
                    </form>
                ) : (<p className="leading-7 [&:not(:first-child)]:mt-0">
                    {comment?.content}</p>)}
            </div>
        </div>
    );
}

export default GetAndUpdateVideoComment;