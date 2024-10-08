import PropTypes from "prop-types";
import classNames from "classnames";

const ButtonComponent = ({
  type = "button",
  title,
  isLoading = false,
  isDisabled = false,
  onPress,
  isModalBtn = false,
  btnContainerOverrideStyle = "border-0",
}) => {
  const buttonClasses = classNames(
    "btn app-primary-color-dropdown-button py-2",
    btnContainerOverrideStyle
  );

  const modalAttributes = isModalBtn
    ? { "data-bs-toggle": "modal", "data-bs-target": "#exampleModal" }
    : {};

  return (
    <button
      type={type}
      disabled={isDisabled || isLoading}
      onClick={onPress}
      className={buttonClasses}
      {...modalAttributes}
      aria-label={title} // Improved accessibility with aria-label
    >
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center gap-2">
          <span
            className="spinner-border spinner-border-sm my-1"
            role="status"
            aria-hidden="true"
          ></span>
        </div>
      ) : (
        <span>{title}</span>
      )}
    </button>
  );
};

ButtonComponent.propTypes = {
  type: PropTypes.string,
  title: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
  isModalBtn: PropTypes.bool,
  btnContainerOverrideStyle: PropTypes.string,
};

// Default props for non-required props
ButtonComponent.defaultProps = {
  type: "button",
  isLoading: false,
  isDisabled: false,
  isModalBtn: false,
  btnContainerOverrideStyle: "border-0",
};

export default ButtonComponent;
