import { useEffect, useState } from "react"
import { ToggleSubscription } from "../index.js"
import { getUserChannelProfile } from "../../services/userService.js"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"


function UserProfile({ username }) {
    const [userProfile, setUserProfile] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [isSubscribed, setIsSubscribed] = useState(false)

    const user = useSelector((state) => state.auth.userData);


    useEffect(() => {
        ; (async () => {
            try {
                setLoading(true)
                const response = await getUserChannelProfile({ username })
                if (response) {
                    setUserProfile(response)
                    setIsSubscribed(response.data.isSubscribed)
                }
                setLoading(false)

            } catch (error) {
                setError(error.response?.data?.message || "An error occurred");
                setLoading(false)
            }
        })()
    }, [username])
    const handleSubscriptionChange = (newSubscriptionStatus) => {
        setIsSubscribed(newSubscriptionStatus);
    };

    return !loading ? (
        <div>
            {
                userProfile && (
                    <div className="flex flex-col justify-between">
                        <Link to={`/channel/user/${user?.data?.username}/edit/images`} className="relative w-full aspect-[5/1] overflow-hidden rounded-3xl">

                            <div className="absolute inset-0 flex items-center justify-center object-cover
                                w-full aspect-[5/1] overflow-hidden rounded-3xl bg-white bg-opacity-0 
                                transition-opacity duration-300 hover:bg-opacity-50 opacity-0 hover:opacity-100">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="sm:w-8 w-6 sm:h-8 h-6 absolute text-white"
                                    viewBox="0 0 24 24"
                                    focusable="false"
                                >
                                    <path d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,8c-2.21,0-4,1.79-4,4s1.79,4,4,4s4-1.79,4-4 S14.21,8,12,8L12,8z M14.59,4l2,2H21v12H3V6h4.41l2-2H14.59 M15,3H9L7,5H2v14h20V5h-5L15,3L15,3z"></path>
                                </svg>
                            </div>
                            <img src={userProfile?.data?.coverImage?.secure_url} alt="Cover Image"
                                className="object-cover w-full h-full" />
                        </Link>
                        <div className=" m-3 flex flex-row justify-start items-center">

                            <Link to={`/channel/user/${user?.data?.username}/edit/images`} className="relative">
                                <div className="absolute inset-0 flex items-center justify-center object-cover 
                                aspect-square rounded-full md:max-w-64 sm:max-w-48 max-w-36 mt-2
                                 bg-white bg-opacity-0 transition-opacity duration-300 hover:bg-opacity-50 opacity-0 hover:opacity-100">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="sm:w-8 w-6 sm:h-8 h-6 absolute text-white"
                                        viewBox="0 0 24 24"
                                        focusable="false"
                                    >
                                        <path d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,8c-2.21,0-4,1.79-4,4s1.79,4,4,4s4-1.79,4-4 S14.21,8,12,8L12,8z M14.59,4l2,2H21v12H3V6h4.41l2-2H14.59 M15,3H9L7,5H2v14h20V5h-5L15,3L15,3z"></path>
                                    </svg>
                                </div>
                                <img
                                    src={userProfile?.data?.avatar?.secure_url}
                                    alt="Avatar image"
                                    className="object-cover aspect-square rounded-full md:max-w-64 sm:max-w-48 max-w-36 p-2 mt-2"
                                />
                            </Link>


                            <div className="flex flex-col justify-start items-start">
                                <div className="text-5xl capitalize font-bold text-red-600">{userProfile.data.fullname}</div>
                                <div className="flex flex-col justify-center items-start mt-6 text-lg">
                                    <div className="px-1 pb-0">Username: {userProfile.data.username}</div>
                                    <div className="p-1 pt-0 ">Email: {userProfile.data.email}</div>
                                </div>
                                <div className="flex flex-row justify-start items-center">
                                    <div className="p-1 pt-0 mr-8">{userProfile.data.subscribersCount} Subscribers</div>
                                    <div>{userProfile.data.channelSubscribedToCount} Subscriptions</div>
                                </div>

                                <div>
                                    <ToggleSubscription isSubscribed={isSubscribed} username={username} onSubscriptionChange={handleSubscriptionChange} />
                                </div>


                            </div>
                        </div>
                    </div>)
            }
            {
                error && <p className="text-red-600 m-3 p-3 text-center">{error}</p>

            }
        </div>
    ) : (<div>...Loading</div>)
}
export default UserProfile