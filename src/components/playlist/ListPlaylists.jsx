import React, { useState } from 'react';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import { toast } from "@/components/ui/use-toast"
import { addVideoToPlaylist } from '@/services/playlistService';
import { CreateAndUpdatePlaylist } from '..';

function ListPlaylists({ allPlaylists, videoId, setError }) {
    const [mssg, setMssg] = useState("")


    const items = allPlaylists?.data?.playlists ?
        allPlaylists.data.playlists.map(playlist => (
            {
                id: playlist?._id,
                label: playlist?.name,
            }
        )) : [];

    const FormSchema = z.object({
        items: z.array(z.string()).refine((value) => value.some((item) => item), {
            message: "You have to select at least one item.",
        }),
    })

    const form = useForm({
        resolver: zodResolver(FormSchema)
    })

    async function onSubmit(data) {
        // toast({
        //     title: "You submitted the following values:",
        //     description: (
        //         <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        //             <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        //         </pre>
        //     ),
        // })  this toast is not working
        console.log("data.items", data?.items);
        try {
            data && data.items && data.items.map(async (playlistId) => {
                const response = await addVideoToPlaylist({ playlistId, videoId })
                if (response?.message === "Video added to playlist successfully") {
                    setMssg(response?.message)
                }
            })
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred while adding video to playlist");
        }
    }

    return (
        <div>
            <p className='text-blue-600 py-4'>{mssg}</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="items"
                        render={() => (
                            <FormItem>
                                {items.length !== 0 && items.map((item) => (
                                    <FormField
                                        key={item.id}
                                        control={form.control}
                                        name="items"
                                        render={({ field }) => {
                                            return (
                                                <FormItem
                                                    key={item.id}
                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                >
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={Array.isArray(field.value) && field.value.includes(item.id)}
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                    ? field.onChange([...(field.value || []), item.id])
                                                                    : field.onChange(
                                                                        (field.value || []).filter((value) => value !== item.id)
                                                                    );
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        {item.label}
                                                    </FormLabel>
                                                </FormItem>
                                            )
                                        }}
                                    />
                                ))}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>Create new playlist</AccordionTrigger>
                    <AccordionContent>
                        <CreateAndUpdatePlaylist setError={setError} setMssg={setMssg} videoId={videoId} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

        </div>
    )
}

export default ListPlaylists;
