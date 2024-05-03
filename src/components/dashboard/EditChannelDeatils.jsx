import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { updateAccountDetails } from '../../services/userService';
import { useNavigate } from 'react-router-dom';
import InputBox from '../InputBox';

function EditChannelDetails({ username, user }) {

    const [error, setError] = useState("")
    const navigate = useNavigate()
    const { register, setValue, formState: { errors }, handleSubmit } = useForm()

    useEffect(() => {
        if (user) {
            setValue("fullname", user?.fullname);
            setValue("email", user?.email);
        }
    }, [user]);

    const submit = async (data) => {
        try {
            const response = await updateAccountDetails(data)
            if (response.success === true) {
                navigate(`/${username}/videos`)
            }
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    return (
        <div className='w-full ml-12 '>
            {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
            <form onSubmit={handleSubmit(submit)}
                className='w-full space-y-4'
            >
                <InputBox
                    label="Fullname:"
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
                <InputBox
                    label="Email:"
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
                    errors.password && <ul>
                        {errors.email?.type === "required" && <li role="alert">{errors.email?.message}</li>}
                        {errors.email?.type === "pattern" && <li role="alert">{errors.email?.message}</li>}

                    </ul>
                }
                <button type="submit" className=" border rounded-md px-2 py-1 bg-blue-400 text-xl font-sans font-semibold  text-blue-950 hover:text-white hover:bg-blue-500 active:scale-95">Submit</button>
            </form>
        </div>
    );
}

export default EditChannelDetails;