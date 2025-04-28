import React from "react";
import "./PageHeader.css";
import { PageHeaderProps } from "../../../../types/componentPropTypes";

/**
 * Renders a standardized page header with title and optional elements
 * 
 * This component creates a consistent header layout across pages, with support for:
 * - A title with optional count prefix (e.g., "5 Questions")
 * - Primary action buttons below the title
 * - Optional secondary actions in a separate row
 * 
 * @param {PageHeaderProps} props - The component props
 * @param {string} props.title - The title text to display in the header
 * @param {number} props.count - Optional count to display with the title
 * @param {React.ReactNode} props.actions - Optional primary actions to display below the title
 * @param {React.ReactNode} props.secondaryActions - Optional secondary actions to display in a separate row
 * @returns {JSX.Element} The rendered PageHeader component
 */
const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  count,
  actions,
  secondaryActions,
}) => {
  return (
    <div className="pageHeader">
      <div className="right_padding">
        <div className="bold_title">
          {title}
        </div>
        {actions && (
          <div className="actions_container">
            {actions}
          </div>
        )}
      </div>
      {secondaryActions && (
        <div className="space_between right_padding" style={{ justifyContent: 'flex-end' }}>
          {secondaryActions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
