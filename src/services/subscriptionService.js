import axios from "axios";
axios.defaults.headers.post["Content-Type"] = "application/json";

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
        console.log('Backend Response.data:', data);
        return data
    } catch (error) {
        throw error
    }
}

export {toggleSubscription}