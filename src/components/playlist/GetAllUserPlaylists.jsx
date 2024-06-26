import React, { useCallback, useEffect, useState } from 'react';
import { getUserPlaylists } from '../../services/playlistService';
import { Link } from 'react-router-dom';
import handleUploadDate from '../../hooks/handleUploadDate';
import { Skeleton } from '../ui/skeleton';
import {
    Select,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectItem,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

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
import { useSelector } from 'react-redux';
import { CreateAndUpdatePlaylist, Pagination } from '..';
import AddIcon from '../icons/AddIcon';

function GetAllUserPlaylists({ username }) {
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [mssg, setMssg] = useState("")
    const [allPlaylists, setAllPlaylists] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [playlistsPerPage, setPlaylistsPerPage] = useState("")
    const [totalPlaylistsCount, setTotalPlaylistsCount] = useState("")
    const siblingCount = 1;

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
            sortBy: "name",
            sortType: "asc",
            limit: 8,
        }
    })
    const authStatus = useSelector((state) => state.auth.status);
    const user = useSelector((state) => state.auth.userData);

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
                const response = await getUserPlaylists({ ...watchFields(), page: currentPage, username })
                console.log("response of getUserPlaylists", response)
                if (response.success === true) {
                    setAllPlaylists(response?.data?.playlists)
                    setTotalPlaylistsCount(response?.data?.totalPlaylists)
                    setPlaylistsPerPage(response?.data?.playlistsOnPage)
                    setLoading(false)
                }
            } catch (error) {
                setError(error.response?.data?.message || "An error occurred while all user fetching playlists");
                console.log(error);
                setLoading(false)
            }
        })
            ()
    }, [username, currentPage, watchFields().sortBy, watchFields().sortType, watchFields().limit, watchFields().isPublished]);

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
                                                <SelectItem value="name" >Name</SelectItem>
                                                <SelectItem value="description">Description</SelectItem>
                                                {/* <SelectItem value="videoCount">Video Count</SelectItem> */}
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
                                                    <SelectItem >All</SelectItem>
                                                    <SelectItem value="true">Public</SelectItem>
                                                    <SelectItem value="false">Private</SelectItem>
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
            {authStatus && username !== null && user?.data?.username === username && <Dialog>
                <DialogTrigger>
                    <div className='flex flex-row justify-between items-center space-x-2 p-2 hover:bg-blue-300 dark:hover:bg-gray-800 hover:text-white rounded-lg active:scale-95'>
                        <AddIcon />
                        <div>Create Playlist</div>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Fill the following details to create a playlist</DialogTitle>
                    </DialogHeader>
                    <span>{mssg}</span>
                    <div><CreateAndUpdatePlaylist setError={setError} setMssg={setMssg} /></div>
                </DialogContent>
            </Dialog>}
            {error && <p className="text-red-600 m-3 p-3 text-center">{error}</p>}
            <div className=" grid grid-flow-row sm:grid-cols-2 md:grid-cols-4 grid-cols-1 gap-4 my-16">
                {
                    allPlaylists?.length !== 0 ? (
                        allPlaylists?.map((playlist) => (
                            <div key={playlist?._id} className="max-w-72 hover:scale-[1.01] ">
                                <Link to={`/watch?v=${encodeURIComponent(playlist?.allVideos[0]?._id)}&list=${encodeURIComponent(playlist?._id)}`}>
                                    <div className="relative">
                                        {playlist?.allVideos[0]?.thumbnail ? <img src={playlist?.allVideos[0]?.thumbnail?.secure_url} alt={playlist?.allVideos[0]?.title}
                                            className="rounded-2xl aspect-video object-cover"
                                        /> : <div className='aspect-video rounded-2xl flex flex-row justify-center items-center border'>Playlist is empty</div>}
                                        <span className="absolute right-3 bottom-1 text-lg text-white px-1  bg-gray-600 bg-opacity-70 rounded-md">
                                            {playlist?.TotalVideos} Videos</span>
                                    </div>
                                </Link>
                                <div className='flex flex-row justify-between items-start'>
                                    <div className='m-2 flex flex-col justify-start items-between'>
                                        <div className='text-lg font-semibold'>{playlist?.name}</div>
                                        <div className='text-sm'>
                                            <span className=' bg-gray-200 px-1 rounded-md'>{playlist?.isPublished === true ? "Public" : "Private"}</span>
                                            <span className='mx-2'>(Playlist)</span>
                                        </div>
                                        <Link to={`/playlist?list=${encodeURIComponent(playlist?._id)}`} className='hover:font-semibold hover:text-blue-500 active:scale-95'>
                                            See full playlist
                                        </Link>
                                    </div>
                                    <div>
                                    <div className='text-sm mt-3'>Updated {handleUploadDate(playlist?.updatedAt)}</div>
                                        {/* {
                                            authStatus && <div className="" onClick={() => setActiveCommentIndex(index === activeCommentIndex ? null : index)}>
                                                <CreateAndUpdatePlaylist setActiveCommentIndex={setActiveCommentIndex} activeCommentIndex={activeCommentIndex} index={index} playlist={playlist} />
                                            </div>
                                        } */}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (<div>{allPlaylists?.message || "No playlists to show"}</div>)
                }
            </div>
            <div className="bg-red-600 p-1 text-white flex flex-row justify-center items-center">

                {currentPage && <Pagination
                    onPageChange={handlePageChange}
                    totalCount={totalPlaylistsCount}
                    siblingCount={siblingCount}
                    currentPage={currentPage}
                    pageSize={playlistsPerPage}
                />}
            </div>
        </div >
    ) : <div className=" flex flex-col justify-center items-center w-full h-svh space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
        </div>
    </div>
}

export default GetAllUserPlaylists;