import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import InputBox from '../InputBox';
import { deleteCoverImage, updateCoverImage } from '../../services/userService';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

function EditChannelCoverImage({ username, user }) {
    const [error, setError] = useState("")
    const [coverImagePreview, setCoverImagePreview] = useState(null);

    const navigate = useNavigate()
    const { register, formState: { errors }, handleSubmit } = useForm()

    const submit = async (data) => {
        try {
            const response = await updateCoverImage(data)
            if (response.success === true) {
                navigate(`/${username}/videos`)
            }
        } catch (error) {
            setError(error.response.data.message || "Error while updating cover image")
        }
    }
    const handleCoverImageChange = (e) => {
        setCoverImagePreview(URL.createObjectURL(e.target.files[0]));
    };

    const deletingCoverImage = async () => {
        try {
            const response = await deleteCoverImage()
            if (response?.success === true) {
                navigate(`/${username}/videos`)
            }
        } catch (error) {
            setError(error.response.data.message || "Error while deleting cover image")
        }
    }

    return (
        <div className='w-full ml-12 '>
            {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
            <form onSubmit={handleSubmit(submit)}
                className='w-full flex flex-col justify-start items-start space-y-2'
            >
                <div className='space-y-2'>
                    <Label htmlFor="coverImage">Cover Image (max-size=5MB, aspect-ratio=16/9):</Label>
                   <Input
                        id="Cover Image"
                        type="file"
                        alt="Cover Image"
                        accept="image/*"
                        onInput={handleCoverImageChange}
                        {...register("coverImage", {
                            required: "This field is required",
                            validate: {
                                size: (files) => {
                                    const maxSize = 2 * 1024 * 1024;
                                    if (files[0]?.size > maxSize) return "File size exceeds the maximum allowed limit of 2MB";
                                    else return true;
                                },
                            },
                        })}
                        aria-invalid={errors.coverImage ? "true" : "false"}
                    />

                    {
                        errors.coverImage && (
                            <ul>
                                {errors.coverImage.type === "required" && <li role="alert">{errors.coverImage.message}</li>}
                                {errors.coverImage.type === "validate" && <li role="alert">{errors.coverImage.message}</li>}
                            </ul>
                        )}
                    {coverImagePreview ? (
                        <img src={coverImagePreview} className=" aspect-video max-w-72  object-cover my-2" />
                    ) : (

                        <img src={user?.coverImage?.secure_url} alt="Avatar Image" className='my-2 max-w-72 aspect-video object-cover' />
                    )}
                </div>
                <div className=' flex flex-row justify-between items-center space-x-16'>
                    <Button type="submit" variant="outline" >Change</Button>
                    <Button onClick={() => deletingCoverImage()} type="submit" variant="outline">
                        Delete
                    </Button>
                </div>
            </form>

        </div>
    );
}

export default EditChannelCoverImage;