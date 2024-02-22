import { NavLink, useParams } from "react-router-dom";
import { GetAllUserVideos, InputSearch, UserProfile } from "../../components";



function UserVideosPage() {

    const { username } = useParams()

   
    return (
        <div>
            
        <GetAllUserVideos username={username} />
            
        </div>
    )
}
export default UserVideosPage