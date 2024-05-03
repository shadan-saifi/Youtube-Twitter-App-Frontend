import { useCallback, useEffect, useState } from "react"
import { getAllUserVideos, getAllVideos, getSearchedVideos, getUserSearchedVideos } from "../../services/videoService"
import { useForm } from "react-hook-form"
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom"
import Pagination from "../pagination/Pagination"
import { useSelector } from "react-redux"
import Select from "../Select"
import handleViews from "../../hooks/handleViews"
import handleUploadDate from "../../hooks/handleUploadDate"
import handleDuration from "../../hooks/handleDuration"


function GetVideos({ username = null }) {

    const [allVideos, setAllVideos] = useState("")
    const [error, setError] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    // const [totalPages, setTotalPages] = useState("");
    const [videoPerPage, setVideoPerPage] = useState("")
    const [totalVideoCount, setTotalVideoCount] = useState("")
    const siblingCount = 1;
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
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

    const watchFields = useCallback(() => {
        return {
            sortBy: watch("sortBy"),
            sortType: watch("sortType"),
            limit: watch("limit"),
            isPublished: watch("isPublished")
        };
    }, [watch]);

    useEffect(() => {
        ; (async () => {
            try {
                setLoading(true)
                let response
                if (username !== null) {
                    if (query) {
                        response = await getUserSearchedVideos({ ...watchFields(), page: currentPage, username, query })
                    } else {
                        response = await getAllUserVideos({ ...watchFields(), page: currentPage, username })
                    }
                } else if (username === null) {
                    if (query) {
                        response = await getSearchedVideos({ ...watchFields(), page: currentPage, query })

                    } else {
                        response = await getAllVideos({ ...watchFields(), page: currentPage })
                    }
                }
                if (response) {
                    setTotalVideoCount(response?.data?.totalVideos)
                    setVideoPerPage(response?.data?.videosOnPage)
                    setAllVideos(response)
                    setLoading(false)
                }

            } catch (error) {
                setError(error.response?.data?.message || "An error occurred while displaying all videos");
                setLoading(false)
            }
        })()
    }, [username, currentPage, query, watchFields().sortBy, watchFields().sortType, watchFields().limit, watchFields().isPublished]);

    return !loading ? (
        <div>
            <form onSubmit={handleSubmit(() => { })}
                className={`${username === null ? `bg-gray-50 mt-8 rounded-xl` : null} flex sm:flex-row flex-col sm:justify-end justify-center sm:items-center shadow-md p-3 mb-3 sm:space-x-4 space-y-2`} >
                <div>
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
                </div>

                <div>
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
                </div>

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

                {authStatus && username !== null && user?.data?.username === username &&
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

            <div className=" grid grid-flow-row sm:grid-cols-2 md:grid-cols-4 grid-cols-1 gap-4 my-16">
                {allVideos && allVideos?.data?.videos && allVideos?.data?.videos?.length !== 0 ?
                    (allVideos?.data?.videos?.map((videoDetails) => (
                        <div key={videoDetails?._id} className="max-w-72 hover:scale-[1.01] ">
                            <Link to={`/watch?v=${encodeURIComponent(videoDetails?._id)}`}>

                                <div className="relative">
                                    <img src={videoDetails?.thumbnail?.url} alt={videoDetails?.title}
                                        className="rounded-2xl aspect-video object-cover"
                                    />
                                    <span className="absolute right-3 bottom-1 text-lg text-white px-1  bg-gray-600 bg-opacity-70 rounded-md">
                                        {handleDuration(videoDetails?.duration)}</span>
                                </div>
                            </Link>
                            <div className="px-1 pb-2 flex flex-row justify-start items-center">
                                {
                                    username === null ? (
                                        <div className="active:scale-95" onClick={() => navigate(`/${videoDetails?.ownerOfVideo?.username}/videos`)}>
                                            <img src={videoDetails?.ownerOfVideo?.avatar?.secure_url} alt="avatar image"
                                                className="object-cover sm:size-10 md:size-12 size-8 rounded-full " />
                                        </div>
                                    ) : null
                                }
                                <div className="grow">
                                    <div className="font-semibold text-lg text-left px-2 pt-2">{videoDetails?.title}</div>
                                    {
                                        username === null ? (
                                            <div onClick={() => navigate(`/${videoDetails?.ownerOfVideo?.username}/videos`)}>
                                                <div className=" text-md text-left px-2 hover:bg-slate-100 rounded">{videoDetails?.ownerOfVideo?.fullname}</div>
                                            </div>
                                        ) : null
                                    }
                                    <div className="px-2 pb-2 flex flex-row justify-between items-center w-full">
                                        <div>{handleViews(videoDetails?.views)}</div>
                                        <div>{handleUploadDate(videoDetails?.createdAt)}</div>
                                    </div>
                                </div>
                            </div>

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
                />}
            </div>
        </div>
    ) : (<div>...Loading</div>)
}

export default GetVideos