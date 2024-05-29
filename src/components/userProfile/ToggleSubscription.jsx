import { forwardRef, useState } from "react";
import { toggleSubscription } from "../../services/subscriptionService";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import React from "react";


function ToggleSubscription({ isSubscribed, username, setIsSubscribed }) {
    const authStatus = useSelector((state) => state.auth.status);
    const user = useSelector((state) => state.auth.userData);
    const [error, setError] = useState("");

    const handleSubscription = async () => {
        try {
            const response = await toggleSubscription({ username });
            console.log("response",response);
            if (response?.success===true && response?.message==="Subscribed to channel successfully"){
                setIsSubscribed(true);
            }else{
                setIsSubscribed(false)
            }
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred while subscribing");
        }
    }
   
    return (
        <div>
            {authStatus && user?.data?.username !== username && (
                <Button className={`${isSubscribed ? " bg-blue-500 hover:bg-blue-400" : " bg-red-500 hover:bg-red-400"}`}
                    onClick={handleSubscription}
                >
                    {isSubscribed ? "Subscribed" : "Subscribe"}
                </Button>
            )}
            {!authStatus && (
                <Button variant="destructive" onClick={() => alert("Please login to subscribe.")}>
                    Subscribe
                </Button>
            )}
            {authStatus && user.data.username === username && (
                <div className="flex  gap-4 font-semibold flex-row justify-start items-center mt-6">
                    <Link to={`/channel/user/${user?.data?.username}/edit/details`}>
                        <Button variant="ghost" > Edit</Button>
                    </Link>
                    <Link to="/channel/videos">
                        <Button  variant="ghost">Manage Videos</Button>
                    </Link>
                </div>
            )}
            {error && <p className="text-red-600 m-3 p-3 text-center">{error}</p>}
        </div>
    );
}

export default ToggleSubscription
