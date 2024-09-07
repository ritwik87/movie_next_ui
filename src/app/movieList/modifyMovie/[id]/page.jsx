"use client";
import ButtonComponent from "../../../components/button";
import ImageInput from "../../../components/imageInput";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { usePostImageUrlMutation } from "../../../../services/imageUploadApi";
import { usePutMoviesMutation } from "../../../../services/moviesApi";
import { useGetMovieByIdQuery } from "../../../../services/moviesApi";
import { useTranslation } from "react-i18next";
import FormComponent from "../../formComponent";
import { usePostMoviesMutation } from "../../../../services/moviesApi";
import PageHeadingComponent from "../../../components/pageHeadingComponent";

const ModifyMovie = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { t } = useTranslation();
  const { data: movieData, isLoading } = useGetMovieByIdQuery({ id });
  const { enqueueSnackbar } = useSnackbar();
  const [putMovies, { isLoading: isUpdating }] = usePutMoviesMutation();
  const [postMovies, { isLoading: isCreating }] = usePostMoviesMutation();

  const [postImageUrl] = usePostImageUrlMutation();
  const [fileData, setfileData] = useState(null);
  const poster = movieData?.poster;

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onSubmit" });

  useEffect(() => {
    if (movieData) {
      setValue("title", movieData?.title);
      setValue("year", movieData?.year);
      setValue("id", movieData?.id);
    }
  }, [movieData]);

  if (isLoading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  const handleImageUpload = (file_data) => {
    setfileData(file_data);
  };

  const onSubmit = async (data) => {
    if (parseInt(id)) {
      let image_url = poster;
      if (fileData) {
        image_url = await uploadMoviePoster(fileData);
      }
      try {
        await putMovies({
          id: data.id,
          payload: {
            title: data.title,
            year: parseInt(data.year, 10),
            poster: image_url,
          },
        }).unwrap();
        enqueueSnackbar(t("Movie Updated Successfully"), {
          variant: "success",
        });
        router.push("/movieList");
      } catch (error) {
        enqueueSnackbar(error.data.message, { variant: "error" });
      }
    } else {
      const poster_url = await uploadMoviePoster(fileData);

      if (poster_url) {
        try {
          await postMovies({
            payload: {
              title: data.title,
              year: parseInt(data.year, 10),
              poster: poster_url,
            },
          }).unwrap();
          enqueueSnackbar(t("Movie Created Successfully"), {
            variant: "success",
          });
          router.push("/movieList");
        } catch (error) {
          enqueueSnackbar(error.data.message, { variant: "error" });
        }
      }
    }
  };

  const uploadMoviePoster = async (fileData) => {
    let poster_url = "";
    try {
      const formData = new FormData();
      formData.append("file", fileData);
      const res = await postImageUrl(formData).unwrap();
      poster_url = res.url;
    } catch (error) {
      enqueueSnackbar("Error Uploading Movie Poster", { variant: "error" });
      return poster_url;
    }
    return poster_url;
  };
  const renderButtonUI = () => {
    return (
      <Row className="d-flex flex-row mt-5 ">
        <Col lg={6} md={6} sm={8}>
          <ButtonComponent
            title={t("Cancel")}
            onPress={() => router.push("/movieList")}
            btnContainerOverrideStyle="bg-movies-primary  bg-movie-button-border w-100"
          />
        </Col>
        <Col lg={6} md={6} sm={8}>
          <ButtonComponent
            title={t("Submit")}
            onPress={handleSubmit(onSubmit)}
            btnContainerOverrideStyle="w-100"
            isLoading={isCreating || isUpdating}
          />
        </Col>
      </Row>
    );
  };
  return (
    <Container className="my-5 position-relative z-3">
      <PageHeadingComponent title={parseInt(id) ? "Edit" : "Add"} />
      <Row style={{ marginTop: "30px" }}>
        {/* mobile device */}
        <Col lg={3} md={6} sm={12} xs={12} className="d-md-none d-block">
          <FormComponent
            formControls={{
              control,
              handleSubmit,
              setValue,
              getValues,
              formState: { errors },
            }}
          />
        </Col>
        {/* All devices */}
        <Col lg={6} md={6} sm={12} xs={12}>
          <ImageInput
            imageUrl={poster || ""}
            onImageUpload={handleImageUpload}
          />
        </Col>
        {/* tablet and above devices */}
        <Col lg={3} md={6} sm={12} xs={12} className="d-md-block d-none">
          <FormComponent
            formControls={{
              control,
              handleSubmit,
              setValue,
              getValues,
              formState: { errors },
            }}
          />
          {renderButtonUI()}
        </Col>
        {/* mobile device */}
        <Col lg={3} md={6} sm={12} xs={12} className="d-md-none d-block">
          {renderButtonUI()}
        </Col>
      </Row>
    </Container>
  );
};

//export default ProtectedRoute(ModifyMovie);
export default ModifyMovie;
