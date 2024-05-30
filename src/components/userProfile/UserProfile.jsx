import { useEffect, useState } from "react"
import { ToggleSubscription } from "../index.js"
import { getUserChannelProfile } from "../../services/userService.js"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import CameraIcon from "../icons/cameraIconForAvatarChange.jsx"
import { Skeleton } from "../ui/skeleton.jsx"


function UserProfile({ username }) {
    const [userProfile, setUserProfile] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [isSubscribed, setIsSubscribed] = useState(null)
    const user = useSelector((state) => state.auth.userData);


    useEffect(() => {
        ; (async () => {
            try {
                setLoading(true)
                const response = await getUserChannelProfile({ username })
                console.log("response", response);
                if (response) {
                    setUserProfile(response)
                    setIsSubscribed(response?.data?.isSubscribed)
                    console.log("response?.data?.isSubscribed", response?.data?.isSubscribed);
                }
                setLoading(false)

            } catch (error) {
                setError(error.response?.data?.message || "An error occurred white getting user channel profile");
                setLoading(false)
            }
        })()
    }, [username])

    return !loading ? (
        <div>
            {
                userProfile && (
                    <div className="flex flex-col justify-between mt-3">
                        <Link to={`/channel/user/${user?.data?.username}/edit/images`} className="relative w-full aspect-[5/1] overflow-hidden rounded-3xl ">

                            <div className="absolute inset-0 flex items-center justify-center object-cover
                                w-full aspect-[5/1] overflow-hidden rounded-3xl bg-white bg-opacity-0 
                                transition-opacity duration-300 hover:bg-opacity-50 opacity-0 hover:opacity-100 dark:hover:bg-opacity-20">
                                <CameraIcon />
                            </div>
                            <img src={userProfile?.data?.coverImage?.secure_url} alt="Cover Image"
                                className="object-cover w-full h-full" />
                        </Link>
                        <div className=" m-3 flex flex-row justify-start items-center">

                            <Link to={`/channel/user/${user?.data?.username}/edit/images`} className="relative">
                                <div className="absolute inset-0 flex items-center justify-center object-cover 
                                aspect-square rounded-full md:max-w-64 sm:max-w-48 max-w-36 mt-2
                                 bg-white bg-opacity-0 transition-opacity duration-300 hover:bg-opacity-50 opacity-0 hover:opacity-100 dark:hover:bg-opacity-20">
                                    <CameraIcon />
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
                                    <ToggleSubscription isSubscribed={isSubscribed} setIsSubscribed={setIsSubscribed} username={username} />
                                </div>


                            </div>
                        </div>
                    </div>)
            }
            {
                error && <p className="text-red-600 m-3 p-3 text-center">{error}</p>

            }
        </div>
    ) : <div className=" flex flex-col justify-center items-center w-full h-svh space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
        </div>
    </div>
}
export default UserProfile