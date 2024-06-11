import React, { useEffect } from 'react';
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
import {
    Select,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectItem,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { createPlaylist, updatePlaylist } from '@/services/playlistService';
import { useSelector } from 'react-redux';

function CreateAndUpdatePlaylist({ setError, setMssg, videoId = null, playlist = null }) {
    const authStatus = useSelector((state) => state.auth.status)
    const user = useSelector((state) => state.auth.userData)
    const FormSchema = z.object({
        name: z.string().min(2, {
            message: "Name must be at least 2 characters.",
        }),
        description: z.string().min(1, {
            message: "Description is required.",
        }),
        isPublished: z.string().refine(value => value !== undefined, {
            message: "Privacy is required.",
        }),
    })

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            isPublished: playlist ? playlist?.isPublished?.toString() : "true"
        }
    })
    useEffect(() => {
        if (playlist) {
            form.setValue("name", playlist?.name);
            form.setValue("description", playlist?.description);
            // form.setValue("isPublished", playlist.isPublished);
        }
    }, [playlist, form.setValue])

    async function onSubmit(data) {
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
        console.log("data", data);
        try {
            setMssg("")
            setError("")
            const { name, description, isPublished } = data
            if (playlist) {
                const response = await updatePlaylist({ name, description, isPublished, playlistId: playlist?._id })
                console.log("response of update playlist", response);
                if (response?.success === true) {
                    setMssg(response?.message)
                    window.location.reload();
                }

            } else {
                const response = await createPlaylist({ name, description, isPublished, videoId })
                console.log("response of create playlist", response);
                if (response?.success === true) {
                    setMssg(response?.message)
                }
            }
        } catch (error) {
            console.error(error)
            setError(error.response?.data?.message || `An error occurred while ${playlist ? 'updating' : 'creating'} the playlist`);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 ">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Playlist name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter a playlist name here..." {...field} />
                            </FormControl>
                            {/* <FormDescription>
                                This is your playlist's display name.
                            </FormDescription> */}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Playlist description</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter a playlist description here..." {...field} />
                            </FormControl>
                            <FormDescription>
                                This description will help people to understaand the content of the playlist better.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="w-24">Privacy</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}  >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a value to display" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectGroup >
                                        {/* <SelectLabel>Sort By</SelectLabel> */}
                                        <SelectItem value="true">Public</SelectItem>
                                        <SelectItem value="false">Private</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="mt-2">{playlist?.name ? "Update Playlist" : "Create Playlist"}</Button>
            </form>
        </Form>
    )
}

export default CreateAndUpdatePlaylist;