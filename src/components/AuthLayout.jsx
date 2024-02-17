import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


function AuthLayout({children,authorization}){
    const [loading,setLoading]=useState(true)
    const navigate=useNavigate()
    const authStatus=useSelector(state=>state.auth.status)

    useEffect(()=>{
        if(authorization && authStatus!==authorization){
            navigate("/login")
        }else if (!authorization && authStatus!==authorization){
            navigate("/")
        }
        setLoading(false)
    },[loading,authorization,authStatus,navigate])

    return loading ?(<div>...Loading</div>):(<div>{children}</div>)
}

export default AuthLayout