
import React from "react";

const ImageUpload = ({ 
    onFileChange, 
    onChooseFileClick, 
    onUploadFile, 
    fileInputRef 
}) => {

  return (
    <div className="upload">
      <div className="upload-buttons">
        {/* The file input is hidden and connected to the Choose File button via the ref */}
        <input
          type="file"
          onChange={onFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        {/* The Choose File button triggers a click event on the hidden file input */}
        <button onClick={onChooseFileClick}>Choose File</button>
        {/* Display the file name of the selected image */}
        <span>{fileInputRef.current && fileInputRef.current.files[0]?.name}</span>
        <button onClick={onUploadFile}>Upload Image</button>
      </div>
    </div>
  );
};

export default ImageUpload;