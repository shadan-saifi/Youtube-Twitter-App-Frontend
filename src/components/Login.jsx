import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import { useState } from "react";
import { getCurrentUser, loginUser } from "../services/userService"
import { login as authlogin } from "../store/authSlice";
import Logo from "./Logo.jsx";
import { Link } from "react-router-dom";
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

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, formState: { errors }, handleSubmit } = useForm();
    const [error, setError] = useState("")

    const login = async (data) => {
        try {
            setError("")
            const { emailOrUsername, password } = data;
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrUsername)
            const session = await loginUser({
                [isEmail ? "email" : "username"]: emailOrUsername, password
            })
            console.log("login Details:", session);
            if (session?.data) {
                const userData = await getCurrentUser();
                console.log("userData", userData);
                if (userData.data) {
                    dispatch(authlogin({ userData }));
                    navigate("/")
                }
            } else if (session?.error) {
                setError(session?.error)
            }
        } catch (error) {
            setError(error?.response?.data?.message)
        }
    }

    return (
        <Card className="shadow-lg">
            <CardHeader className="flex justify-center flex-col items-center">
                <CardTitle>
                    <div className="p-8">
                        <span>
                            <Logo />
                        </span>
                    </div>
                </CardTitle>
                <CardDescription>
                    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                        Login in to continue
                    </h2>
                    <p className="leading-7 [&:not(:first-child)]:mt-6">
                        Don&apos;t have any account?&nbsp;
                        <Link to="/create-account" className="text-blue-600">Create Account</Link>
                    </p>
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                <form onSubmit={handleSubmit(login)}>
                    <Label htmlFor="email or username">Email or Username</Label>
                    <Input
                        id="email or username"
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
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
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


                </form>
            </CardContent>
            <CardFooter>
                <Button type="submit" onClick={handleSubmit(login)} className="" >Log In</Button>
            </CardFooter>
        </Card>



    )
}

export default Login