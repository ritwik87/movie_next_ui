import React from "react";
import ButtonComponent from "../components/button";
import { useRouter } from "next/navigation";

const EmptyMovieList = () => {
  const { push } = useRouter();

  return (
    <div className="d-flex flex-column justify-content-center align-items-center text-center">
      <h4>Your movie list is empty</h4>
      <ButtonComponent
        title="Add a new movie"
        onPress={() => push("/movieList/modifyMovie/0")}
      />
    </div>
  );
};

export default EmptyMovieList;
