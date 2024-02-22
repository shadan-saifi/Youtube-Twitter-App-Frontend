import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import { useState } from "react";
import { getCurrentUser, loginUser } from "../services/userService"
import { login as authlogin } from "../store/authSlice";
import Logo from "./Logo.jsx";
import InputBox from "./InputBox";
import { Link } from "react-router-dom";


function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, formState: { errors }, handleSubmit } = useForm();
    const [error, setError] = useState("")

    const login = async (data) => {
        try {
            const {emailOrUsername, password}=data;
            const isEmail= /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrUsername)
            const session = await loginUser({
                [isEmail?"email":"username"]:emailOrUsername,password
            })

            if (session) {
                const userData = await getCurrentUser();
                if (userData) {
                  dispatch(authlogin({ userData }));
                  navigate("/")
                } 
            }else if(session?.error){
                setError(session?.error)
            }
           

        } catch (error) {
            setError(error?.response?.data?.message)
        }
    }

    return (
        <div className="flex justify-center flex-col items-center p-4 border-2 shadow-xl">
            <div className="p-8">
                <span>
                    <Logo />
                </span>
            </div>
            <h2 className="text-2xl p-3 text-blue-800 ">Login in to continue</h2>
            <p className="flex justify-around flex-col pb-3">
                Don&apos;t have any account?&nbsp;
                <Link to="/create-account" className="text-blue-600">Create Account</Link>
            </p>
            {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
            <form onSubmit={handleSubmit(login)}>
                <InputBox
                    label="email or username"
                    placeholder="Enter email or username"
                    type="text"
                    {
                    ...register("emailOrUsername", {
                        required: "This field is required",
                        pattern: {
                            value: /^(?:(?!@)[\w.-]+(?:\.[\w.-]+)*)@(?!@)(?:[\w-]+\.)+\w{2,6}$|^[a-zA-Z0-9._-]{3,}$/,
                            message: "Enter a valid email or username"
                        }
                    })
                    }
                    aria-invalid={errors.emailOrUsername ? "true" : "false"}
                />
                {
                    errors.emailOrUsername && <ul>
                        {errors.emailOrUsername?.type === "required" && <li role="alert">{errors.emailOrUsername?.message}</li>}
                        {errors.emailOrUsername?.type === "pattern" && <li role="alert">{errors.emailOrUsername?.message}</li>}
                    </ul>
                }
                <InputBox
                    label="password"
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
                <button type="submit" className="text-blue-950 border rounded-md w-24 h-10 bg-blue-400 text-xl font-sans font-semibold mt-4">Log In</button>

            </form>

        </div >
    )
}

export default Login