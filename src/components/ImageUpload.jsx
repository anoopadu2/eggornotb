import React from "react";

const ImageUpload = ({ 
    onFileChange, 
    onChooseFileClick,
    fileInputRef 
}) => {

  return (
    <div className="upload">
      <div className="upload-buttons">
        {/* The file input is hidden and connected to the Choose File button via the ref */}
        <input
          type="file"
          accept="image/x-png,image/gif,image/jpeg, image/bmp, image/raw, img/ico, image/webp"
          onChange={onFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        {/* The Choose File button triggers a click event on the hidden file input */}
        <button onClick={onChooseFileClick}>Select from device</button>
      </div>
    </div>
  );
};

export default ImageUpload;