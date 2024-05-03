import React, { useCallback, useEffect, useState } from 'react';
import { getChannelVideos } from '../../services/dashboardService';
import handleUploadDate from '../../hooks/handleUploadDate';
import handleViews from '../../hooks/handleViews';
import handleCommentsCount from '../../hooks/handleCommentsCount';
import handleLikeCount from '../../hooks/handleLikeCount';
import Select from '../Select';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import InputBox from '../InputBox';
import Pagination from '../pagination/Pagination';
import { deleteVideo } from '../../services/videoService';

function GetChannelVideos({ username }) {

    const [allVideos, setAllVideos] = useState("")
    const [error, setError] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    // const [totalPages, setTotalPages] = useState("");
    const [videoPerPage, setVideoPerPage] = useState("")
    const [totalVideoCount, setTotalVideoCount] = useState("")
    const siblingCount = 1;
    const [loading, setLoading] = useState(false)


    const handlePageChange = (page) => {
        setCurrentPage(page)
    }
    const { register, formState: { errors }, handleSubmit, watch } = useForm({
        defaultValues: {
            sortBy: JSON.parse(sessionStorage.getItem('sortBy')) || "title",
            sortType: JSON.parse(sessionStorage.getItem('sortType')) || "asc",
            limit: JSON.parse(sessionStorage.getItem('limit')) || 4,
            isPublished: JSON.parse(sessionStorage.getItem('isPublished')) || "",
            query: JSON.parse(sessionStorage.getItem('query')) || ""
        }
    });

    const watchFields = useCallback(() => {
        return {
            sortBy: watch("sortBy"),
            sortType: watch("sortType"),
            limit: watch("limit"),
            isPublished: watch("isPublished"),
            query: watch("query")
        };
    }, [watch]);

    useEffect(() => {
        ; (async () => {
            try {
                setLoading(true)
                const response = await getChannelVideos({ ...watchFields(), page: currentPage, username })
                if (response?.success === true) {
                    console.log(response);
                    setAllVideos(response.data)
                    setVideoPerPage(response?.data?.videosOnPage)
                    setTotalVideoCount(response?.data?.totalVideos)
                } else {
                    setError(response.message)
                }
                setLoading(false)
            } catch (error) {
                console.log("error while getting channel videos:", error);
                setError(error.response?.data?.message || "An error occurred");
                setLoading(false)
            }
        })()
    }, [currentPage, watchFields().sortBy, watchFields().sortType, watchFields().limit, watchFields().isPublished, watchFields().query]);

    useEffect(() => {
        // Save form data to localStorage
        sessionStorage.setItem('sortBy', JSON.stringify(watchFields().sortBy));
        sessionStorage.setItem('sortType', JSON.stringify(watchFields().sortType));
        sessionStorage.setItem('limit', JSON.stringify(watchFields().limit));
        sessionStorage.setItem('isPublished', JSON.stringify(watchFields().isPublished));
        sessionStorage.setItem('query', JSON.stringify(watchFields().query));
    }, [ watchFields().sortBy, watchFields().sortType, watchFields().limit, watchFields().isPublished, watchFields().query]);

    const handleDelete = async (videoId) => {
        try {
            const response = await deleteVideo({ videoId })
            if (response.success === true) {
                window.location.reload();
            }
        } catch (error) {
            console.log("error while getting channel stats:", error);
            setError(error.response?.data?.message || "An error occurred");
        }
    }
    return !loading ? (
        <div>
            {error && <p className="text-red-600 m-3 p-3 text-center">{error}</p>}
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
                <div>
                    <label htmlFor="isPublish">Publication status:</label>
                    <select id="isPublish"
                        className="border focus:border-red-400"

                        {
                        ...register("isPublished")
                        }
                        aria-invalid={errors.isPublished ? "true" : "false"}
                    >
                        <option value={true}>Published</option>
                        <option value={false}>Unpublished</option>

                    </select>

                </div>
                <InputBox
                    type="search"
                    placeholder="Search the channel videos"
                    autoCorrect="off"
                    spellCheck="false"
                    // value={query}
                    // onChange={(e) => setQuery(e.target.value)}
                    // onKeyDown={handleSearch}
                    className={`text-black outline-none  max-w-full mr-3 sm:max-w-36 md:max-w-72  border-none`}
                    {
                    ...register("query")
                    }
                    aria-invalid={errors.isPublished ? "true" : "false"}
                />
            </form>
            {
                allVideos?.videos?.length !== 0 ? (<div>
                    <table className=' table-auto w-full border-collapse border border-slate-400'>
                        <thead className='w-full'>
                            <tr >
                                <th className='border border-slate-300 '>Video</th>
                                <th className='border border-slate-300 '>Publication Status</th>
                                <th className='border border-slate-300'>Publish Date</th>
                                <th className='border border-slate-300'>Views</th>
                                <th className='border border-slate-300'>Comments</th>
                                <th className='border border-slate-300'>Likes</th>
                            </tr>
                        </thead>
                        <tbody className='w-full'>
                            {
                                allVideos?.videos?.map((video) => (
                                    <tr key={video._id} className=' text-center'>
                                        <td className='max-w-full border border-slate-300 flex sm:flex-row flex-col justify-center items-center'>
                                            <Link to={`/watch?v=${encodeURIComponent(video?._id)}`}>
                                                <img src={video?.thumbnail?.secure_url} alt="Video Thumbnail" className='max-w-28 m-2 rounded-md aspect-video object-cover' />
                                            </Link>
                                            <div className='flex flex-grow w-full space-x-2 mr-2'>
                                                <div className='hover:bg-gray-200 active:scale-95 bg-gray-50 px-2 py-0.5 rounded-md flex flex-row justify-center items-center'>
                                                    <div className='max-w-6'>
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            preserveAspectRatio="xMidYMid meet"
                                                            focusable="false"
                                                            className="pointer-events-none block w-full h-full"
                                                            style={{ width: "100%", height: "100%" }}
                                                        >
                                                            <g>
                                                                <path
                                                                    d="M14.06,7.6l2.34,2.34L6.34,20H4v-2.34L14.06,7.6 M14.06,6.19L3,17.25V21h3.75L17.81,9.94L14.06,6.19L14.06,6.19z M17.61,4.05l2.37,2.37l-1.14,1.14l-2.37-2.37L17.61,4.05 M17.61,2.63l-2.55,2.55l3.79,3.79l2.55-2.55L17.61,2.63L17.61,2.63z"
                                                                    className="fill-current text-gray-500"
                                                                ></path>
                                                            </g>
                                                        </svg>
                                                    </div>
                                                    <Link to={`/channel/${video?._id}/editvideo`}><span>Edit</span></Link>
                                                </div>
                                                <div className='hover:bg-gray-200 active:scale-95 bg-gray-50 px-2 py-0.5 rounded-md flex flex-row justify-center items-center'>
                                                    <div className='max-w-6'>
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            className="pointer-events-none block w-full h-full"
                                                            style={{ width: "100%", height: "100%" }}
                                                        >
                                                            <g>
                                                                <path
                                                                    className="fill-current"
                                                                    d="M11,17H9V8h2V17z M15,8h-2v9h2V8z M19,4v1h-1v16H6V5H5V4h4V3h6v1H19z M17,5H7v15h10V5z"
                                                                ></path>
                                                            </g>
                                                        </svg>
                                                    </div>
                                                    <button onClick={() => handleDelete(video._id)}>Delete</button>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='border border-slate-300'>{video?.isPublished === true ? "Published" : "Unpublished"}</td>
                                        <td className='border border-slate-300'>{handleUploadDate(video?.createdAt)}</td>
                                        <td className='border border-slate-300'>{handleViews(video?.views)}</td>
                                        <td className='border border-slate-300'>{handleCommentsCount(video?.totalComments)}</td>
                                        <td className='border border-slate-300'>{handleLikeCount(video?.totalLikes)}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                        <tfoot>
                            <tr >
                                <th colSpan="6">
                                    {
                                        currentPage && <Pagination
                                            onPageChange={handlePageChange}
                                            totalCount={totalVideoCount}
                                            siblingCount={siblingCount}
                                            currentPage={currentPage}
                                            pageSize={videoPerPage}
                                        />
                                    }
                                </th>

                            </tr>
                        </tfoot>
                    </table>
                </div>) : (<div className='mx-auto text-center my-auto mt-64 text-2xl'>No videos to show</div>)
            }
        </div>
    ) : (<div>...loading</div>)
}

export default GetChannelVideos;