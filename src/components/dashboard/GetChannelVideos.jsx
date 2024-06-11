import React, { useCallback, useEffect, useState } from 'react';
import { getChannelVideos } from '../../services/dashboardService';
import handleUploadDate from '../../hooks/handleUploadDate';
import handleViews from '../../hooks/handleViews';
import handleCommentsCount from '../../hooks/handleCommentsCount';
import handleLikeCount from '../../hooks/handleLikeCount';
import { Link } from 'react-router-dom';
import Pagination from '../pagination/Pagination';
import { deleteVideo } from '../../services/videoService';
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Select,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectItem,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

function GetChannelVideos({ username }) {

    const [allVideos, setAllVideos] = useState("")
    const [error, setError] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    // const [totalPages, setTotalPages] = useState("");
    const [videoPerPage, setVideoPerPage] = useState("")
    const [totalVideoCount, setTotalVideoCount] = useState("")
    const siblingCount = 1;
    const [loading, setLoading] = useState(false)
    const [handleSearch, setHandleSearch] = useState("")


    const handlePageChange = (page) => {
        setCurrentPage(page)
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const fieldValue = form.getValues('query');
            console.log("fieldValue:", fieldValue);
            setHandleSearch(fieldValue)
        }
    }

    const form = useForm({
        resolver: zodResolver(
            z.object({
                sortBy: z.string().min(1, "This field is required"),
                sortType: z.string().min(1, "This field is required"),
                limit: z.number().int().min(1, "This field is required"),
                isPublished: z.string().optional(),
                query: z.string().min(2, {
                    message: "Username must be at least 2 characters.",
                }),
            })
        ),
        defaultValues: {
            sortBy: sessionStorage.getItem('sortBy') ? JSON.parse(sessionStorage.getItem('sortBy')) : "title",
            sortType: sessionStorage.getItem('sortType') ? JSON.parse(sessionStorage.getItem('sortType')) : "asc",
            limit: sessionStorage.getItem('limit') ? JSON.parse(sessionStorage.getItem('limit')) : 6,
            isPublished: sessionStorage.getItem('isPublished') ? JSON.parse(sessionStorage.getItem('isPublished')) : "",
            query: sessionStorage.getItem('query') ? JSON.parse(sessionStorage.getItem('query')) : ""
        }

    })

    const watchFields = useCallback(() => {
        return {
            sortBy: form.watch("sortBy"),
            sortType: form.watch("sortType"),
            limit: form.watch("limit"),
            isPublished: form.watch("isPublished"),
        };
    }, [form.watch]);
    useEffect(() => {
        ; (async () => {
            try {
                let response;
                setLoading(true)
                if (handleSearch === "" || null || undefined) {
                    response = await getChannelVideos({ ...watchFields(), page: currentPage, username })
                } else {
                    response = await getChannelVideos({ ...watchFields(), query: handleSearch, page: currentPage, username })
                }
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
    }, [currentPage, watchFields().sortBy, watchFields().sortType, watchFields().limit, watchFields().isPublished, handleSearch]);

    useEffect(() => {
        // Save form data to localStorage
        sessionStorage.setItem('sortBy', JSON.stringify(watchFields().sortBy));
        sessionStorage.setItem('sortType', JSON.stringify(watchFields().sortType));
        sessionStorage.setItem('limit', watchFields().limit);
        sessionStorage.setItem('isPublished', watchFields().isPublished);
        sessionStorage.setItem('query', JSON.stringify(handleSearch));
    }, [watchFields().sortBy, watchFields().sortType, watchFields().limit, watchFields().isPublished, form.query]);

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
            <Form {...form}>
                <form onSubmit={form.handleSubmit(() => { })} className={`${username === null ? `bg-gray-50 mt-8 rounded-xl` : null} flex sm:flex-row flex-col sm:justify-around justify-center items-center shadow-md p-1 sm:space-x-4 space-y-2 max-w-full  dark:bg-transparent`}  >
                    <FormField
                        control={form.control}
                        name="sortBy"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-row justify-start items-center max-w-64">
                                    <FormLabel className="w-24 px-4">Sort By</FormLabel>
                                    <Select
                                        onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a value to display" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {/* <SelectLabel>Sort By</SelectLabel> */}
                                                <SelectItem value="title" >Title</SelectItem>
                                                <SelectItem value="description">Description</SelectItem>
                                                <SelectItem value="duration">Duration</SelectItem>
                                                <SelectItem value="views">Views</SelectItem>
                                                <SelectItem value="createdAt">Upload Date</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="sortType"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-row justify-start items-center max-w-64">
                                    <FormLabel className="w-24 pr-1">Sort Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a value to display" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {/* <SelectLabel>Sort By</SelectLabel> */}
                                                <SelectItem value="asc" >Ascending</SelectItem>
                                                <SelectItem value="desc">Descending</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="limit"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-row justify-start items-center max-w-64">
                                    <FormLabel className="w-24 pr-4">Limit</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a value to display" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {/* <SelectLabel>Sort By</SelectLabel> */}
                                                <SelectItem value={1}>1</SelectItem>
                                                <SelectItem value={2}>2</SelectItem>
                                                <SelectItem value={3}>3</SelectItem>
                                                <SelectItem value={4}>4</SelectItem>
                                                <SelectItem value={5}>5</SelectItem>
                                                <SelectItem value={6}>6</SelectItem>
                                                <SelectItem value={8}>8</SelectItem>
                                                <SelectItem value={10}>10</SelectItem>
                                                <SelectItem value={15}>15</SelectItem>
                                                <SelectItem value={20}>20</SelectItem>
                                                <SelectItem value={30}>30</SelectItem>
                                                <SelectItem value={40}>40</SelectItem>
                                                <SelectItem value={50}>50</SelectItem>

                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="isPublished"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-row justify-start items-center max-w-64">
                                    <FormLabel className="w-24 pr-4">Publication Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a value to display" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {/* <SelectLabel>Sort By</SelectLabel> */}
                                                <SelectItem >All</SelectItem>
                                                <SelectItem value="true">Published</SelectItem>
                                                <SelectItem value="false">Unpublished</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="query"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        type="search"
                                        placeholder="Search the channel videos"
                                        autoCorrect="off"
                                        spellCheck="false"
                                        onKeyDown={handleKeyDown}
                                        className="dark:bg-off-white"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>

            {/* <form onSubmit={handleSubmit(() => { })}
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
            </form> */}

            {
                allVideos?.videos?.length !== 0 ? (<div>
                    <table className=' table-auto w-full border-collapse border border-slate-400'>
                        <thead className='w-full'>
                            <tr >
                                <th className='border border-slate-300 '>Video</th>
                                <th className='border border-slate-300 '>Title</th>
                                {/* <th className='border border-slate-300 '>Description</th> */}
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
                                    <tr key={video._id} className=' text-center max-h-6'>
                                        <td className='max-w-full border border-b-0 border-slate-300 flex sm:flex-row flex-col justify-center items-center'>
                                            <Link to={`/watch?v=${encodeURIComponent(video?._id)}`}>
                                                <img src={video?.thumbnail?.secure_url} alt="Video Thumbnail" className='max-w-28 m-2 rounded-md aspect-video object-cover' />
                                            </Link>
                                            <div className='flex flex-grow w-full space-x-2 mr-2'>
                                                <Button variant="ghost">

                                                    <Link to={`/channel/${video?._id}/editvideo`}><span>Edit</span></Link>
                                                </Button>
                                                <Button variant="ghost" onClick={() => handleDelete(video._id)}>Delete</Button>

                                            </div>
                                        </td>
                                        <td className='border border-slate-300 text-ellipsis border-b-0'>{video?.title}</td>
                                        {/* <td className='border border-slate-300 max-h-20  border-b-0'>{video?.description}</td> */}
                                        <td className='border border-slate-300 border-b-0'>{video?.isPublished === true ? "Published" : "Unpublished"}</td>
                                        <td className='border border-slate-300 border-b-0'>{handleUploadDate(video?.createdAt)}</td>
                                        <td className='border border-slate-300 border-b-0'>{handleViews(video?.views)}</td>
                                        <td className='border border-slate-300 border-b-0'>{handleCommentsCount(video?.totalComments)}</td>
                                        <td className='border border-slate-300 border-b-0'>{handleLikeCount(video?.totalLikes)}</td>
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
    ) : (<div className=" flex flex-col justify-center items-center w-full h-svh space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
        </div>
    </div>
    )
}

export default GetChannelVideos;