import React from 'react';

function Image({
  src,
  alt = "Image Name",
  className = "",
  isAvatar = false,
  ...props
}) {
  // Determine if the image is from an external domain
  const isExternalImage = src && (
    src.startsWith('http://') || 
    src.startsWith('https://') || 
    src.startsWith('//') 
  ) && !src.startsWith(window.location.origin);

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      // Add crossOrigin attribute for external images to handle CORS
      crossOrigin={isExternalImage ? "anonymous" : undefined}
      onError={(e) => {
        console.log(`Image load error for: ${src}`);
        if (isAvatar) {
          // For avatar images, use a simple inline SVG that's guaranteed to work
          // Create a transparent 1x1 pixel GIF as the base image
          e.target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
          
          // Apply styling to create a circular container with the user icon
          e.target.style.backgroundColor = '#E5E7EB';
          e.target.style.padding = '0';
          e.target.style.position = 'relative';
          e.target.style.display = 'flex';
          e.target.style.alignItems = 'center';
          e.target.style.justifyContent = 'center';
          
          // Add the SVG icon as a background or pseudo-element
          const parent = e.target.parentNode;
          if (parent) {
            // Check if we already added an SVG icon
            const existingSvg = parent.querySelector('.avatar-fallback-icon');
            if (!existingSvg) {
              const svgIcon = document.createElement('div');
              svgIcon.className = 'avatar-fallback-icon';
              svgIcon.style.position = 'absolute';
              svgIcon.style.top = '50%';
              svgIcon.style.left = '50%';
              svgIcon.style.transform = 'translate(-50%, -50%)';
              svgIcon.style.width = '60%';
              svgIcon.style.height = '60%';
              svgIcon.style.zIndex = '1';
              svgIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%"><path fill="#9CA3AF" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>';
              parent.style.position = 'relative';
              parent.appendChild(svgIcon);
            }
          }
        } else {
          // Use the existing no_image.png for non-avatar images
          e.target.src = `${window.location.origin}/assets/images/no_image.png`;
        }
      }}
      {...props}
    />
  );
}

export default Image;
