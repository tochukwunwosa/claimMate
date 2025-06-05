'use client';
import React, { useEffect, useState } from 'react';

const LoadingIndicator = ({ title }: { title: string }) => {
  const [animatedTitle, setAnimatedTitle] = useState(title);

  useEffect(() => {
    const loadingDots = ['', '.', '..', '...'];
    let index = 0;

    const interval = setInterval(() => {
      setAnimatedTitle(`${title}${loadingDots[index % loadingDots.length]}`);
      index++;
    }, 500);

    return () => clearInterval(interval); // cleanup
  }, [title]);

  return (
    <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg max-w-fit">
      <span className="text-gray-600 ">{animatedTitle}</span>
    </div>
  );
};

export default LoadingIndicator;
