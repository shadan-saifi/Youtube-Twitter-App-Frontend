// PlaylistIcon.jsx

import React from 'react';

const PlaylistIcon = () => (
   <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="5.5" y1="8" x2="18" y2="8" />
    <line x1="5.5" y1="12" x2="12" y2="12" />
    <line x1="5.5" y1="16" x2="10" y2="16" />
    <path d="M14 12l5 3-5 3V13z"fill='black' />


  </svg>
);

export default PlaylistIcon;
