import React, { useEffect, useState } from 'react';
import { getChannelStats } from '../../services/dashboardService';
import { Skeleton } from "@/components/ui/skeleton"


function GetDashboardStats(props) {
    const [stats, setStats] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    console.log("stats:", stats);
    useEffect(() => {
        ; (async () => {
            try {
                setLoading(true)
                const response = await getChannelStats()
                if (response?.message === "success") {
                    console.log(response);
                    setStats(response)
                }
                setLoading(false)
            } catch (error) {
                console.log("error while getting channel stats:", error);
                setError(error.response?.data?.message || "An error occurred");
                setLoading(false)
            }
        })()
    }, [])
    return !loading ? (
        <div className='w-full'>
            {error && <p className="text-red-600 m-3 p-3 text-center">{error}</p>}
            <div className='flex flex-col justify-start items-center w-full'>
                <div className='text-2xl font-semibold mb-12 text-cyan-600'>Channel Analytics</div>
                <hr className="my-4 w-full  border border-blue-500" />
                <div className='  text-lg font-semibold text-cyan-500 flex flex-col justify-start items-start w-full'>
                    <div className=' flex flex-row justify-around items-center w-full'>
                        <div>Current Subscribers</div>
                        <span className=' mr-5' >{stats?.data?.totalSubscribers}</span>
                    </div>
                    <hr className="my-4 w-full  border border-blue-50" />
                    <div className=' flex flex-row justify-around items-center w-full'>
                        <div>Total Videos</div>
                        {
                            stats?.data?.totalViewsAndVideos && stats.data.totalViewsAndVideos.totalVideos !== null ? (
                                <span>{stats.data.totalViewsAndVideos.totalVideos}</span>
                            ) : (
                                <div className='text-black'>0</div>
                            )
                        }
                    </div>
                    <hr className="my-4 w-full  border border-blue-50" />
                    <div className=' flex flex-row justify-around items-center w-full'>
                        <div>Total Views</div>
                        {
                            stats?.data?.totalViewsAndVideos && stats.data.totalViewsAndVideos.totalViews !== null ? (
                                <span>{stats.data.totalViewsAndVideos.totalViews}</span>
                            ) : (
                                <div>0</div>
                            )
                        }                    </div>
                    <hr className="my-4 w-full  border border-blue-50" />
                    <div className=' flex flex-row justify-around items-center w-full'>
                        <div>Total Likes</div>
                        <span  >{stats?.data?.totalLikes}</span>
                    </div>
                    <hr className="my-4 w-full  border border-blue-50" />
                </div>
            </div>
        </div>
    ) : (<div className=" flex flex-col justify-center items-center w-full h-svh space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
        </div>
    </div>
    );
}

export default GetDashboardStats;