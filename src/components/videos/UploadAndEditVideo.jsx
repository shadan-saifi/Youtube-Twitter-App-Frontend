import React, { useEffect, useState } from 'react';
import { publishVideo, updateVideo } from '../../services/videoService';
import { useNavigate } from 'react-router-dom';
import InputBox from '../InputBox';
import { useForm } from 'react-hook-form';

function UploadAndEditVideo({ video = null }) {
    const [error, setError] = useState("");
    const [videoPreview, setVideoPreview] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const navigate = useNavigate();
    const { register, formState: { errors }, handleSubmit, setValue } = useForm({
        defaultValues: {
            isPublished: true,
        }
    });

    useEffect(() => {
        if (video) {
            setValue("title", video.title);
            setValue("description", video.description);
            setValue("isPublished", video.isPublished);
        }
    }, [video, setValue]);

    const submit = async (data) => {
        try {
            if (video) {
                const response = await updateVideo({ ...data, videoId: video?._id });
                console.log("response of update ", response);
                if (response.success === true) {
                    navigate(`/channel`);
                } else {
                    setError("Failed to update video.");
                }
            } else {
                const response = await publishVideo(data);
                console.log("response of publish ", response);
                if (response.success === true) {
                    navigate(`/channel`);
                } else {
                    setError("Failed to upload video.");
                }
            }
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "An error occurred while uploading video");
        }
    };

    const handleVideoChange = (e) => {
        setVideoPreview(URL.createObjectURL(e.target.files[0]));
    };

    const handleThumbnailChange = (e) => {
        setThumbnailPreview(URL.createObjectURL(e.target.files[0]));
    };

    return (
        <div>
            {error && <p className="text-red-600 m-3 p-3 text-center">{error}</p>}
            <form onSubmit={handleSubmit(submit)} className='flex flex-col justify-start items-center' >
                <div className='flex sm:flex-row flex-col sm:justify-center justify-start items-start sm:space-x-12 space-y-4 w-full'>
                    <div className='flex flex-col justify-start items-start space-y-4'>
                        <InputBox
                            label="Title:"
                            placeholder="Enter video title here"
                            type="text"
                            className="sm:w-full lg:w-96 w-80"
                            {...register("title", {
                                required: "This field is required",
                                minLength: {
                                    value: 8,
                                    message: 'Title should be at least 8 characters long'
                                }
                            })}
                            aria-invalid={errors.title ? "true" : "false"}
                        />
                        {errors.title && (
                            <ul>
                                {errors.title.type === "required" && <li role="alert">{errors.title.message}</li>}
                                {errors.title.type === "minLength" && <li role="alert">{errors.title.message}</li>}
                            </ul>
                        )}
                        <div>
                            <label htmlFor="textarea" className="font-semibold text-lg pb-1 text-blue-500">Description:</label>
                            <textarea
                                placeholder="Enter video description here"
                                className='sm:w-full lg:w-92 w-80 pl-2 py-1 border border-blue-500 rounded-lg'
                                id='textarea'
                                maxLength={500}
                                {...register("description", { required: "This field is required" })}
                                aria-invalid={errors.description ? "true" : "false"}
                            />
                            {errors.description && (
                                <ul>
                                    {errors.description.type === "required" && <li role="alert">{errors.description.message}</li>}
                                </ul>
                            )}
                        </div>
                        <div className='flex flex-col justify-start items-start'>
                            <label htmlFor="isPublish" className="font-semibold text-lg pb-1 text-blue-500">Publication status:</label>
                            <select
                                id="isPublish"
                                className="border pl-2 py-1 sm:w-full lg:w-92 w-80 border-blue-500 rounded-lg focus:outline-none"
                                {...register("isPublished", { required: "This field is required" })}
                                aria-invalid={errors.isPublished ? "true" : "false"}
                            >
                                <option value={true}>Public</option>
                                <option value={false}>Private</option>
                            </select>
                            {errors.isPublished && (
                                <ul>
                                    {errors.isPublished.type === "required" && <li role="alert">{errors.isPublished.message}</li>}
                                </ul>
                            )}
                        </div>
                    </div>
                    {!video ? (
                        <div className='flex flex-col justify-start items-center space-y-4 lg:max-w-96 md:max-w-80 sm:max-w-64'>
                            <InputBox
                                label="Video(max-size:50MB):"
                                type="file"
                                alt="Video"
                                accept="video/*"
                                onInput={handleVideoChange}
                                {...register("videoFile", {
                                    required: "This field is required",
                                    validate: {
                                        size: (file) => {
                                            const maxSize = 50 * 1024 * 1024;
                                            if (file[0]?.size > maxSize) return "File size exceeds the maximum allowed limit of 50MB";
                                            else return true;
                                        },
                                    },
                                })}
                                aria-invalid={errors.videoFile ? "true" : "false"}
                            />
                            {videoPreview && <video src={videoPreview} controls className='w-full' />}
                            {errors.videoFile && (
                                <ul>
                                    {errors.videoFile.type === "required" && <li role="alert">{errors.videoFile.message}</li>}
                                    {errors.videoFile.type !== "required" && (<li role="alert">{errors.videoFile.message}</li>)}
                                </ul>
                            )}
                            <InputBox
                                label="Thumbnail (max-size:2MB):"
                                type="file"
                                alt="Thumbnail"
                                accept="image/*"
                                onInput={handleThumbnailChange}
                                {...register("thumbnail", {
                                    required: "This field is required",
                                    validate: {
                                        size: (files) => {
                                            const maxSize = 2 * 1024 * 1024;
                                            if (files[0]?.size > maxSize) return "File size exceeds the maximum allowed limit of 2MB";
                                            else return true;
                                        },
                                    },
                                })}
                                aria-invalid={errors.thumbnail ? "true" : "false"}
                            />
                            {thumbnailPreview && <img src={thumbnailPreview} className='max-w-[280px] rounded-2xl' />}
                            {errors.thumbnail && (
                                <ul>
                                    {errors.thumbnail.type === "required" && <li role="alert">{errors.thumbnail.message}</li>}
                                    {errors.thumbnail.type === "validate" && <li role="alert">{errors.thumbnail.message}</li>}
                                </ul>
                            )}
                        </div>
                    ) : (
                        <div className='lg:max-w-96 md:max-w-80 sm:max-w-64'>
                            <div>
                                <div className=" font-semibold text-lg pb-1 text-blue-500">Video:</div>
                                <video src={video?.videoFile?.secure_url} controls />
                                <div>
                                    <div>Video link:</div>
                                    <a href={`/watch?v=${encodeURIComponent(video?._id)}`}
                                        className='text-blue-500'
                                    >{`${import.meta.env.VITE_API_URL}/watch?v=${encodeURIComponent(video?._id)}`}</a>
                                </div>
                            </div>
                            <div>
                                <InputBox
                                    label="Thumbnail (max-size=2MB,aspect-ratio=16:9):"
                                    type="file"
                                    alt="Thumbnail"
                                    accept="image/*"
                                    onInput={handleThumbnailChange}
                                    {...register("thumbnail", {
                                        required: "This field is required",
                                        validate: {
                                            size: (files) => {
                                                const maxSize = 2 * 1024 * 1024;
                                                if (files[0]?.size > maxSize) return "File size exceeds the maximum allowed limit of 2MB";
                                                else return true;
                                            },
                                        },
                                    })}
                                    aria-invalid={errors.thumbnail ? "true" : "false"}
                                />
                                {thumbnailPreview ? (
                                    <div>
                                        <img src={thumbnailPreview} className="aspect-video object-cover" />
                                    </div>
                                ) : (

                                    <img src={video?.thumbnail?.secure_url} alt="Thumbnail Image" className='my-2 aspect-video object-cover' />
                                )}
                                {errors.thumbnail && (
                                    <ul>
                                        {errors.thumbnail.type === "required" && <li role="alert">{errors.thumbnail.message}</li>}
                                        {errors.thumbnail.type === "validate" && <li role="alert">{errors.thumbnail.message}</li>}
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <button type="submit" className="border rounded-md w-24 h-10 bg-blue-400 text-xl font-semibold mt-4 text-white hover:bg-white hover:text-blue-400 active:scale-95">{video ? "Update" : "Upload"}</button>
            </form>
        </div>
    );
}

export default UploadAndEditVideo;
