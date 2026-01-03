import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  onError?: () => void;
}

export function SafeImage({ 
  src, 
  alt, 
  className = "", 
  fallbackClassName = "",
  onError 
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    if (onError) {
      onError();
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-400 ${fallbackClassName || className}`}>
        <ImageIcon className="w-8 h-8" />
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className={`flex items-center justify-center bg-gray-100 text-gray-400 ${fallbackClassName || className}`}>
          <div className="animate-pulse">
            <ImageIcon className="w-8 h-8" />
          </div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'hidden' : ''}`}
        onError={handleError}
        onLoad={handleLoad}
      />
    </>
  );
}