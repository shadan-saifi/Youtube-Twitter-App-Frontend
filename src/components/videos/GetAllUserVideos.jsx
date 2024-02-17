import { useCallback, useEffect, useMemo, useState } from "react"
import { getAllUserVideos } from "../../services/videoService"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import Pagination from "../pagination/Pagination"


function GetAllUserVideos({ username }) {

    const [allVideos, setAllVideos] = useState("")
    const [error, setError] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    // const [totalPages, setTotalPages] = useState("");
    const [videoPerPage,setVideoPerPage]=useState("")
    const [totalVideoCount,setTotalVideoCount]=useState("")
    const siblingCount=1;
    const [loading,setLoading]=useState(false)
    const { register, formState: { errors }, handleSubmit, watch } = useForm();

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }
    const watchFields = useCallback(() => {
        return {
            sortBy: watch("sortBy"),
            sortType: watch("sortType"),
            limit: watch("limit")
        };
    }, [watch]);
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true)
                const response = await getAllUserVideos({ ...watchFields(), page: currentPage, username })
                if (response) {
                    setAllVideos(response)
                    // setTotalPages(response.data.totalPages)
                    setTotalVideoCount(response.data.totalDocs)
                    setVideoPerPage(response.data.limit)
                    setLoading(false)
                }

            } catch (error) {
                setError(error.response?.data?.message || "An error occurred");
                setLoading(false)
            }
        };
        fetchVideos()
}, [currentPage, username, watchFields().sortBy, watchFields().sortType, watchFields().limit]);


    return !loading?(
        <div>
            <form onSubmit={handleSubmit(() => { })}
                className="flex sm:flex-row flex-col sm:justify-between justify-center sm:items-center shadow-md p-3 mb-3" >
                <label htmlFor="sortBy" >Sort By:</label>
                <select id="sortBy" defaultValue="title"
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
                <select id="sortType" defaultValue="asc"
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

                <label htmlFor="limit">Videos Per Page:</label>
                <select id="limit" defaultValue="4"
                    className="border focus:border-red-400"

                    {
                    ...register("limit", {
                        required: "This field is required",
                    })
                    }
                    aria-invalid={errors.limit ? "true" : "false"}
                >
                    <option value="1" >1</option>
                    <option value="2" >2</option>
                    <option value="4" >4</option>
                    <option value="6">6</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="40">40</option>
                    <option value="50">50</option>
                </select>
                {
                    errors.limit && <ul>
                        {errors.limit?.type === "required" && <li role="alert">{errors.limit?.message}</li>}
                    </ul>
                }

            </form>
            {error && <p className="text-red-600 m-3 p-3 text-center">{error}</p>}

            <div className=" grid grid-flow-row sm:grid-cols-2 md:grid-cols-4 grid-cols-1 ">
                {allVideos && allVideos.data.docs ? (allVideos.data.docs.length !== 0 ? (
                    allVideos.data.docs.map((videoDetails) => (
                        <div key={videoDetails._id} className="max-w-72">
                            <Link to={`/videos/${videoDetails._id}`}>
                                <div className="relative">
                                    <img src={videoDetails.thumbnail.url} alt={videoDetails.title}
                                        className="rounded-2xl"
                                    />
                                    <span className="absolute right-3 bottom-1 text-lg text-white px-1  bg-gray-600 bg-opacity-70 rounded-md">{videoDetails.duration} s</span>
                                </div>
                                <div className="font-semibold text-lg text-left px-1 pt-1">{videoDetails.title}</div>
                                <div className="px-1 pb-2 flex flex-row justify-between items-center">
                                    <div>{videoDetails.views} views</div>
                                    <div>{videoDetails.createdAt}</div>
                                </div>
                            </Link>
                        </div>
                    ))) : (<div>{allVideos.message}</div>)):null
                }
            </div>
            <div className="bg-red-600 p-1 text-white flex flex-row justify-center items-center">

               <Pagination
                 onPageChange={handlePageChange}
                 totalCount={totalVideoCount}
                 siblingCount={siblingCount}
                 currentPage={currentPage}
                 pageSize={videoPerPage}
               />           

            </div>
        </div>
    ):(<div>...Loading</div>)
}

export default GetAllUserVideos