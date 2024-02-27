import { forwardRef, useId } from "react";


function Select({options,label,className,...props},ref){
    const id=useId()

    return(
        <div>
            {label && <label htmlFor={id} >{label}</label>}
            <select id={id} className={`${className} px-3`} ref={ref} {...props}>
              {
                  options?.map((option)=>(
                    <option value={option} key={option}>{option}</option>
                    ))
              }
            </select>
        </div>
    )
}

export default forwardRef(Select)