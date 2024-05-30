import React, { useEffect, useState } from 'react';
import { getPlaylistById } from '../services/playlistService';

function usePlaylistInfo({ playlistId }) {

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [playlist, setPlaylist] = useState("")

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                const response = await getPlaylistById({ playlistId })
                if (response) {
                    setPlaylist(response)
                    setLoading(false)
                }
            } catch (error) {
                console.log("error:", error)
                setError(error.response?.data?.message || "An error occurred while fetching playlist");
                setLoading(false)
            }
        })()
    }, [])

    return { error, loading, playlist }
}

export default usePlaylistInfo;