import React from 'react';

const ImageConfirm = ({ onTryImage, onGoBack, previewImage }) => {
  return (
    <div className="image-confirm">
      <img src={previewImage} alt="Preview" className="preview-image" />
      <div className="image-confirm-buttons">
        <button onClick={onTryImage}>Try this Image</button>
        <button onClick={onGoBack}>Go Back</button>
      </div>
    </div>
  );
};

export default ImageConfirm;