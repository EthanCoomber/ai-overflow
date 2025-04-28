import { Box, Typography, TextField, Button } from "@mui/material";
import AddCommentIcon from "@mui/icons-material/AddComment";
import { getMetaData } from "../../../../utils";
import { CommentsProps } from "../../../../types/componentPropTypes";
/**
 * Renders the comments section for the answer page
 * 
 * This component displays existing comments and provides a form for adding new comments.
 * 
 * @param {Object} props - The component props
 * @param {Array} props.comments - The list of comments to display
 * @param {string} props.commentText - The current text in the comment input
 * @param {Function} props.setCommentText - Function to update the comment text
 * @param {Function} props.handleCommentSubmit - Function to handle comment submission
 * @returns {JSX.Element} The rendered Comments component
 */
const Comments = ({ 
  comments = [], 
  commentText, 
  setCommentText, 
  handleCommentSubmit 
}: CommentsProps) => {
  return (
    <Box sx={{ mt: 4 }} id="comments-section">
      <Typography variant="h6" gutterBottom id="comments-heading">
        Comments
      </Typography>

      <Box sx={{ mb: 2 }} id="comments-list">
        {comments?.map((c, idx) => (
          <Box
            key={idx}
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              p: 2,
              mb: 1,
              backgroundColor: "#f9f9f9",
            }}
            id={`comment-${idx}`}
            className="comment-item"
          >
            <Typography variant="body2" id={`comment-text-${idx}`}>{c.text}</Typography>
            <Typography variant="caption" color="text.secondary" id={`comment-meta-${idx}`}>
              — {c.comment_by || "Anonymous"},{" "}
              {getMetaData(new Date(c.comment_time))}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleCommentSubmit();
        }}
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
        id="comment-form"
      >
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          sx={{ backgroundColor: "white" }}
          id="comment-input"
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }} id="comment-submit-container">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            startIcon={<AddCommentIcon />}
            className="answer-button"
            id="add-comment-button"
          >
            Add Comment
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Comments;
