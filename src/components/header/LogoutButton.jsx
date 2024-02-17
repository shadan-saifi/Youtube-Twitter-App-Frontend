import { useDispatch } from "react-redux";
import { logoutUser } from "../../services/userService.js";
import { logout } from "../../store/authSlice.js";


function LogoutBtn(){
    const dispatch=useDispatch()
    const logoutHandler=async()=>{
       try {
         await logoutUser()
         dispatch(logout())
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