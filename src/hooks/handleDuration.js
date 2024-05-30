import React from 'react';

function handleDuration(time) {
        const h = Math.floor(time / 3600)
        const m = Math.floor((time % 3600) / 60)
        const s = Math.floor(time % 60)
    
        const formattedHour = h < 10 ? "0" + h : h;
        const formattedMinute = m < 10 ? "0" + m : m;
        const formattedSecond = s < 10 ? "0" + s : s;
        let formattedTime = formattedHour + ":" + formattedMinute + ":" + formattedSecond;
        return formattedTime

}

export default handleDuration;