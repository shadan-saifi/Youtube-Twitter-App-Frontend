import { useDispatch } from "react-redux";
import { logoutUser } from "../../services/userService.js";
import { logout } from "../../store/authSlice.js";
import { useNavigate } from "react-router-dom";


function LogoutBtn(){
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const logoutHandler=async()=>{
       try {
         const response=await logoutUser()
         if(response.success===true){
            dispatch(logout())
            navigate("/")
         }
       } catch (error) {
        console.error("Logout failed", error.response);
       }
    }

    return (
        <button onClick={logoutHandler}>
            Logout
        </button>
    )
}

export default LogoutBtn