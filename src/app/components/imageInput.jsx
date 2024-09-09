"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";
import { Download } from "react-bootstrap-icons";
import classNames from "classnames";

const ImageInput = ({ onImageUpload, imageUrl }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [image, setImage] = useState(imageUrl || null);
  const fileInputRef = useRef(null);

  // Handle drag events
  const handleDragEvents = useCallback((e, dragging) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  }, []);

  // Handle file drop
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file?.type.startsWith("image/")) {
        setImage(file);
        onImageUpload(file);
      }
    },
    [onImageUpload]
  );

  // Handle file input change
  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file?.type.startsWith("image/")) {
        setImage(file);
        onImageUpload(file);
      }
    },
    [onImageUpload]
  );

  // Handle click to open file input
  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Memoize the image source
  const imageSrc = useMemo(() => {
    if (!image) return null;
    return typeof image === "object" ? URL.createObjectURL(image) : image;
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
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Uploaded"
            className="uploaded-image"
            width={260}
            height={350}
          />
        ) : (
          <div className="image-placeholder">
            <Download color="#fff" className="fs-6 mb-2" />
            <span className="image-text">
              {isDragging
                ? "Drop image here"
                : "Drag & drop or click to upload"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageInput;
