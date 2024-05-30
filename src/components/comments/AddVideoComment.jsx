import React, { useState } from 'react';
import { addVideoComment } from '../../services/commentService';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


function AddVideoComment({ videoId, setAddComment, setError }) {

    const [textareaClicked, setTextareaClicked] = useState(false);
    const authStatus = useSelector((state) => state.auth.status)
    const user = useSelector((state) => state.auth.userData)
    const navigate = useNavigate()

    const { register, formState: { errors }, handleSubmit, setValue, reset } = useForm();

    const addingComment = async (data) => {
        setError("")
        setAddComment(false);
        try {
            const { content } = data;
            const trimmedContent = content.trim();
            if (trimmedContent !== "") {
                const response = await addVideoComment({ videoId, content: trimmedContent });
                if (response.success === true) {
                    setAddComment(true);
                    setValue("content", "");
                    setTextareaClicked(false)
                }
            } else {
                setError("Enter a non-empty comment to submit");
            }
        } catch (error) {
            setError(error.response.data.message || "Error while adding comment");
            setAddComment(false);
            setTextareaClicked(false)
        }
    }

    const handleClear = () => {
        reset((formValues) => ({
            ...formValues,
            content: "",
        }))
        setAddComment(false);
        setTextareaClicked(false)
    }

    return (
        <div className='max-w-[850px] '>
            <form onSubmit={handleSubmit(addingComment)}
                className='w-full flex flex-row justify-start items-start space-x-2 '>
                <div className='grow flex flex-row justify-start items-start space-x-2'>
                    {
                        authStatus ? (<Link to={`/${user?.data?.username}/videos`} className='min-w-12 m-2'>
                            <Avatar className="max-w-[120px] sm:size-10 md:size-12 size-8">
                                <AvatarImage src={user?.data?.avatar?.url} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </Link>) : (
                            <Link to={"/login"}>
                                <img src="/images/blankDp.png" alt="Avatar" className='object-cover sm:size-10 md:size-12 size-8 rounded-full' />
                            </Link>
                        )
                    }
                    {authStatus ? <div className='flex grow'>
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
                    </div> : <div className='flex grow'>
                        <label htmlFor="content" className="font-semibold text-lg pb-1 text-blue-500 hidden">Content:</label>
                        <Textarea
                            placeholder="Enter comment here"
                            id='content'
                            maxLength={500}
                            onClick={() => navigate("/login")}
                        />
                    </div>}
                </div>
                {authStatus && textareaClicked && (
                    <div>
                        <Button type="button" onClick={handleClear} variant="ghost">Cancel</Button>
                        <Button type="submit" variant="ghost">Comment</Button>
                    </div>
                )}
            </form>
        </div>
    );
}

export default AddVideoComment;