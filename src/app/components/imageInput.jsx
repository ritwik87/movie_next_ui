"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";
import { Download } from "react-bootstrap-icons";
import classNames from "classnames";

const ImageInput = ({ onImageUpload, imageUrl }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [image, setImage] = useState(imageUrl || null);
  const fileInputRef = useRef(null);

  const handleDragEvents = useCallback((e, dragging) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        setImage(file);
        onImageUpload(file);
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const imageSrc = useMemo(() => {
    return image && typeof image === "object"
      ? URL.createObjectURL(image)
      : image;
  }, [image]);

  return (
    <div
      className={classNames("image-input-container", { dragging: isDragging })}
      onDragEnter={(e) => handleDragEvents(e, true)}
      onDragLeave={(e) => handleDragEvents(e, false)}
      onDragOver={(e) => handleDragEvents(e, false)}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div className="image-input-box">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="image-input"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        {image ? (
          <img
            src={imageSrc}
            alt="Uploaded"
            className="uploaded-image"
            width={260}
            height={350}
          />
        ) : (
          <div className="image-placeholder">
            <Download color="#fff" className="fs-6 pe-auto mb-2" />
            <span className="image-text">
              {isDragging
                ? "Drop image here"
                : "Drag & drop an image or click to upload"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageInput;
