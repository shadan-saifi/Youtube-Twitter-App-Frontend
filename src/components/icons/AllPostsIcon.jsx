// AllPostsIcon.jsx

import React from 'react';

const AllPostsIcon = () => (
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
    <path d="M3 3h18v18H3z" /> {/* Big box */}
    <rect x="12" y="6" width="7" height="7" fill="none" /> {/* Small square box */}
    <path d="M8 9H6M10 13H6M18 17H6" /> {/* Lines */}
  </svg>
);

export default AllPostsIcon;
