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
  return (
    <button
      type={type}
      disabled={isDisabled || isLoading}
      onClick={onPress}
      className={classNames(
        "btn bg-movies-primary-success py-2",
        btnContainerOverrideStyle
      )}
      {...(isModalBtn && {
        "data-bs-toggle": "modal",
        "data-bs-target": "#exampleModal",
      })}
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

export default ButtonComponent;
