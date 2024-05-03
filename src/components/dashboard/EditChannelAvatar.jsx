import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { updateAvatar } from '../../services/userService';
import { useNavigate } from 'react-router-dom';
import InputBox from '../InputBox';

function EditChannelAvatar({ username, user }) {
    const [error, setError] = useState("")
    const [avatarPreview, setAvatarPreview] = useState(null);

    const navigate = useNavigate()
    const { register, formState: { errors }, handleSubmit } = useForm()

    const submit = async (data) => {
        try {
            const response = await updateAvatar(data)
            if (response.success === true ) {
                navigate(`/${username}/videos`)
            }
        } catch (error) {
            setError(error.response.data.message)
        }
    }
    const handleAvatarChange = (e) => {
        setAvatarPreview(URL.createObjectURL(e.target.files[0]));
    };

    return (
        <div className='w-full ml-12 '>
            {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
            <form onSubmit={handleSubmit(submit)}
                className='w-full flex flex-col justify-start items-start'
            >
                <div>
                    <InputBox
                        label="Avatar(max-size=2MB,aspect-ratio=1:1):"
                        type="file"
                        alt="Thumbnail"
                        accept="image/*"
                        onInput={handleAvatarChange}
                        {...register("avatar", {
                            required: "This field is required",
                            validate: {
                                size: (files) => {
                                    const maxSize = 2 * 1024 * 1024;
                                    if (files[0]?.size > maxSize) return "File size exceeds the maximum allowed limit of 2MB";
                                    else return true;
                                },
                            },
                        })}
                        aria-invalid={errors.avatar ? "true" : "false"}
                    />
                   
                    {errors.avatar && (
                        <ul>
                            {errors.avatar.type === "required" && <li role="alert">{errors.avatar.message}</li>}
                            {errors.avatar.type === "validate" && <li role="alert">{errors.avatar.message}</li>}
                        </ul>
                    )}
                     {avatarPreview ? (
                        <img src={avatarPreview} className=" aspect-square max-w-72  object-cover my-2" />
                    ) : (

                        <img src={user?.avatar?.secure_url} alt="Avatar Image" className='my-2 max-w-72 aspect-square object-cover' />
                    )}
                </div>
                <button type="submit" className=" rounded-md px-2 py-1 my-8 
                 text-xl text-blue-800 font-sans font-semibold hover:bg-gray-300 active:scale-95">Change</button>
            </form>
        </div>
    );
}

export default EditChannelAvatar;