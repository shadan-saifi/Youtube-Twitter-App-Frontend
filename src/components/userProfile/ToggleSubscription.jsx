import { forwardRef, useState } from "react";
import { toggleSubscription } from "../../services/subscriptionService";
import Button from "../Button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import React from "react";


function ToggleSubscription({ isSubscribed, username, onSubscriptionChange }) {

    const authStatus = useSelector((state) => state.auth.status);
    const user = useSelector((state) => state.auth.userData);
    const [error, setError] = useState("");

    const handleSubscription = async () => {
        try {
            const response = await toggleSubscription({ username });
            if (response) onSubscriptionChange(!isSubscribed);

        } catch (error) {
            console.log(error.response?.data?.message || "An error occurred");
            setError(error.response?.data?.message || "An error occurred");
        }
    }

    return (
        <div>
            {authStatus && user?.data?.username !== username && (
                <button className={`active:scale-95 active:border w-32 py-2 mt-6 rounded-2xl text-white font-semibold ${isSubscribed ? " bg-blue-500 hover:bg-blue-400" : " bg-red-500 hover:bg-red-400"}`}
                    onClick={handleSubscription}
                >
                    {isSubscribed ? "Subscribed" : "Subscribe"}
                </button>
            )}
            {!authStatus && (
                <Button className="bg-red-500 hover:bg-red-400 active:scale-95 active:border w-full mt-6 max-w-64 text-white font-semibold " onClick={() => alert("Please login to subscribe.")}>
                    Subscribe
                </Button>
            )}
            {authStatus && user.data.username === username && (
                <div className="flex  gap-4 font-semibold flex-row justify-start items-center mt-6">
                    <Link to="/edit-profile" >
                        <Button  className=" text-white bg-blue-500 hover:bg-blue-600 hover:border active:scale-95 rounded-lg w-full max-w-64">Edit</Button>
                    </Link>
                    <Link to="/manage-videos">
                        <Button  className="text-white bg-blue-500 hover:bg-blue-600 hover:border active:scale-95 rounded-lg w-full max-w-64 h-[40px]">Manage Videos</Button>
                    </Link>
                </div>
            )}
            {error && <p className="text-red-600 m-3 p-3 text-center">{error}</p>}
        </div>
    );
}

export default ToggleSubscription
