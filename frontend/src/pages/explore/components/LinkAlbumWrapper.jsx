import React from "react";
import { Link } from "react-router-dom";

const LinkAlbumWrapper = ({ children,album }) => {
  return (
    <>
      <Link to={`/albums/${album._id}`}>{children}</Link>
    </>
  );
};

export default LinkAlbumWrapper;
