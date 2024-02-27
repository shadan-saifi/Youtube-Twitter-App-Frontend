import { useCallback, useEffect, useState } from "react"
import { getAllUserVideos, getUserSearchedVideos } from "../../services/videoService"
import { useForm } from "react-hook-form"
import { Link, useSearchParams } from "react-router-dom"
import Pagination from "../pagination/Pagination"
import { useSelector } from "react-redux"
import Select from "../Select"


function GetAllUserVideos({ username }) {

    const [allVideos, setAllVideos] = useState("")
    const [error, setError] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    // const [totalPages, setTotalPages] = useState("");
    const [videoPerPage, setVideoPerPage] = useState("")
    const [totalVideoCount, setTotalVideoCount] = useState("")
    const siblingCount = 1;
    const [loading, setLoading] = useState(false)
    const { register, formState: { errors }, handleSubmit, watch } = useForm({
        defaultValues: {
            sortBy: "title",
            sortType: "asc",
            limit: 4,
            isPublished: true
        }
    });

    const authStatus = useSelector((state) => state.auth.status);
    const user = useSelector((state) => state.auth.userData);

    const [searchParams, _] = useSearchParams();
    const query = searchParams.get("q")


    const handlePageChange = (page) => {
        setCurrentPage(page)
    }
    const handleDuration = (time) => {
        const h = Math.floor(time / 3600)
        const m = Math.floor((time % 3600) / 60)
        const s = Math.floor(time % 60)

        const formattedHour = h < 10 ? "0" + h : h;
        const formattedMinute = m < 10 ? "0" + m : m;
        const formattedSecond = s < 10 ? "0" + s : s;
        let formattedTime = formattedHour + ":" + formattedMinute + ":" + formattedSecond;
        return formattedTime
    }

    const handleUploadDate = (createdAt) => {
        const currentDate = new Date();
        const createdAtDate = new Date(createdAt);

        const timeDifferenceInSeconds = Math.floor((currentDate - createdAtDate) / 1000);

        if (timeDifferenceInSeconds < 60) {
            return `${timeDifferenceInSeconds} second${timeDifferenceInSeconds !== 1 ? 's' : ''} ago`;
        } else if (timeDifferenceInSeconds < 3600) {
            const minutes = Math.floor(timeDifferenceInSeconds / 60);
            return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        } else if (timeDifferenceInSeconds < 86400) {
            const hours = Math.floor(timeDifferenceInSeconds / 3600);
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        } else if (timeDifferenceInSeconds < 2592000) {
            const days = Math.floor(timeDifferenceInSeconds / 86400);
            return `${days} day${days !== 1 ? 's' : ''} ago`;
        } else if (timeDifferenceInSeconds < 31536000) {
            const months = Math.floor(timeDifferenceInSeconds / 2592000);
            return `${months} month${months !== 1 ? 's' : ''} ago`;
        } else {
            const years = Math.floor(timeDifferenceInSeconds / 31536000);
            return `${years} year${years !== 1 ? 's' : ''} ago`;
        }
    };


    const handleViews = (views) => {
        if (views < 1000) {
            return `${views} view${views !== 1 ? "s" : ""}`
        } else if (views >= 1000 && views < 100000) {
            return `${Math.floor(views / 1000)}k views`
        } else if (views >= 100000 && views < 10000000) {
            return `${Math.floor(views / 100000)}lakh views`
        } else {
            return `${Math.floor(views / 10000000)}crore views`
        }
    }


    const watchFields = useCallback(() => {
        return {
            sortBy: watch("sortBy"),
            sortType: watch("sortType"),
            limit: watch("limit"),
            isPublished: watch("isPublished")
        };
    }, [watch]);
    // console.log("isPublished value:", watch("isPublished"));


    useEffect(() => {
        ; (async () => {
            try {
                setLoading(true)
                let response
                if (query) {
                    response = await getUserSearchedVideos({ ...watchFields(), page: currentPage, username, query })
                    console.log("query response:", response);
                } else {
                    response = await getAllUserVideos({ ...watchFields(), page: currentPage, username })
                    console.log("all videos response:", response);

                }
                if (response) {
                    setTotalVideoCount(response?.data?.totalVideos)
                    setVideoPerPage(response?.data?.videosOnPage)
                    setAllVideos(response)
                    setLoading(false)
                }

            } catch (error) {
                setError(error.response?.data?.message || "An error occurred");
                setLoading(false)
            }
        })()
    }, [username, currentPage, query, watchFields().sortBy, watchFields().sortType, watchFields().limit, watchFields().isPublished]);

    return !loading ? (
        <div>
            <form onSubmit={handleSubmit(() => { })}
                className="flex sm:flex-row flex-col sm:justify-between justify-center sm:items-center shadow-md p-3 mb-3" >
                <label htmlFor="sortBy" >Sort By:</label>
                <select id="sortBy"
                    className="border focus:border-red-400 "
                    {
                    ...register("sortBy", {
                        required: "This field is required",
                    })
                    }
                    aria-invalid={errors.sortBy ? "true" : "false"}
                >
                    <option value="title" >Title</option>
                    <option value="description">Description</option>
                    <option value="duration">Duration</option>
                    <option value="views">Views</option>
                    <option value="createdAt">Upload Date</option>
                </select>
                {
                    errors.sortBy && <ul>
                        {errors.sortBy?.type === "required" && <li role="alert">{errors.sortBy?.message}</li>}
                    </ul>
                }

                <label htmlFor="sortType">Sort Type:</label>
                <select id="sortType"
                    className="border focus:border-red-400"
                    {
                    ...register("sortType", {
                        required: "This field is required",
                    })
                    }
                    aria-invalid={errors.sortType ? "true" : "false"}
                >
                    <option value="asc" >Ascending</option>
                    <option value="desc">Descending</option>
                </select>
                {
                    errors.sortType && <ul>
                        {errors.sortType?.type === "required" && <li role="alert">{errors.sortType?.message}</li>}
                    </ul>
                }

                <Select label="Videos Per Page:" options={[1, 2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 40, 50]}
                    className="border focus:border-red-400"

                    {
                    ...register("limit", {
                        required: "This field is required",
                    })
                    }
                    aria-invalid={errors.limit ? "true" : "false"} />
                {
                    errors.limit && <ul>
                        {errors.limit?.type === "required" && <li role="alert">{errors.limit?.message}</li>}
                    </ul>
                }

                {authStatus && user.data.username === username &&
                    <div>
                        <label htmlFor="isPublish">Publication status:</label>
                        <select id="isPublish"
                            className="border focus:border-red-400"

                            {
                            ...register("isPublished", {
                                required: "This field is required",
                            })
                            }
                            aria-invalid={errors.isPublished ? "true" : "false"}
                        >
                            <option value={true}>Published</option>
                            <option value={false}>Unpublished</option>

                        </select>
                        {
                            errors.isPublished && <ul>
                                {errors.isPublished?.type === "required" && <li role="alert">{errors.isPublished?.message}</li>}
                            </ul>
                        }
                    </div>
                }

            </form>
            {error && <p className="text-red-600 m-3 p-3 text-center">{error}</p>}

            <div className=" grid grid-flow-row sm:grid-cols-2 md:grid-cols-4 grid-cols-1 gap-4">
                {allVideos && allVideos.data.videos && allVideos.data.videos.length !== 0 ?
                    (allVideos.data.videos.map((videoDetails) => (
                        <div key={videoDetails._id} className="max-w-72">

                            <Link to={`/watch?v=${encodeURIComponent(videoDetails._id)}`}>
                                
                                <div className="relative">
                                    <img src={videoDetails.thumbnail.url} alt={videoDetails.title}
                                        className="rounded-2xl"
                                    />
                                    <span className="absolute right-3 bottom-1 text-lg text-white px-1  bg-gray-600 bg-opacity-70 rounded-md">
                                        {handleDuration(videoDetails.duration)}</span>
                                </div>
                                <div className="font-semibold text-lg text-left px-1 pt-1">{videoDetails.title}</div>
                                <div className="px-1 pb-2 flex flex-row justify-between items-center">
                                    <div>{handleViews(videoDetails.views)}</div>
                                    <div>{handleUploadDate(videoDetails.createdAt)}</div>
                                </div>
                            </Link>
                        </div>))
                    ) : (<div>{allVideos.message || "No videos to show"}</div>)
                }
            </div>
            <div className="bg-red-600 p-1 text-white flex flex-row justify-center items-center">

                {currentPage && <Pagination
                    onPageChange={handlePageChange}
                    totalCount={totalVideoCount}
                    siblingCount={siblingCount}
                    currentPage={currentPage}
                    pageSize={videoPerPage}
                />
                }
            </div>
        </div>
    ) : (<div>...Loading</div>)
}

export default GetAllUserVideos