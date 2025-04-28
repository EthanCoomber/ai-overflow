import React from "react";
import FormField from "../formfield/FormField";
import "../input/inputView.css"; // reusing input styles
import { TextareaProps } from "../../../../types/componentPropTypes";

/**
 * Renders a standardized textarea field with label and validation
 * 
 * Uses the FormField component to maintain consistent styling and structure
 * for textarea elements with appropriate labeling and validation feedback.
 * 
 * @param {TextareaProps} props - The component props
 * @param {string} props.title - The label text for the textarea field
 * @param {boolean} props.mandatory - Whether the field is required (defaults to true)
 * @param {string} props.hint - Optional hint text to display below the title
 * @param {string} props.id - The HTML id attribute for the textarea element
 * @param {string} props.val - The current value of the textarea field
 * @param {StringFunctionType} props.setState - Callback function to update the textarea value
 * @param {string} props.err - Optional error message to display
 * @returns {JSX.Element} The rendered Textarea component
 */
const Textarea = ({ title, mandatory = true, hint, id, val, setState, err }: TextareaProps) => {
  return (
    <FormField title={title} hint={hint} mandatory={mandatory} error={err}>
      <textarea
        id={id}
        className="input_input"
        value={val}
        onChange={(e) => setState(e.currentTarget.value)}
      />
    </FormField>
  );
};

export default Textarea;
