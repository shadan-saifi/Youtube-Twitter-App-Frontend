import { useParams } from "react-router-dom";
import { UserProfile } from "../components";


function UserProfilePage(){
 const {username}=useParams()


 return(
        <div>
            <UserProfile username={username} />
        </div>
    )
}
export default UserProfilePage