import React, { useState, useEffect } from 'react';

const RefreshingImage = ({ imageUrl, refreshInterval = 1000, width = '100%', height = 'auto' }) => {
  const [imageSrc, setImageSrc] = useState('');

  const updateImage = () => {
    const timestamp = new Date().getTime();
    const updatedImageSrc = `${imageUrl}?timestamp=${timestamp}`;
    setImageSrc(updatedImageSrc);
  };

  useEffect(() => {
    updateImage();

    const interval = setInterval(() => {
      updateImage();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  return (
    <div style={{ width: width, height: height }}>
      <img 
        src={imageSrc} 
        alt="Refreshing Image" 
        style={{ maxWidth: '100%', height: 'auto' }} // Mantiene la relación de aspecto
      />
    </div>
  );
};

export default RefreshingImage;
