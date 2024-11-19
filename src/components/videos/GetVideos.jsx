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
        <div className="p-4 sm:p-6 lg:p-8 dark:bg-gray-900 dark:text-white">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(() => {})}
              className={`${
                username === null ? `bg-gray-50 dark:bg-gray-800 mt-8 rounded-xl` : null
              } flex flex-col sm:flex-row sm:justify-between justify-center items-center shadow-xl p-4 sm:space-x-6 space-y-4 max-w-full dark:bg-transparent dark:text-white`}
            >
              <FormField
                control={form.control}
                name="sortBy"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-row justify-between items-center w-64 sm:w-72">
                      <FormLabel className="w-28 text-sm font-medium dark:text-gray-300">Sort By</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a value" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="title">Title</SelectItem>
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
                    <div className="flex flex-row justify-between items-center w-64 sm:w-72">
                      <FormLabel className="w-28 text-sm font-medium dark:text-gray-300">Sort Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a value" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="asc">Ascending</SelectItem>
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
                    <div className="flex flex-row justify-between items-center w-64 sm:w-72">
                      <FormLabel className="w-28 text-sm font-medium dark:text-gray-300">Limit</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a value" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {authStatus && username !== null && user?.data?.username === username && (
                <FormField
                  control={form.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-row justify-between items-center w-64 sm:w-72">
                        <FormLabel className="w-28 text-sm font-medium dark:text-gray-300">Publication Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
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
              )}
            </form>
          </Form>
      
          {error && <p className="text-red-600 m-4 text-center text-lg font-semibold">{error}</p>}
      
          <div className="grid grid-flow-row sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-16">
            {allVideos && allVideos?.data?.videos?.length > 0 ? (
              allVideos?.data?.videos?.map((videoDetails, index) => (
                <div key={videoDetails?._id} className="max-w-xs sm:max-w-md hover:scale-105 transition-transform duration-300 dark:hover:scale-105">
                  <Link to={`/watch?v=${encodeURIComponent(videoDetails?._id)}`}>
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={videoDetails?.thumbnail?.url}
                        alt={videoDetails?.title}
                        className="rounded-xl aspect-video object-cover transition-all duration-300"
                      />
                      <span className="absolute right-3 bottom-2 text-lg text-white px-2 py-1 bg-gray-800 bg-opacity-70 rounded-md">
                        {handleDuration(videoDetails?.duration)}
                      </span>
                    </div>
                  </Link>
                  <div className="px-2 py-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">{videoDetails?.title}</h4>
                      {authStatus && (
                        <div className="text-sm" onClick={() => setActiveCommentIndex(index === activeCommentIndex ? null : index)}>
                          <AddToPlaylist
                            setActiveCommentIndex={setActiveCommentIndex}
                            activeCommentIndex={activeCommentIndex}
                            index={index}
                            videoId={videoDetails?._id}
                          />
                        </div>
                      )}
                    </div>
                    {username === null && (
                      <div className="mt-2">
                        <div
                          className="text-sm font-medium text-gray-600 hover:text-gray-800 cursor-pointer dark:text-gray-300 dark:hover:text-white"
                          onClick={() => navigate(`/${videoDetails?.ownerOfVideo?.username}/videos`)}
                        >
                          {videoDetails?.ownerOfVideo?.fullname}
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-gray-500 mt-2 dark:text-gray-400">
                      <div>{handleViews(videoDetails?.views)}</div>
                      <div>{handleUploadDate(videoDetails?.createdAt)}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-lg font-semibold text-gray-600 dark:text-gray-400">No videos to show</div>
            )}
          </div>
      
          <div className="flex justify-center py-4 bg-gray-800 text-white dark:bg-gray-700 dark:text-white">
            {currentPage && (
              <Pagination
                onPageChange={handlePageChange}
                totalCount={totalVideoCount}
                siblingCount={siblingCount}
                currentPage={currentPage}
                pageSize={videoPerPage}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center w-full h-screen space-y-4">
          <Skeleton className="h-32 w-64 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-36" />
          </div>
        </div>
      );
      
}

export default GetVideos