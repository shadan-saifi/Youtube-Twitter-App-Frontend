import axios from "axios"

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.baseURL = `${import.meta.env.VITE_API_URL}`;

async function handleResponse(response) {
    if (response.status >= 200 && response.status < 300) {
        return response.data;
    } else {
        throw new Error(response.data.message || `Unexpected status code: ${response.status}`);
    }
}

async function publishVideo({ title, description,isPublished, videoFile, thumbnail }) {
    try {
        const formData = new FormData()
        formData.append("title", title)
        formData.append("description", description)
        formData.append("isPublished", isPublished)
        formData.append("videoFile", videoFile[0])
        formData.append("thumbnail", thumbnail[0])

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
async function getAllUserVideos({ page, limit, sortBy, sortType, isPublished, username }) {
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
async function getAllVideos({ page, limit, sortBy, sortType }) {
    try {
        const response = await axios.get("/api/v1/videos/all-videos", {
            params: {
                page,
                limit,
                sortBy,
                sortType,
            }
        })
        return handleResponse(response)

    } catch (error) {
        console.log("Error while getting all Video", error);
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

async function updateVideo({ title, description,isPublished,videoId, thumbnail }) {
    try {
        const formData = new FormData()
        formData.append("title", title)
        formData.append("description", description)
        formData.append("isPublished", isPublished)
        formData.append("thumbnail", thumbnail[0])
        const response = await axios.patch(`/api/v1/videos/${videoId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
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

async function getUserSearchedVideos({ page, limit, sortBy, sortType, isPublished, username, query, }) {
    try {
        const response = await axios.get("/api/v1/videos/user-search-videos", {
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

async function getSearchedVideos({ page, limit, sortBy, sortType, query, }) {
    try {
        const response = await axios.get("/api/v1/videos/search-videos", {
            params: {
                page,
                limit,
                sortBy,
                sortType,
                query
            }
        })
        return handleResponse(response)
    } catch (error) {
        console.log("Error while getting seached Video", error);
        throw error
    }
}

export {
    publishVideo,
    getAllUserVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishVideo,
    getUserSearchedVideos,
    getAllVideos, 
    getSearchedVideos
}