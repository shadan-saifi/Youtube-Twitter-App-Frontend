import { useState } from "react"
import { createAccount } from "../services/userService"
import { Link, useNavigate } from "react-router-dom"
import Logo from "./Logo"
import InputBox from "./InputBox";
import { useForm } from "react-hook-form";


function CreateAccount() {
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const { register, formState: { errors }, handleSubmit } = useForm();

    const create = async (data) => {
        try {
            const response = await createAccount(data)
            if (response) navigate("/login")

        } catch (error) {
            setError(error.response.data.message)
        }
    }

    return (
        <div className="flex justify-center flex-col items-center p-4 w-5/6 border-2 shadow-xl">
            <div className="p-4">
                <span>
                    <Logo />
                </span>
            </div>
            <h2 className="text-2xl p-3 text-blue-800">Create a new Account</h2>
            <div className="flex justify-around flex-col pb-3">
                Already have account?
                <Link to="/login" className="text-blue-600">Click here to log in</Link>
            </div>
            {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
            <form onSubmit={handleSubmit(create)}>
                <InputBox
                    label="Fullname:"
                    placeholder="Enter your full name here"
                    type="text"
                    required
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
                <InputBox
                    label="Username:"
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
                    errors.password && <ul>
                        {errors.username?.type === "required" && <li role="alert">{errors.username?.message}</li>}
                        {errors.username?.type === "pattern" && <li role="alert">{errors.username?.message}</li>}
                        {errors.username?.type === "minLength" && <li role="alert">{errors.username?.message}</li>}
                        {errors.username?.type === "maxLength" && <li role="alert">{errors.username?.message}</li>}
                    </ul>
                }
                <InputBox
                    label="Email:"
                    placeholder="Enter email"
                    type="email"
                    required
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
                    errors.password && <ul>
                        {errors.email?.type === "required" && <li role="alert">{errors.email?.message}</li>}
                        {errors.email?.type === "pattern" && <li role="alert">{errors.email?.message}</li>}

                    </ul>
                }
                <InputBox
                    label="Password:"
                    placeholder="Enter password here"
                    type="password"
                    required
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
                <InputBox
                    label="Avatar(max-size:5MB):"
                    type="file"
                    alt="avatar"
                    accept="image/*"
                    required
                    {
                    ...register("avatar", {
                        required: "This field is required",
                        validate: {
                            size: (file) => {
                                const maxSize = 5 * 1024 * 1024
                                if (file[0]?.size > maxSize) return "File size exceeds the maximum allowed limit of 5MB";

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
                <InputBox
                    label="Cover Image(max-size:10MB):"
                    type="file"
                    alt="Cover Image"
                    accept="image/*"
                    {
                    ...register("coverImage", {
                        validate: {
                            size: (file) => {
                                const maxSize = 10 * 1024 * 1024
                                if (file[0]?.size > maxSize) return "File size exceeds the maximum allowed limit of 10MB";

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
                <button type="submit" className=" border rounded-md w-24 h-10 bg-blue-400 text-xl font-sans font-semibold mt-4 text-blue-950">Log In</button>
            </form>
        </div>)
}
export default CreateAccount