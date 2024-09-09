import React from "react";
import { Controller } from "react-hook-form";
import InputField from "../components/inputField";
import { ErrorMessage } from "@hookform/error-message";
import { useTranslation } from "react-i18next";
import ErrorMessageComponent from "../components/errorMessageComponent";

const FormComponent = ({ formControls }) => {
  const { t } = useTranslation();
  const {
    control,
    formState: { errors },
    getValues,
  } = formControls;

  // Helper to render input fields with validation errors
  const renderInputField = (name, type, placeholder, validationRules) => (
    <>
      <Controller
        control={control}
        name={name}
        defaultValue=""
        rules={validationRules}
        render={({ field: { onChange, value } }) => (
          <InputField
            type={type}
            name={name}
            value={value || getValues(name)}
            onChange={onChange}
            placeholder={t(placeholder)}
            className="col-12 col-md-10 col-sm-8"
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

  return (
    <>
      <div className="mb-3">
        {renderInputField("title", "text", "Title", {
          required: t("This field is required"),
        })}
      </div>

      <div className="mb-3">
        {renderInputField("year", "number", "Publishing year", {
          required: t("This field is required"),
          validate: {
            isNumber: (value) => !isNaN(value) || t("Year must be a number"),
            inRange: (value) =>
              (value >= 1900 && value <= new Date().getFullYear()) ||
              t(`Year must be between 1900 and ${new Date().getFullYear()}`),
          },
        })}
      </div>
    </>
  );
};

export default FormComponent;
