import { Card, CardContent, Typography } from "@mui/material";
import "./tagView.css";
import { TagProps } from "../../../../types/componentPropTypes";
/**
 * Renders a single tag card with name and question count
 * 
 * This component displays a tag as a clickable card that shows the tag name
 * and the number of questions associated with it. When clicked, it will
 * filter questions to show only those with the selected tag.
 * 
 * @param {TagProps} props - The component props
 * @param {Object} props.t - The tag object containing tag data
 * @param {string} props.t.name - The name of the tag
 * @param {number} props.t.qcnt - The number of questions associated with this tag
 * @param {ClickTagFunctionType} props.clickTag - Callback function to handle tag clicks
 * @returns {JSX.Element} The rendered Tag component
 */
const Tag = ({ t, clickTag }: TagProps) => {
  return (
    <Card 
      className="tag-card"
      id={`tag-card-${t.name}`}
      onClick={() => {
        clickTag(t.name);
      }}
    >
      <CardContent className="tag-content" id={`tag-content-${t.name}`}>
        <Typography variant="h6" component="div" className="tag-name" id={`tag-name-${t.name}`}>
          {t.name}
        </Typography>
        <Typography variant="body2" className="tag-count" id={`tag-count-${t.name}`}>
          {t.qcnt} questions
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Tag;
