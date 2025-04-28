import React from "react";
import { useParams } from "react-router-dom";
import "./newAnswerPage.css";
import { useNewAnswer } from "../../hooks/useNewAnswer";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";

/**
 * The NewAnswerPage component renders a page for creating a new answer to a question.
 * It extracts the question ID from the URL parameters and provides a form for users
 * to input answer details and submit them.
 * When an answer is successfully submitted, it navigates back to the question page.
 * 
 * @returns The NewAnswerPage component
 */
const NewAnswerPage: React.FC = () => {
  const { qid } = useParams<{ qid: string }>();


  const { usrn, setUsrn, text, setText, usrnErr, textErr, postAnswer } =
    useNewAnswer(qid || "");

  if (!qid) {
    return (
      <Typography color="error" variant="h6" sx={{ padding: 4 }} id="error-message">
        Error: No question ID provided
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: 4 }} id="new-answer-container">
      <Typography variant="h4" gutterBottom id="new-answer-heading">
        New Answer
      </Typography>
      <Paper elevation={3} sx={{ padding: 4, backgroundColor: "#f9f9f9" }} id="new-answer-form-paper">
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
          id="new-answer-form"
        >
          <TextField
            required
            fullWidth
            label="Username"
            value={usrn}
            onChange={(e) => setUsrn(e.target.value)}
            error={!!usrnErr}
            helperText={usrnErr}
            id="answer-username-input"
          />
          <TextField
            required
            fullWidth
            label="Answer Text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            error={!!textErr}
            helperText={textErr}
            id="answer-text-input"
          />
          <Button
            variant="contained"
            onClick={postAnswer}
            sx={{ alignSelf: "flex-start", textTransform: "none" }}
            id="post-answer-button"
          >
            Post Answer
          </Button>
          <Typography variant="caption" color="text.secondary" id="required-fields-note">
            * indicates mandatory fields
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default NewAnswerPage;