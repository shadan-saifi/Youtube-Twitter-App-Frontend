import { useCallback, useEffect, useState } from "react"
import { getAllUserVideos, getAllVideos, getSearchedVideos, getUserSearchedVideos } from "../../services/videoService"
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom"
import Pagination from "../pagination/Pagination"
import { useSelector } from "react-redux"
import handleViews from "../../hooks/handleViews"
import handleUploadDate from "../../hooks/handleUploadDate"
import handleDuration from "../../hooks/handleDuration"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { AddToPlaylist } from ".."


function GetVideos({ username = null }) {

    const [allVideos, setAllVideos] = useState("")
    const [error, setError] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    // const [totalPages, setTotalPages] = useState("");
    const [videoPerPage, setVideoPerPage] = useState("")
    const [totalVideoCount, setTotalVideoCount] = useState("")
    const siblingCount = 1;
    const [loading, setLoading] = useState(false)
    const [activeCommentIndex, setActiveCommentIndex] = useState(null);


    const navigate = useNavigate()

    const form = useForm({
        resolver: zodResolver(
            z.object({
                sortBy: z.string().min(1, "This field is required"),
                sortType: z.string().min(1, "This field is required"),
                limit: z.number().int().min(1, "This field is required"),
                isPublished: z.string().optional()
            })
        ),
        defaultValues: {
            sortBy: "title",
            sortType: "asc",
            limit: "4",
            isPublished: "true"
        }
    })

    const authStatus = useSelector((state) => state.auth.status);
    const user = useSelector((state) => state.auth.userData);

    const [searchParams, _] = useSearchParams();
    const query = searchParams.get("q")

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const watchFields = useCallback(() => {
        return {
            sortBy: form.watch("sortBy"),
            sortType: form.watch("sortType"),
            limit: form.watch("limit"),
            isPublished: form.watch("isPublished")
        };
    }, [form.watch]);

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
                console.log("response", response);
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
            <Form {...form}>
                <form onSubmit={form.handleSubmit(() => { })} className={`${username === null ? `bg-gray-50 mt-8 rounded-xl` : null} flex sm:flex-row flex-col sm:justify-around justify-center items-center shadow-md p-1 sm:space-x-4 space-y-2 max-w-full  dark:bg-transparent`}  >
                    <FormField
                        control={form.control}
                        name="sortBy"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-row justify-start items-center max-w-64">
                                    <FormLabel className="w-24">Sort By</FormLabel>
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
                                    <FormLabel className="w-24">Sort Type</FormLabel>
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
                                    <FormLabel className="w-24">Limit</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a value to display" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {/* <SelectLabel>Sort By</SelectLabel> */}
                                                <SelectItem value="1">1</SelectItem>
                                                <SelectItem value="2">2</SelectItem>
                                                <SelectItem value="3">3</SelectItem>
                                                <SelectItem value="4">4</SelectItem>
                                                <SelectItem value="5">5</SelectItem>
                                                <SelectItem value="6">6</SelectItem>
                                                <SelectItem value="8">8</SelectItem>
                                                <SelectItem value="10">10</SelectItem>
                                                <SelectItem value="15">15</SelectItem>
                                                <SelectItem value="20">20</SelectItem>
                                                <SelectItem value="30">30</SelectItem>
                                                <SelectItem value="40">40</SelectItem>
                                                <SelectItem value="50">50</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {authStatus && username !== null && user?.data?.username === username &&
                        <FormField
                            control={form.control}
                            name="isPublished"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex flex-row justify-start items-center max-w-64">
                                        <FormLabel className="w-24">Publication status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a value to display" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {/* <SelectLabel>Sort By</SelectLabel> */}
                                                    <SelectItem value="true">Published</SelectItem>
                                                    <SelectItem value="false">Unpublished</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />}
                </form>
            </Form>
            {error && <p className="text-red-600 m-3 p-3 text-center">{error}</p>}

            <div className=" grid grid-flow-row sm:grid-cols-2 lg:grid-cols-4 grid-cols-1 gap-4 my-16">
                {allVideos && allVideos?.data?.videos && allVideos?.data?.videos?.length !== 0 ?
                    (allVideos?.data?.videos?.map((videoDetails, index) => (
                        <div key={videoDetails?._id} className="sm:max-w-72 hover:scale-[1.01] ">
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
                                            <Avatar className="max-w-[120px] h-14 w-14">
                                                <AvatarImage src={videoDetails?.ownerOfVideo?.avatar?.secure_url} />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                        </div>
                                    ) : null
                                }
                                <div className="grow">
                                    <div className="flex flex-row justify-between items-center space-x-4 pt-2">
                                        <h4 className="scroll-m-20 lg:text-xl sm:text-lg text-base font-semibold tracking-tight px-2 max-w-32 text-ellipsis text-wrap">
                                            {videoDetails?.title}
                                        </h4>
                                        {
                                            authStatus && <div className="" onClick={() => setActiveCommentIndex(index === activeCommentIndex ? null : index)}>
                                                <AddToPlaylist setActiveCommentIndex={setActiveCommentIndex} activeCommentIndex={activeCommentIndex} index={index} videoId={videoDetails?._id} />
                                            </div>
                                        }
                                    </div>
                                    {
                                        username === null ? (
                                            <div onClick={() => navigate(`/${videoDetails?.ownerOfVideo?.username}/videos`)}>
                                                <div className=" text-md text-left px-2 hover:bg-slate-100 rounded">{videoDetails?.ownerOfVideo?.fullname}</div>
                                            </div>
                                        ) : null
                                    }
                                    <div className="px-2 pb-2 flex flex-row justify-between items-center w-full text-sm">
                                        <div>{handleViews(videoDetails?.views)}</div>
                                        <div>{handleUploadDate(videoDetails?.createdAt)}</div>
                                    </div>
                                </div>
                            </div>

                        </div>))
                    ) : (<div>{"No videos to show"}</div>)
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
    ) : (
        <div className=" flex flex-col justify-center items-center w-full h-svh space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    )
}

export default GetVideos