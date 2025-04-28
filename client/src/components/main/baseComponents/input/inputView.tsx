import React from "react";
import FormField from "../formfield/FormField";
import "./inputView.css";
import { InputProps } from "../../../../types/componentPropTypes";


/**
 * Renders a standardized text input field with label and validation
 * 
 * Uses the FormField component to maintain consistent styling and structure
 * for input elements with appropriate labeling and validation feedback.
 * 
 * @param {InputProps} props - The component props
 * @param {string} props.title - The label text for the input field
 * @param {string} props.hint - Optional hint text to display below the title
 * @param {string} props.id - The HTML id attribute for the input element
 * @param {boolean} props.mandatory - Whether the field is required (defaults to true)
 * @param {string} props.val - The current value of the input field
 * @param {StringFunctionType} props.setState - Callback function to update the input value
 * @param {string} props.err - Optional error message to display
 * @returns {JSX.Element} The rendered Input component
 */
const Input = ({ title, hint, id, mandatory = true, val, setState, err }: InputProps) => {
  return (
    <FormField title={title} hint={hint} mandatory={mandatory} error={err}>
      <input
        id={id}
        className="input_input"
        type="text"
        value={val}
        onInput={(e) => setState(e.currentTarget.value)}
      />
    </FormField>
  );
};

export default Input;
