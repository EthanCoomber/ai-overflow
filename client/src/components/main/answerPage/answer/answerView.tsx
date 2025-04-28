import "./answerView.css";
import { AnswerProps } from "../../../../types/componentPropTypes";
import { Box, Typography, Paper, Divider } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

/**
 * Renders an individual answer in the answer page
 * 
 * Displays the answer text along with information about who answered
 * and when it was posted.
 * 
 * @param {AnswerProps} props - The component props
 * @param {string} props.text - The content of the answer
 * @param {string} props.ansBy - The username of the person who provided the answer
 * @param {string} props.meta - Metadata about the answer (e.g., timestamp)
 * @returns {JSX.Element} The rendered Answer component
 */
const Answer = ({ text, ansBy, meta }: AnswerProps) => {
  return (
    <Paper elevation={1} id="answerPaper">
      <Box sx={{ display: "flex" }} id="answerContainer">
        <Box sx={{ flex: 3 }} id="answerContentBox">
          <Typography variant="body1" id="answerText">
            {text}
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} id="answerDivider" />
        <Box id="authorSection">
          <Typography variant="subtitle2" id="authorName">
            <PersonIcon fontSize="small" id="personIcon" />
            {ansBy}
          </Typography>
          <Typography variant="body2" id="metaInfo">
            <AccessTimeIcon fontSize="small" id="timeIcon" />
            {meta}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default Answer;
