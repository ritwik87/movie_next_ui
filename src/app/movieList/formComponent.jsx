import React from "react";
import { Controller } from "react-hook-form";
import InputField from "../components/inputField";
import { ErrorMessage } from "@hookform/error-message";
import { useTranslation } from "react-i18next";
import ErrorMessageComponent from "../components/errorMessageComponent";

const FormComponent = ({ formControls }) => {
  const { t } = useTranslation();
  return (
    <>
      <div>
        <Controller
          control={formControls.control}
          name={"title"}
          defaultValue={""}
          rules={{
            required: "This field is required",
          }}
          render={({ field: { onChange, value } }) => (
            <>
              <InputField
                type="text"
                name="title"
                value={value || formControls.getValues("title")}
                onChange={(value) => onChange(value)}
                placeholder={t("Title")}
                className="col-12 col-md-12 col-sm-8"
              />
            </>
          )}
        />
        <ErrorMessage
          errors={formControls?.formState?.errors}
          name={"title"}
          render={({ message }) => <ErrorMessageComponent message={message} />}
        />
      </div>
      <div className="w-100 mb-3">
        <Controller
          control={formControls?.control}
          name={"year"}
          defaultValue={""}
          rules={{
            required: "This field is required",
            validate: {
              isNumber: (value) => !isNaN(value) || "Year must be a number",
              inRange: (value) =>
                (value >= 1900 && value <= new Date().getFullYear()) ||
                `Year must be between 1900 and ${new Date().getFullYear()}`,
            },
          }}
          render={({ field: { onChange, value } }) => (
            <>
              <InputField
                type="number"
                name="year"
                value={value || formControls?.getValues("year")}
                onChange={(value) => onChange(value)}
                placeholder={t("Publishing year")}
                className="col-12 col-md-10 col-sm-8"
              />
            </>
          )}
        />
        <ErrorMessage
          errors={formControls?.formState?.errors}
          name={"year"}
          render={({ message }) => <ErrorMessageComponent message={message} />}
        />
      </div>
    </>
  );
};

export default FormComponent;
