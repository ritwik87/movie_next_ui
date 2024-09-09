"use client";

import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

import ButtonComponent from "../../../components/button";
import ImageInput from "../../../components/imageInput";
import PageHeadingComponent from "../../../components/pageHeadingComponent";
import FormComponent from "../../formComponent";
import ProtectedRoute from "../../../protected";
import { usePostImageUrlMutation } from "../../../../services/imageUploadApi";

import {
  useGetMovieByIdQuery,
  usePutMoviesMutation,
  usePostMoviesMutation,
} from "../../../../services/moviesApi";

const ModifyMovie = () => {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const isEditMode = !!parseInt(id);

  const { data: movieData, isLoading: isLoadingMovie } = useGetMovieByIdQuery({
    id,
  });
  const [putMovies, { isLoading: isUpdating }] = usePutMoviesMutation();
  const [postMovies, { isLoading: isCreating }] = usePostMoviesMutation();
  const [postImageUrl] = usePostImageUrlMutation();

  const [fileData, setFileData] = useState(null);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ mode: "onSubmit" });

  useEffect(() => {
    if (movieData) {
      setValue("title", movieData.title);
      setValue("year", movieData.year);
      setValue("id", movieData.id);
    }
  }, [movieData, setValue]);

  const handleImageUpload = (file) => setFileData(file);

  const uploadMoviePoster = async (file) => {
    if (!file) return movieData?.poster || "";

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await postImageUrl(formData).unwrap();
      return res.url;
    } catch (error) {
      enqueueSnackbar(t("Error Uploading Movie Poster"), { variant: "error" });
      return "";
    }
  };

  const onSubmit = async (data) => {
    const imageUrl = await uploadMoviePoster(fileData);

    const moviePayload = {
      title: data.title,
      year: parseInt(data.year, 10),
      poster: imageUrl,
    };

    try {
      if (isEditMode) {
        await putMovies({ id: data.id, payload: moviePayload }).unwrap();
        enqueueSnackbar(t("Movie Updated Successfully"), {
          variant: "success",
        });
      } else {
        await postMovies({ payload: moviePayload }).unwrap();
        enqueueSnackbar(t("Movie Created Successfully"), {
          variant: "success",
        });
      }
      router.push("/movieList");
    } catch (error) {
      enqueueSnackbar(error.data.message, { variant: "error" });
    }
  };

  const renderButtonUI = () => (
    <Row className="d-flex flex-row mt-5">
      <Col lg={6} md={6} sm={8}>
        <ButtonComponent
          title={t("Cancel")}
          onPress={() => router.push("/movieList")}
          btnContainerOverrideStyle="app-bg-color button-border-color w-100"
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

  if (isLoadingMovie) {
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

  return (
    <Container className="my-5 position-relative z-3">
      <PageHeadingComponent
        title={isEditMode ? t("Edit Movie") : t("Add Movie")}
      />
      <Row style={{ marginTop: "30px" }}>
        <Col lg={6} md={6} sm={12} xs={12}>
          <ImageInput
            imageUrl={movieData?.poster || ""}
            onImageUpload={handleImageUpload}
          />
        </Col>
        <Col lg={3} md={6} sm={12} xs={12}>
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
      </Row>
    </Container>
  );
};

export default ProtectedRoute(ModifyMovie);
