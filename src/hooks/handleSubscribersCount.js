
import React from 'react';

function handleSubscribersCount(count) {
        if (count < 1000) {
            return `${count} subscriber${count !== 1 && 0 ? "s" : ""}`
        } else if (count >= 1000 && count < 100000) {
            return `${Math.floor(count / 1000)}k subscribers`
        } else if (count >= 100000 && count < 10000000) {
            return `${Math.floor(count / 100000)}lakh subscribers`
        } else {
            return `${Math.floor(count / 10000000)}crore subscribers`
        }
}

export default handleSubscribersCount;