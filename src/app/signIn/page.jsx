"use client";
import React from "react";
import { useLoginMutation } from "../../services/authApi";
import { enqueueSnackbar } from "notistack";
import { ErrorMessage } from "@hookform/error-message";
import { Col, Container, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import ErrorMessageComponent from "../components/errorMessageComponent";
import ButtonComponent from "../components/button";
import InputField from "../components/inputField";

// Reusable form validation rules
const emailValidation = {
  required: "This field is required",
  pattern: {
    value: /\S+@\S+\.\S+/,
    message: "Entered value does not match email format",
  },
};

const passwordValidation = {
  required: "This field is required",
  minLength: {
    value: 8,
    message: "Minimum 8 characters required",
  },
  pattern: {
    value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,15}/,
    message:
      "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number",
  },
};

const FormField = ({
  control,
  name,
  rules,
  type,
  placeholder,
  onKeyDown,
  errors,
}) => (
  <>
    <Controller
      control={control}
      name={name}
      defaultValue=""
      rules={rules}
      render={({ field: { onChange, value } }) => (
        <InputField
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="form-control w-100"
          onKeyDown={onKeyDown}
        />
      )}
    />
    <ErrorMessage
      errors={errors}
      name={name}
      render={({ message }) => <ErrorMessageComponent message={message} />}
    />
  </>
);

const SignIn = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [login, { isLoading }] = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const onSubmit = async ({ email, password }) => {
    try {
      const payload = { username: email, password };
      const res = await login({ payload }).unwrap();

      if (res) {
        if (typeof window !== "undefined") {
          localStorage.setItem("access-token", res.access_token);
        }
        enqueueSnackbar(t("Loggedin Successfully"), { variant: "success" });
        router.push("/movieList");
      }
    } catch (error) {
      enqueueSnackbar(t("Invalid Email Or Password"), { variant: "error" });
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
            <FormField
              control={control}
              name="email"
              rules={emailValidation}
              type="email"
              placeholder={t("Email")}
              errors={errors}
            />
          </Col>

          <Col lg={3} md={6} sm={12} xs={12}>
            <FormField
              control={control}
              name="password"
              rules={passwordValidation}
              type="password"
              placeholder={t("Password")}
              onKeyDown={handleEnterKeyPress}
              errors={errors}
            />
          </Col>

          <div className="d-flex gap-2 justify-content-center align-items-center">
            <InputField type="checkbox" name="rememberMe" />
            {t("Remember Me")}
          </div>

          <Col lg={3} md={6} sm={12} xs={12}>
            <ButtonComponent
              title={t("Login")}
              onPress={handleSubmit(onSubmit)}
              btnContainerOverrideStyle="w-100"
              isLoading={isLoading}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SignIn;
