import React from 'react';
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
} from "@/components/ui/dialog"

import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import ThreeDotsMenuIcon from '../icons/ThreeDotsMenuIcon';
import PlaylistIcon from '../icons/PlaylistIcon';
import AddIcon from '../icons/AddIcon';

function AddToPlaylist(props) {





    return (
        <Dialog>
            <DropdownMenu>
                <DropdownMenuTrigger><ThreeDotsMenuIcon/></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuSeparator />
                    <DialogTrigger asChild>
                        <DropdownMenuItem>
                            <AddIcon/>
                            <div>Add to playlist</div>
                        </DropdownMenuItem>
                    </DialogTrigger>
                    <DropdownMenuSeparator />
                </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Save video to...</DialogTitle>
                    <DialogDescription>
                        Select a playlist to save the video to.
                    </DialogDescription>
                </DialogHeader>
                <div>

                </div>
            </DialogContent>
        </Dialog>

    );
}

export default AddToPlaylist;