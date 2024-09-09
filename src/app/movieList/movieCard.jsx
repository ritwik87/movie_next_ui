import React from "react";

const MovieCard = ({ title, year, imageSrc, onClick }) => {
  const handleImageSrc = (src) => src.replace(/^https:/, "http:");

  return (
    <div
      className="movie-card w-100 rounded shadow mb-5 overflow-hidden"
      onClick={onClick}
      style={{ cursor: "pointer" }}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === "Enter" && onClick()}
    >
      <img
        alt={`${title} poster`}
        src={handleImageSrc(imageSrc)}
        width={260}
        height={300}
        style={{ objectFit: "cover" }}
      />
      <div className="p-2">
        <h6 className="movie-title">{title}</h6>
        <span className="movie-year">{year}</span>
      </div>
    </div>
  );
};

export default MovieCard;
