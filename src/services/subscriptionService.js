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

async function toggleSubscription({username}) {
    try {
        const response = await axios.post(`/api/v1/subscriptions/c/${username}`)
        const data =await handleResponse(response)
        return data
    } catch (error) {
        throw error
    }
}

export {toggleSubscription}