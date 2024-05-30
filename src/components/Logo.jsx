import React from "react"

function Logo({ width = "50px" }) {

    return (
        <div className="flex flex-row max-w-[120px]">
            <img src="/images/play.png" alt="Logo" style={{ width: width }}/>
            <span className="text-lg font-semibold text-red-600 pl-0.5">MeTube</span>
        </div>
    )
}

export default Logo