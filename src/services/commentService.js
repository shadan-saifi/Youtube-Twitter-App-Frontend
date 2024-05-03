import axios from 'axios';
import React from 'react';

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.baseURL =  `${import.meta.env.VITE_API_URL}`;

async function handleResponse(response) {
    if (response.status >= 200 && response.status < 300) {
        return response.data;
    } else {
        throw new Error(response.data.message || `Unexpected status code: ${response.status}`);
    }
}
 
async function addVideoComment({videoId, content}) {
    try {
        const response = await axios.post(`/api/v1/comments/v/${videoId}`, JSON.stringify({
            content
        }))
        const data =await handleResponse(response)
        return data
    } catch (error) {
        throw error
    }
}

async function updateComment({commentId, content}) {
    try {
        const response = await axios.patch(`/api/v1/comments/c/${commentId}`, JSON.stringify({
            content
        }))
        const data =await handleResponse(response)
        return data
    } catch (error) {
        throw error
    }
}

async function getVideoComments({ videoId, skip, limit }) {
    try {
        const response = await axios.get(`/api/v1/comments/v/${videoId}`,{
            params:{
                skip,
                limit
            }
        })
        const data =await handleResponse(response)
        return data
    } catch (error) {
        throw error
    }
}

async function deleteComment({commentId}) {
    try {
        const response = await axios.delete(`/api/v1/comments/c/${commentId}`)
        const data =await handleResponse(response)
        return data
    } catch (error) {
        throw error
    }
}

async function addTweetComment({tweetId}) {
    try {
        const response = await axios.post(`/api/v1/comments/t/${tweetId}`, JSON.stringify({
            content
        }))
        const data =await handleResponse(response)
        return data
    } catch (error) {
        throw error
    }
}

async function getTweetComments({tweetId}) {
    try {
        const response = await axios.get(`/api/v1/comments/v/${tweetId}`)
        const data =await handleResponse(response)
        return data
    } catch (error) {
        throw error
    }
}
async function addReply({commentId}) {
    try {
        const response = await axios.get(`/api/v1/comments/r/${commentId}`)
        const data =await handleResponse(response)
        return data
    } catch (error) {
        throw error
    }
}
async function getAllReplies({commentId}) {
    try {
        const response = await axios.get(`/api/v1/comments/v/${commentId}`)
        const data =await handleResponse(response)
        return data
    } catch (error) {
        throw error
    }
}

export {
    addVideoComment,
    updateComment,
    getVideoComments,
    deleteComment,
    addTweetComment,
    getTweetComments,
    addReply,
    getAllReplies
}