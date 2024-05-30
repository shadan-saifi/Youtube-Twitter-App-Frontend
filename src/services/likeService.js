import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.baseURL =  `${import.meta.env.VITE_API_URL}`;

async function handleResponse(response) {
    if (response.status >= 200 && response.status < 300) {
        return response.data;
    } else {
        throw new Error(response.data.message || `Unexpected status code: ${response.status}`);
    }
}

async function toggleVideoLike({videoId}) {
    try {
        const response = await axios.post(`/api/v1/likes/toggle/v/${videoId}`)
        const data =await handleResponse(response)
        console.log('Backend Response.data:', data);
        return data
    } catch (error) {
        throw error
    }
}
async function toggleCommentLike({commentId}) {
    try {
        const response = await axios.post(`/api/v1/likes/toggle/c/${commentId}`)
        const data =await handleResponse(response)
        console.log('Backend Response.data:', data);
        return data
    } catch (error) {
        throw error
    }
}
async function toggleTweetLike({tweetId}) {
    try {
        const response = await axios.post(`/api/v1/likes/toggle/t/${tweetId}`)
        const data =await handleResponse(response)
        console.log('Backend Response.data:', data);
        return data
    } catch (error) {
        throw error
    }
}
async function getAllLikedVideos() {
    try {
        const response = await axios.get(`/api/likes/v1/videos`)
        const data =await handleResponse(response)
        console.log('Backend Response.data:', data);
        return data
    } catch (error) {
        throw error
    }
}
export {toggleVideoLike, toggleCommentLike, toggleTweetLike,getAllLikedVideos}