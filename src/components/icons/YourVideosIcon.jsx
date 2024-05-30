// VideosIcon.jsx

import React from 'react';

const YourVideosIcon = () => (
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
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
    <path d="M10 10l5 3-5 3V10z" fill='none' />
    <line x1="0" y1="7" x2="0" y2="23" />
    <line x1="0" y1="24" x2="17" y2="24" />
    <line x1="2" y1="7" x2="2" y2="22" />
    <line x1="2" y1="22" x2="17" y2="22" />
  </svg>
);

export default YourVideosIcon;
