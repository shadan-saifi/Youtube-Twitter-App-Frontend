import React from 'react';

function handleViews(views) {
        if (views < 1000) {
            return `${views} view${views !== 1 && 0 ? "s" : ""}`;
        } else if (views >= 1000 && views < 100000) {
            return `${Math.floor(views / 1000)}k views`
        } else if (views >= 100000 && views < 10000000) {
            return `${Math.floor(views / 100000)}lakh views`
        } else {
            return `${Math.floor(views / 10000000)}crore views`
        }
}

export default handleViews;