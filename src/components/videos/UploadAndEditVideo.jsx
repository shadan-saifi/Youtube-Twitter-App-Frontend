import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { publishVideo, updateVideo } from '../../services/videoService';
import InputBox from '../InputBox';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from '../ui/button';

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
    }, [video, setValue])

    const submit = async (data) => {
        try {
            if (video) {
                const response = await updateVideo({ ...data, videoId: video?._id });
                if (response?.success === true) {
                    navigate(`/channel/videos`);
                } else {
                    setError("Failed to update video.");
                }
            } else {
                const response = await publishVideo(data);
                if (response.success === true) {
                    navigate(`/channel/videos`);
                } else {
                    setError("Failed to upload video.");
                }
            }
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "An error occurred while uploading/updating video");
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
            <Card>
                <CardHeader>
                    <CardTitle>Upload Video</CardTitle>
                    <CardDescription>Video size must be less than 50MB and thumbnail size must be less than 2 MB</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(submit)} className='flex flex-col justify-start items-center' >
                        <div className='flex sm:flex-row flex-col sm:justify-center justify-start items-start sm:space-x-12 space-y-4 w-full'>
                            <div className='flex flex-col justify-start items-start space-y-4'>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    placeholder="Enter video title here"
                                    type="text"
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
                                    <Label htmlFor="textarea" >Description:</Label>
                                    <Textarea
                                        placeholder="Enter video description here"

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
                                    <Label htmlFor="isPublished" className='py-2' >Publication status:</Label>
                                    <select
                                        id="isPublished"
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                                        {...register("isPublished", { required: "This field is required" })}
                                        aria-invalid={errors.isPublished ? "true" : "false"}
                                    >
                                        <option value="">--Please choose an option--</option>
                                        <option value="true">Public</option>
                                        <option value="false">Private</option>
                                    </select>

                                    {errors.isPublished && (
                                        <ul>
                                            {errors.isPublished.type === "required" && <li role="alert">{errors.isPublished.message}</li>}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            {!video ? (
                                <div className='flex flex-col justify-start items-start space-y-4 lg:max-w-96 md:max-w-80 sm:max-w-64'>
                                    <Label htmlFor="Video" >Video(max-size:50MB):</Label>
                                    <Input
                                        id="Video"
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

                                    <Label htmlFor="Thumbnail" >Thumbnail (max-size:2MB)::</Label>
                                    <Input
                                        id="Thumbnail (max-size:2MB):"
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
                                    {errors.thumbnail && (
                                        <ul>
                                            {errors.thumbnail.type === "required" && <li role="alert">{errors.thumbnail.message}</li>}
                                            {errors.thumbnail.type === "validate" && <li role="alert">{errors.thumbnail.message}</li>}
                                        </ul>
                                    )}
                                    {thumbnailPreview &&
                                        <div>
                                            <img src={thumbnailPreview} className="aspect-video object-cover" />
                                        </div>
                                    }
                                    {video &&
                                        <img src={video?.thumbnail?.secure_url} alt="Thumbnail Image" className='my-2 aspect-video object-cover' />

                                    }

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
                                            <img src={thumbnailPreview} className="aspect-video object-cover my-2" />
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
                    </form>
                </CardContent>
                <CardFooter>
                    <Button type="submit"  onClick={handleSubmit(submit)} className="text-center w-full" >{video ? "Update" : "Upload"}</Button>
                </CardFooter>
            </Card>

            {error && <p className="text-red-600 m-3 p-3 text-center">{error}</p>}

        </div>
    );
}

export default UploadAndEditVideo;
