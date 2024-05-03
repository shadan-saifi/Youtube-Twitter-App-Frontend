import { NavLink, useParams } from "react-router-dom";
import { GetVideos } from "../../components";



function UserVideosPage() {

    const { username } = useParams()

   
    return (
        <div>
            
        <GetVideos username={username} />
            
        </div>
    )
}
export default UserVideosPage