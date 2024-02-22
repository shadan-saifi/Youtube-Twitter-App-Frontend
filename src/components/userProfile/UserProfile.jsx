import { useEffect, useState } from "react"
import { ToggleSubscription } from "../index.js"
import { getUserChannelProfile } from "../../services/userService.js"


function UserProfile({ username }) {
    const [userProfile, setUserProfile] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [isSubscribed, setIsSubscribed] = useState(false)

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
                        <div className="w-full aspect-[5/1] overflow-hidden rounded-3xl"
                        >
                            <img src={userProfile.data.coverImage.url} alt="Cover Image"
                                className="object-cover w-full h-full" />
                        </div>
                        <div className=" m-3 flex flex-row justify-start">

                            <img src={userProfile.data.avatar.url} alt="Avatar image"
                                className="object-cover aspect-square md:max-w-64 sm:max-w-48 max-w-36 rounded-full p-2 mt-2" />

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