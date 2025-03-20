import { useState } from 'react';
import defaultAvatar from "../../assets/images/avatar-icon.png";

const ImageWithFallback = ({ src, alt, className }) => {
  const [error, setError] = useState(false);

  return (
    <img
      src={error ? defaultAvatar : src || defaultAvatar}
      alt={alt || "user"}
      className={className}
      onError={() => setError(true)}
    />
  );
};

export default ImageWithFallback;
