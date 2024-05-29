import axios from 'axios';


axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.baseURL = `${import.meta.env.VITE_API_URL}`;

async function handleResponse(response) {
    if (response.status >= 200 && response.status < 300) {
        return response.data;
    } else {
        throw new Error(response.data.message || `Unexpected status code: ${response.status}`);
    }
}

async function getChannelStats() {
    try {
        const response = await axios.get(`api/v1/dashboard/stats`)
        const data = await handleResponse(response)
        return data
    } catch (error) {
        throw error
    }
}
async function getChannelVideos({
    page,
    limit,
    sortBy,
    sortType,
    isPublished,
    username, 
    query
}) {
    try {
        const response = await axios.get(`api/v1/dashboard/videos`, {
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
        const data = await handleResponse(response)
        return data
    } catch (error) {
        throw error
    }
}

export {getChannelStats,getChannelVideos}