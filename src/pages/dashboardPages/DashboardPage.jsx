import React from 'react';
import { DashboardSidebar } from '../../components';
import { Outlet } from 'react-router-dom';

function DashboardPage(props) {
    return (
        <div className='flex'>
            <div className=' w-1/4 border-r-2 border-blue-500 bg-gray-50 h-screen pt-8 px-4 '>
                <DashboardSidebar />
            </div>
            <Outlet  className='w-3/4 '/>
        </div>
    );
}

export default DashboardPage;