import React, { useEffect, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"

import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import ThreeDotsMenuIcon from '../icons/ThreeDotsMenuIcon';
import PlaylistIcon from '../icons/PlaylistIcon';
import AddIcon from '../icons/AddIcon';
import { getUserPlaylists } from '@/services/playlistService';
import { useSelector } from 'react-redux';
import { ListPlaylists } from '..';

function AddToPlaylist({ setActiveCommentIndex, activeCommentIndex, index, videoId }) {
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [allPlaylists, setAllPlaylists] = useState([])

    const authStatus = useSelector((state) => state.auth.status)
    const user = useSelector((state) => state.auth.userData)
    // console.log("user::", user);
    // console.log("allPlaylists:", allPlaylists);
    useEffect(() => {
        (async () => {
            try {
                if (authStatus && activeCommentIndex === index) {
                    setLoading(true)
                    const response = await getUserPlaylists({ username: user?.data?.username })
                    if (response) {
                        setAllPlaylists(response)
                        setActiveCommentIndex(null)
                        setLoading(false)
                    }
                }
            } catch (error) {
                setError(error.response?.data?.message || "An error occurred while getting all playlists for add to playlist");
                setActiveCommentIndex(null)
                setLoading(false)
            }
        })
            ()
    }, [index, activeCommentIndex, authStatus, user?.data?.username])

    return (
        <Dialog>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <ThreeDotsMenuIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuSeparator />
                    <DialogTrigger asChild>
                        <DropdownMenuItem>
                            <AddIcon />
                            <div>Add to playlist</div>
                        </DropdownMenuItem>
                    </DialogTrigger>
                    <DropdownMenuSeparator />
                </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
                {error && <p className="text-red-600 m-3 p-3 text-center">{error}</p>}
                <DialogHeader>
                    <DialogTitle>Save video to...</DialogTitle>
                    <DialogDescription>
                        Select playlists to save the video to.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <ListPlaylists allPlaylists={allPlaylists} videoId={videoId} setError={setError} />
                </div>
                {/* <DialogFooter>
                    <Button type="submit">Confirm</Button>
                </DialogFooter> */}
            </DialogContent>
        </Dialog>

    );
}

export default AddToPlaylist;