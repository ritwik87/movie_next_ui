import React from "react";
import { useTranslation } from "react-i18next";

const pageHeadingComponent = ({ title, Element }) => {
  const { t } = useTranslation();
  return (
    <h4 className="py-4 d-flex align-items-center gap-2 pe-auto">
      {t(title)}
      {Element}
    </h4>
  );
};

export default pageHeadingComponent;
