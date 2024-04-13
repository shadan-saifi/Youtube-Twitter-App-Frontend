import axios from "axios"

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.baseURL = `${import.meta.env.VITE_API_URL}`;

async function handleResponse(response) {
    if (response.status >= 200 && response.status < 300) {
        console.log("response.data:", response.data);
        return response.data;
    } else {
        throw new Error(response.data.message || `Unexpected status code: ${response.status}`);
    }
}

async function createPlaylist({ name, description, videoId }) {
    try {
        const response = await axios.post(`/api/v1/playlist/create-playlist/${videoId}?`,
            JSON.stringify({ name, description }))
        return handleResponse(response)

    } catch (error) {
        throw error
    }
}
async function addVideoToPlaylist({ playlistId, videoId }) {
    try {
        const response = await axios.patch(`/api/v1/playlist/add/${playlistId}/${videoId}`)
        return handleResponse(response)

    } catch (error) {
        throw error
    }
}
async function removeVideoFromPlaylist({ playlistId, videoId }) {
    try {
        const response = await axios.patch(`/api/v1/playlist/remove/${playlistId}/${videoId}`)
        return handleResponse(response)

    } catch (error) {
        throw error
    }
}
async function deletePlaylist({ playlistId }) {
    try {
        const response = await axios.delete(`/api/v1/playlist/${playlistId}`)
        return handleResponse(response)

    } catch (error) {
        throw error
    }
}
async function updatePlaylist({ name, description, playlistId }) {
    try {
        const response = await axios.patch(`/api/v1/playlist/${playlistId}`,
            JSON.stringify({ name, description }))
        return handleResponse(response)

    } catch (error) {
        throw error
    }
}
async function getPlaylistById( {playlistId} ) {
    try {
        const response = await axios.get(`/api/v1/playlist/${playlistId}`)
        return handleResponse(response)

    } catch (error) {
        throw error
    }
}
async function getUserPlaylists({ username }) {
    try {
        const response = await axios.get(`/api/v1/playlist/user/${username}`)
        return handleResponse(response)

    } catch (error) {
        throw error
    }
}


export {
    createPlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
    getPlaylistById,
    getUserPlaylists
}