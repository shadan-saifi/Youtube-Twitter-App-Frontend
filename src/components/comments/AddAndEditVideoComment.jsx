import React, { useState } from 'react';
import { addVideoComment } from '../../services/commentService';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function AddAndEditVideoComment({ videoId, setUpdateComment }) {
    const [error, setError] = useState("")
    const authStatus = useSelector((state) => state.auth.status)
    const user = useSelector((state) => state.auth.userData)
    const navigate = useNavigate()

    const { register, formState: { errors }, handleSubmit, setValue } = useForm();

 const addComment = async (data) => {
    setError("")
    setUpdateComment(false);
    try {
        const { content } = data;
        const trimmedContent = content.trim();
        if (trimmedContent !== "") {
            const response = await addVideoComment({ videoId, content: trimmedContent });
            if (response.success === true) {
                setUpdateComment(true);
                setValue("content", "");
                // window.location.reload();
            }
        } else {
            setError("Enter a non-empty comment to submit");
        }
    } catch (error) {
        setError(error.response.data.message);
        setUpdateComment(false);
    }
}


    const handleClear = () => {
        setValue("content", "");
        setUpdateComment(false);
    }

    // useEffect(() => {
    //     if (video) {
    //         setValue("title", video.title);
    //         setValue("description", video.description);
    //         setValue("isPublished", video.isPublished);
    //     }
    // }, [video, setValue])
    return (
        <div className='max-w-[850px] '>
            {error && <p className="text-red-600 m-3 p-3 w-full h-full text-center">{error}</p>}
            <form onSubmit={handleSubmit(addComment)}
                className='w-full flex flex-row justify-start items-start space-x-2 '>
                <div className='grow flex flex-row justify-start items-start space-x-2'>
                    {
                        authStatus ? (<Link to={`/${user?.data?.username}/videos`} className='min-w-12 m-2'>
                            <img src={user?.data?.avatar?.url} alt="Avatar" className='object-cover sm:size-10 md:size-12 size-8 rounded-full' />
                        </Link>) : (
                            <Link to={"/login"}>
                                <img src="/images/blankDp.png" alt="Avatar" className='object-cover sm:size-10 md:size-12 size-8 rounded-full' />
                            </Link>
                        )
                    }
                    {authStatus ? <div className='flex grow'>
                        <label htmlFor="content" className="font-semibold text-lg pb-1 text-blue-500 hidden">Content:</label>
                        <textarea
                            placeholder="Enter comment here"
                            className='min-h-8 mt-2 w-full pl-2 py-1 hover:border-b-2 border-blue-500 rounded-lg'
                            id='content'
                            maxLength={500}
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
                        <textarea
                            placeholder="Enter comment here"
                            className='  min-h-8 max-w-full flex grow pl-2 py-1 hover:border-b-2 border-blue-500 rounded-lg'
                            id='content'
                            maxLength={500}
                            onClick={() => navigate("/login")}
                        />
                    </div>}
                </div>
                {authStatus && (
                    <div>
                        <button onClick={handleClear} className="border rounded-md max-w-24 max-h-8 bg-red-400 font-semibold px-1 my-auto text-white hover:bg-white hover:text-blue-400 active:scale-95">Cancel</button>
                        <button type="submit" className="border rounded-md max-w-24 max-h-8 bg-red-400 font-semibold px-1 my-auto text-white hover:bg-white hover:text-blue-400 active:scale-95">Comment</button>
                    </div>
                )}
            </form>
        </div>
    );
}

export default AddAndEditVideoComment;