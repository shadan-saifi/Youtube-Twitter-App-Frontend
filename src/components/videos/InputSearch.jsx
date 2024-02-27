import { useNavigate } from "react-router-dom";
import InputBox from "../InputBox";
import { useState } from "react";



function InputSearch({username,className=""}) {
    const [query,setQuery]=useState("")
    const navigate = useNavigate()
    const handleSearch = (e) => {
        if (e.key === 'Enter') {
          navigate(`/${username}/search?q=${encodeURIComponent(query)}`); 
        }
      };

    return (
        <div>
            <InputBox
              type="search"
                placeholder="Search the channel videos"
                autoCorrect="off"
                spellCheck="false"
                value={query}
                onChange={(e)=>setQuery(e.target.value)}
                onKeyDown={handleSearch}
                className={`text-black outline-none border-blue-700 w-full sm:max-w-36 md:max-w-72 ${className}`}
            />
        </div>
    );
}

export default InputSearch;