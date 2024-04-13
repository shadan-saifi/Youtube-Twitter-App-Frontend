import axios from "axios"

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.baseURL =  `${import.meta.env.VITE_API_URL}`;
axios.defaults.withCredentials=true


async function handleResponse(response) {
    if (response.status >= 200 && response.status < 300) {
        return response.data;
    } else {
        throw new Error(response.data.message || `Unexpected status code: ${response.status}`);
    }
}

async function createAccount({ fullname, username, password, email, avatar, coverImage }) {
    try {
        const formData = new FormData();
        formData.append("fullname", fullname);
        formData.append("email", email);
        formData.append("username", username);
        formData.append("password", password);
        formData.append("avatar", avatar[0]); 
        if(coverImage) formData.append("coverImage", coverImage[0]);
  
        const response = await axios.post("/register", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const data =await handleResponse(response)
        return data
    } catch (error) {
        console.log("Error while creating account", error);
        throw error
    }
}

async function loginUser({ email, username, password }) {
    try {
        const response = await axios.post("/api/v1/users/login", JSON.stringify({
            email, username, password}))
        const data =await handleResponse(response)
        return data
    } catch (error) {
        throw error
    }
}

async function getCurrentUser() {
    try {
        const response = await axios.get("/current-user")
        if (response.status >= 200 && response.status < 300) {
            return response.data
        } else return null

    } catch (error) {
        throw error
    }
}

async function logoutUser() {
    try {
        const response = await axios.post("/logout")
        const data = await handleResponse(response)
        return data
    } catch (error) {
        console.log("logout:error", error);
        throw error
    }
}

async function refreshAccessToken(){
    try {
        const response=await axios.post("/refresh-token")
        if (response.status >= 200 && response.status < 300) {
            return response.data
        } else return null
    } catch (error) {
        throw error
    }
}

async function getUserChannelProfile({username}){
    try {
        const response=await axios.get(`/c/${username}`)
        return await handleResponse(response)
    } catch (error) {
        throw error
    }
}
export { createAccount, loginUser, logoutUser, getCurrentUser, refreshAccessToken, getUserChannelProfile }