import { deletePlaylist, getUserPlaylists } from '@/services/playlistService';
import React, { useCallback, useEffect, useState } from 'react';
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
import { Link } from 'react-router-dom';
import handleUploadDate from '@/hooks/handleUploadDate';
import { CreateAndUpdatePlaylist, Pagination } from '..';
function GetChannelPlaylists({ username }) {
    const [error, setError] = useState("")
    const [error2, setError2] = useState("")
    const [loading, setLoading] = useState(false)
    const [mssg, setMssg] = useState("")
    const [allPlaylists, setAllPlaylists] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [playlistsPerPage, setPlaylistsPerPage] = useState("")
    const [totalPlaylistsCount, setTotalPlaylistsCount] = useState("")
    const siblingCount = 1;

    const authStatus = useSelector((state) => state.auth.status);
    const user = useSelector((state) => state.auth.userData);
    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

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
            sortBy: sessionStorage.getItem('sortBy') ? JSON.parse(sessionStorage.getItem('sortBy')) : "name",
            sortType: sessionStorage.getItem('sortType') ? JSON.parse(sessionStorage.getItem('sortType')) : "asc",
            limit: sessionStorage.getItem('limit') ? JSON.parse(sessionStorage.getItem('limit')) : 6,
            isPublished: sessionStorage.getItem('isPublished') ? JSON.parse(sessionStorage.getItem('isPublished')) : "",
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
                setLoading(true)
                const response = await getUserPlaylists({ ...watchFields(), page: currentPage, username })
                console.log("response of getUserPlaylists in dashboard", response)
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

    useEffect(() => {
        // Save form data to localStorage
        sessionStorage.setItem('sortBy', JSON.stringify(watchFields().sortBy));
        sessionStorage.setItem('sortType', JSON.stringify(watchFields().sortType));
        sessionStorage.setItem('limit', watchFields().limit);
        sessionStorage.setItem('isPublished', watchFields().isPublished);
    }, [watchFields().sortBy, watchFields().sortType, watchFields().limit, watchFields().isPublished]);

    const handleDelete = async (playlistId) => {
        try {
            const response = await deletePlaylist({ playlistId })
            if (response.success === true) {
                window.location.reload();
            }
        } catch (error) {
            console.log("error while deleting playlist:", error);
            setError(error.response?.data?.message || "An error occurred while deleting playlist");
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

            {
                allPlaylists.length !== 0 ? (<div>
                    <table className=' table-auto w-full border-collapse border border-slate-400'>
                        <thead className='w-full'>
                            <tr >
                                <th className='border border-slate-300 '>Playlists</th>
                                <th className='border border-slate-300 '>Title</th>
                                <th className='border border-slate-300 '>Privacy</th>
                                <th className='border border-slate-300'>Update Date</th>

                            </tr>
                        </thead>
                        <tbody className='w-full'>
                            {
                                allPlaylists.map((playlist) => (
                                    <tr key={playlist._id} className=' text-center max-h-6'>
                                        <td className='max-w-full border border-b-0 border-slate-300 flex sm:flex-row flex-col justify-center items-center '>
                                            <div>
                                                {playlist?.allVideos[0]?.thumbnail ?
                                                    <Link to={`/watch?v=${encodeURIComponent(playlist?.allVideos[0]?._id)}&list=${encodeURIComponent(playlist?._id)}`}>
                                                        <img src={playlist?.allVideos[0]?.thumbnail?.secure_url} alt={playlist?.allVideos[0]?.title}
                                                            className='max-w-28 m-2 rounded-md aspect-video object-cover'
                                                        />
                                                    </Link>
                                                    : <div className='w-28 m-2 rounded-md aspect-video object-cover flex flex-row justify-center items-center border'>Playlist is empty</div>}
                                            </div>
                                            <div className='flex flex-row justify-evenly items-center w-full space-x-2 mr-2'>
                                                {authStatus && username !== null && user?.data?.username === username &&
                                                    <Dialog>
                                                        <DialogTrigger>

                                                            <div className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 hover:bg-accent hover:text-accent-foreground p-[10px]'>Update</div>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Fill the following details to create a playlist</DialogTitle>
                                                            </DialogHeader>
                                                            <span>{mssg}</span>
                                                            {error2 && <p className="text-red-600 m-3 p-3 text-center">{error2}</p>}
                                                            <div>
                                                                <CreateAndUpdatePlaylist playlist={playlist} setError={setError2} setMssg={setMssg} />
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>}
                                                <Button variant="ghost" onClick={() => handleDelete(playlist._id)}>Delete</Button>

                                            </div>
                                        </td>
                                        <td className='border border-slate-300 text-ellipsis border-b-0'>{playlist?.name}</td>
                                        <td className='border border-slate-300 border-b-0'>{playlist?.isPublished === true ? "Public" : "Private"}</td>
                                        <td className='border border-slate-300 border-b-0'>{handleUploadDate(playlist?.updatedAt)}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                        <tfoot>
                            <tr >
                                <th colSpan="6"> {currentPage && <Pagination
                                    onPageChange={handlePageChange}
                                    totalCount={totalPlaylistsCount}
                                    siblingCount={siblingCount}
                                    currentPage={currentPage}
                                    pageSize={playlistsPerPage}
                                />}
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

export default GetChannelPlaylists;