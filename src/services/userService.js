import axios from "axios"

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.baseURL = `${import.meta.env.VITE_API_URL}`;
axios.defaults.withCredentials = true


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
        if (coverImage) formData.append("coverImage", coverImage[0]);

        const response = await axios.post("/api/v1/users/register", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        const data = await handleResponse(response)
        return data
    } catch (error) {
        console.log("Error while creating account", error);
        throw error
    }
}

async function loginUser({ email, username, password }) {
    try {
        const response = await axios.post("/api/v1/users/login", JSON.stringify({
            email, username, password
        }))
        const data = await handleResponse(response)
        return data
    } catch (error) {
        throw error
    }
}

async function getCurrentUser() {
    try {
        const response = await axios.get("/api/v1/users/current-user")
        if (response.status >= 200 && response.status < 300) {
            return response.data
        } else return null

    } catch (error) {
        throw error
    }
}

async function logoutUser() {
    try {
        const response = await axios.post("/api/v1/users/logout")
        const data = await handleResponse(response)
        return data
    } catch (error) {
        console.log("logout:error", error);
        throw error
    }
}

async function refreshAccessToken() {
    try {
        const response = await axios.post("/api/v1/users/refresh-token")
        if (response.status >= 200 && response.status < 300) {
            return response.data
        } else return null
    } catch (error) {
        throw error
    }
}

async function updateAccountDetails({ fullname, email }) {
    try {
        console.log("fullname  ,email",fullname,email);
        const response = await axios.patch(`/api/v1/users/update-account`, { fullname:fullname, email:email })
        console.log("response of service",response);
        return await handleResponse(response)
    } catch (error) {
        console.log(error);
        throw error
    }
}
async function updateAvatar({avatar}) {
    try {
        const formData = new FormData();
        formData.append("avatar", avatar[0]);

        const response = await axios.patch(`/api/v1/users/update-avatar`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return await handleResponse(response)
    } catch (error) {
        throw error
    }
}
async function updateCoverImage({coverImage}) {
    try {
        const formData = new FormData();
        formData.append("coverImage", coverImage[0]);

        const response = await axios.patch(`/api/v1/users/update-cover-image`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return await handleResponse(response)
    } catch (error) {
        throw error
    }
}

async function deleteCoverImage(){
    try {
        const response = await axios.patch(`/api/v1/users/delete-cover-image`);
        return await handleResponse(response)
    } catch (error) {
        throw error
    }
}
async function getUserChannelProfile({ username }) {
    try {
        const response = await axios.get(`/api/v1/users/c/${username}`)
        return await handleResponse(response)
    } catch (error) {
        throw error
    }
}
export { createAccount, loginUser, logoutUser, getCurrentUser, refreshAccessToken, 
    getUserChannelProfile, updateAccountDetails,updateAvatar,updateCoverImage,deleteCoverImage }