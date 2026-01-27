import React from 'react';
import { Outlet } from 'react-router-dom';

export const FoundationLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#F3F3F5] flex flex-col font-sans">
            <Outlet />
        </div>
    );
};
