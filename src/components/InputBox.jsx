import React from "react"
import { useId } from "react"


function InputBox({ label, type = "text", className = "", ...props }, ref) {

    const id = useId()
    return (
        <div className="flex flex-col pb-3">
            {
                label && <label htmlFor={id} className=" font-semibold text-lg pb-1 text-blue-500">{label}</label>
            }
            <input type={type} id={id} className={`${className} w-80 px-3 py-2 border-2 border-blue-500 rounded-lg`} ref={ref} {...props}/>
        </div>
    )
}

export default React.forwardRef(InputBox)