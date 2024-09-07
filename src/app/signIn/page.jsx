"use client";
import { useLoginMutation } from "../../services/authApi";
import { enqueueSnackbar } from "notistack";
import { ErrorMessage } from "@hookform/error-message";
import React from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import ButtonComponent from "../components/button";
import InputField from "../components/inputField";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import ErrorMessageComponent from "../components/errorMessageComponent";

const SignIn = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [login, { isLoading: isUpdating }] = useLoginMutation();
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const onSubmit = async (data) => {
    const email = data.email;
    const password = data.password;

    if (email && password) {
      try {
        const payload = {
          username: email,
          password,
        };

        const res = await login({ payload: payload }).unwrap();

        if (res) {
          if (typeof window !== "undefined") {
            window.localStorage.setItem("access-token", res.access_token);
          }
          enqueueSnackbar(t("Loggedin Successfully"), { variant: "success" });
          router.push("/movieList");
        }
      } catch (error) {
        enqueueSnackbar(t("Invalid Email Or Password"), { variant: "error" });
      }
    }
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <>
      <div className="text-center">
        <h2>{t("Sign In")}</h2>
      </div>
      <Container className="w-100">
        <Row className="d-flex flex-column justify-content-center align-items-center">
          <Col lg={3} md={6} sm={12} xs={12}>
            <Controller
              control={control}
              name={"email"}
              defaultValue={""}
              rules={{
                required: "This field is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Entered value does not match email format",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <>
                  <InputField
                    type="email"
                    name="email"
                    value={value || getValues("email")}
                    onChange={(value) => onChange(value)}
                    placeholder={t("Email")}
                    className="form-control w-100"
                  />
                </>
              )}
            />
            <ErrorMessage
              errors={errors}
              name={"email"}
              render={({ message }) => (
                <ErrorMessageComponent message={message} />
              )}
            />
          </Col>
          <Col lg={3} md={6} sm={12} xs={12}>
            <Controller
              control={control}
              name={"password"}
              defaultValue={""}
              rules={{
                required: "This field is required",
                minLength: {
                  value: 8,
                  message: "Minimum 8 characters required",
                },
                pattern: {
                  value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,15}/,
                  message:
                    "Password must contain at least 1 uppercase letter, 1 lowercase letter and 1 number",
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <>
                  <InputField
                    type="password"
                    name="password"
                    value={value || getValues("password")}
                    onChange={(value) => onChange(value)}
                    placeholder={t("Password")}
                    className="form-control w-100"
                    onKeyDown={handleEnterKeyPress}
                  />
                </>
              )}
            />

            {errors?.password && (
              <ErrorMessageComponent message={errors?.password?.message} />
            )}
          </Col>

          <div className="d-flex gap-2 justify-content-center align-items-center">
            <InputField
              type="checkbox"
              name="remeberMe"
              // checked
            />
            {t("Remember Me")}
          </div>
          <Col lg={3} md={6} sm={12} xs={12}>
            <ButtonComponent
              title={t("Login")}
              onPress={handleSubmit(onSubmit)}
              btnContainerOverrideStyle="w-100"
              isLoading={isUpdating}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SignIn;
