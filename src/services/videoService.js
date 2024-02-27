import axios from "axios"

axios.defaults.headers.post["Content-Type"] = "application/json";

async function handleResponse(response) {
    if (response.status >= 200 && response.status < 300) {
        return response.data;
    } else {
        throw new Error(response.data.message || `Unexpected status code: ${response.status}`);
    }
}

async function publishVideo({ title, description, videoFile, thumbnail }) {
    try {
        const formData = new FormData()
        formData.append("title", title)
        formData.append("description", description)
        formData.append("videoFile", videoFile)
        formData.append("thumbnail", thumbnail)

        const response = await axios.post("/api/v1/videos", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
        return handleResponse(response)
    } catch (error) {
        console.log("Error while publishing Video", error);
        throw error
    }
}
async function getAllUserVideos({ page, limit, sortBy, sortType,isPublished, username }) {
    try {
        const response = await axios.get("/api/v1/videos", {
            params: {
                page,
                limit,
                sortBy,
                sortType,
                isPublished,
                username
            }
        })
        return handleResponse(response)

    } catch (error) {
        console.log("Error while getting all user Video", error);
        throw error
    }
}

async function getVideoById({ videoId }) {
    try {
        const response = await axios.get(`/api/v1/videos/${videoId}`)
        return handleResponse(response)
    } catch (error) {
        console.log("Error while getting Video by id", error);
        throw error
    }
}

async function updateVideo({ videoId }) {
    try {
        const response = await axios.patch(`/api/v1/videos/${videoId}`)
        return handleResponse(response)
    } catch (error) {
        console.log("Error while updating Video", error);
        throw error
    }
}

async function deleteVideo({ videoId }) {
    try {
        const response = await axios.delete(`/api/v1/videos/${videoId}`)
        return handleResponse(response)
    } catch (error) {
        console.log("Error while deleting Video", error);
        throw error
    }
}

async function togglePublishVideo({ videoId }) {
    try {
        const response = await axios.patch(`/api/v1/videos/toggle/publish/${videoId}`)
        return handleResponse(response)
    } catch (error) {
        console.log("Error while deleting Video", error);
        throw error
    }
}

async function getUserSearchedVideos({ page, limit, sortBy, sortType,isPublished, username, query, }) {
    try {
        const response = await axios.get("/api/v1/videos/search-videos", {
            params: {
                page,
                limit,
                sortBy,
                sortType,
                isPublished,
                username,
                query
            }
        })
        return handleResponse(response)
    } catch (error) {
        console.log("Error while getting user seached Video", error);
        throw error
    }
}

export { publishVideo, getAllUserVideos, getVideoById, updateVideo, deleteVideo, togglePublishVideo, getUserSearchedVideos }