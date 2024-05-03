import React from 'react';
import {UploadAndEditVideo} from "../../components/index.js"

function UploadVideoPage() {
    return (
        <div className='bg-gray-100 rounded-2xl p-8 mx-auto max-w-[800px] content-center'>
        <UploadAndEditVideo className="w-full" />
    </div>
    );
}

export default UploadVideoPage;