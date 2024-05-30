import { useState } from "react"
import { createAccount } from "../services/userService"
import { Link, useNavigate } from "react-router-dom"
import Logo from "./Logo"
import { useForm } from "react-hook-form";
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button';

function CreateAccount() {
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState(null);


    const { register, formState: { errors }, handleSubmit } = useForm();

    const create = async (data) => {
        try {
            const response = await createAccount(data)
            if (response) navigate("/login")

        } catch (error) {
            setError(error.response.data.message)
        }
    }
    const handleAvatarChange = (e) => {
        setAvatarPreview(URL.createObjectURL(e.target.files[0]));
    };
    const handleCoverImageChange = (e) => {
        setCoverImagePreview(URL.createObjectURL(e.target.files[0]));
    };

    return (
        <Card className="flex justify-center flex-col items-center space-y-12">
            <CardHeader>
                <CardTitle>
                    <div className="p-4 flex justify-center flex-col items-center">
                        <span>
                            <Logo />
                        </span>
                    </div>
                </CardTitle>
                <CardDescription>
                    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                        Create a new Account</h2>
                    <p className="leading-7 [&:not(:first-child)]:mt-6">
                        Already have account?
                        <Link to="/login" className="text-blue-600 px-1">Click here to log in</Link>
                    </p>
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

                <form onSubmit={handleSubmit(create)} className="flex sm:flex-row flex-col justify-start  sm:items-center items-start sm:space-x-12 space-y-4">
                    <div className="flex flex-col justify-center items-start space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="Fullname">Fullname:</Label>
                            <Input
                                id="Fullname"
                                placeholder="Enter your full name here"
                                type="text"
                                {
                                ...register("fullname", {
                                    required: "This field is required",
                                    pattern: {
                                        value: /^[a-zA-Z]+(?: [a-zA-Z]+)*$/,
                                        message: "Only alphabets are allowed"
                                    }
                                })
                                }
                                aria-invalid={errors.fullname ? "true" : "false"}
                            />
                            {
                                errors.fullname && <ul>
                                    {errors.fullname?.type === "required" && <li role="alert">{errors.fullname?.message}</li>}
                                    {errors.fullname?.type === "pattern" && <li role="alert">{errors.fullname?.message}</li>}
                                </ul>
                            }
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="Username">Username:</Label>
                            <Input
                                id="Username"
                                placeholder="Enter username"
                                type="text"
                                {
                                ...register("username", {
                                    required: "This field is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9_-]{4,16}$/,
                                        message: "Username must be between 3 and 16 characters long and can only contain letters, numbers, underscores, and hyphens.",
                                    },
                                    minLength: {
                                        value: 4,
                                        message: 'Username should be at least 4 characters long'
                                    },
                                    maxLength: {
                                        value: 16,
                                        message: 'Username should not exceed 16 characters'
                                    }
                                })}
                                aria-invalid={errors.username ? "true" : "false"}
                            />
                            {
                                errors.username && <ul>
                                    {errors.username?.type === "required" && <li role="alert">{errors.username?.message}</li>}
                                    {errors.username?.type === "pattern" && <li role="alert">{errors.username?.message}</li>}
                                    {errors.username?.type === "minLength" && <li role="alert">{errors.username?.message}</li>}
                                    {errors.username?.type === "maxLength" && <li role="alert">{errors.username?.message}</li>}
                                </ul>
                            }
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="Email">Email:</Label>
                            <Input
                                id="Email"
                                placeholder="Enter email"
                                type="email"
                                {
                                ...register("email", {
                                    required: "This field is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "Please enter a valid email address.",
                                    },

                                })}
                                aria-invalid={errors.email ? "true" : "false"}
                            />
                            {
                                errors.email && <ul>
                                    {errors.email?.type === "required" && <li role="alert">{errors.email?.message}</li>}
                                    {errors.email?.type === "pattern" && <li role="alert">{errors.email?.message}</li>}

                                </ul>
                            }
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="Password">Password:</Label>
                            <Input
                                id="Password"
                                placeholder="Enter password here"
                                type="password"
                                {...register("password", {
                                    required: "This field is required",
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                                        message: 'Password should contain at least one uppercase letter, one lowercase letter, and one number'
                                    },
                                    minLength: {
                                        value: 8,
                                        message: 'Password should be at least 8 characters long'
                                    },
                                    maxLength: {
                                        value: 20,
                                        message: 'Password should not exceed 20 characters'
                                    }
                                })}
                                aria-invalid={errors.password ? "true" : "false"}
                            />
                            {
                                errors.password && <ul>
                                    {errors.password?.type === "required" && <li role="alert">{errors.password?.message}</li>}
                                    {errors.password?.type === "pattern" && <li role="alert">{errors.password?.message}</li>}
                                    {errors.password?.type === "minLength" && <li role="alert">{errors.password?.message}</li>}
                                    {errors.password?.type === "maxLength" && <li role="alert">{errors.password?.message}</li>}
                                </ul>
                            }
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-start space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="Avatar">Avatar(max-size:2MB):</Label>
                            <Input
                                id="Avatar"
                                type="file"
                                alt="avatar"
                                accept="image/*"
                                onInput={handleAvatarChange}

                                {
                                ...register("avatar", {
                                    required: "This field is required",
                                    validate: {
                                        size: (file) => {
                                            const maxSize = 2 * 1024 * 1024
                                            if (file[0]?.size > maxSize) return "File size exceeds the maximum allowed limit of 2MB";

                                            else return true
                                        },
                                    }

                                })
                                }
                                aria-invalid={errors.avatar ? "true" : "false"}
                            />
                            {
                                errors.avatar && <ul>
                                    {errors.avatar?.type === "required" && <li role="alert">{errors.avatar?.message}</li>}
                                    {errors.avatar.type !== "required" && (<li role="alert">{errors.avatar.message}</li>)}
                                </ul>
                            }
                            {
                                avatarPreview &&
                                <img src={avatarPreview} className=" aspect-square max-w-72  object-cover my-2" />
                            }
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="CoverImage">Cover Image(max-size:5MB,aspect-ratio=16/9):</Label>
                            <Input
                                id="CoverImage"
                                type="file"
                                alt="Cover Image"
                                accept="image/*"
                                onInput={handleCoverImageChange}
                                {
                                ...register("coverImage", {
                                    validate: {
                                        size: (file) => {
                                            const maxSize = 5 * 1024 * 1024
                                            if (file[0]?.size > maxSize) return "File size exceeds the maximum allowed limit of 5MB";

                                            else return true
                                        },
                                    }

                                })
                                }
                                aria-invalid={errors.coverImage ? "true" : "false"}
                            />
                            {
                                errors.coverImage && <ul>
                                    {errors.coverImage?.type === "validate" && <li role="alert">{errors.coverImage?.message}</li>}
                                </ul>
                            }
                            {
                                coverImagePreview &&
                                <img src={coverImagePreview} className=" aspect-video max-w-72 object-cover my-2" />

                            }
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <Button type="submit" onClick={handleSubmit(create)}>Create Account</Button>
            </CardFooter>
        </Card>
    )
}
export default CreateAccount