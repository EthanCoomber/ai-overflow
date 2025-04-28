import React from "react";
import { FormFieldProps } from "../../../../types/componentPropTypes";

/**
 * Renders a standardized form field with title, optional hint, and error messages
 * 
 * Provides consistent styling and structure for form inputs with appropriate
 * labeling and validation feedback.
 * 
 * @param {FormFieldProps} props - The component props
 * @param {string} props.title - The label text for the form field
 * @param {boolean} props.mandatory - Whether the field is required (defaults to true)
 * @param {string} props.hint - Optional hint text to display below the title
 * @param {string} props.error - Optional error message to display
 * @param {React.ReactNode} props.children - The form input element(s) to render
 * @returns {JSX.Element} The rendered FormField component
 */
const FormField: React.FC<FormFieldProps> = ({
  title,
  mandatory = true,
  hint,
  error,
  children,
}) => {
  return (
    <div className="formField">
      <div className="input_title">
        {title}
        {mandatory && "*"}
      </div>
      {hint && <div className="input_hint">{hint}</div>}
      {children}
      {error && <div className="input_error">{error}</div>}
    </div>
  );
};

export default FormField;
