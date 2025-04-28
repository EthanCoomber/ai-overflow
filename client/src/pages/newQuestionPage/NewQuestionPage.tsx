import React from "react";
import "./newQuestionPage.css";
import { useNewQuestion } from "../../hooks/useNewQuestion";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack
} from "@mui/material";

/**
 * The NewQuestionPage component renders a page for creating a new question.
 * It provides a form for users to input question details and submit them.
 * When a question is successfully submitted, it navigates back to the questions list.
 * 
 * @returns The NewQuestionPage component
 */
const NewQuestionPage: React.FC = () => {

  const {
    title,
    setTitle,
    text,
    setText,
    tag,
    setTag,
    usrn,
    setUsrn,
    titleErr,
    textErr,
    tagErr,
    usrnErr,
    postQuestion,
  } = useNewQuestion();

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", mt: 5 }} id="new-question-container">
      <Typography variant="h4" gutterBottom id="new-question-heading">
        New Question
      </Typography>

      <Paper elevation={3} sx={{ p: 4 }} id="new-question-form-paper">
        <Stack spacing={3} id="new-question-form-stack">
          <TextField
            id="question-title-input"
            label="Question Title"
            helperText={titleErr}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!titleErr}
            fullWidth
            required
          />

          <TextField
            id="question-text-input"
            label="Question Text"
            helperText={textErr}
            value={text}
            onChange={(e) => setText(e.target.value)}
            error={!!textErr}
            fullWidth
            required
          />

          <TextField
            id="question-tags-input"
            label="Tags"
            helperText={tagErr}
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            error={!!tagErr}
            fullWidth
            required
          />

          <TextField
            id="question-username-input"
            label="Username"
            helperText={usrnErr}
            value={usrn}
            onChange={(e) => setUsrn(e.target.value)}
            error={!!usrnErr}
            fullWidth
            required
          />

          <Box display="flex" flexDirection="column" gap={2} id="form-actions-container">
            <Button
              id="post-question-button"
              variant="contained"
              color="primary"
              onClick={postQuestion}
              sx={{ alignSelf: "flex-start" }}
            >
              Post Question
            </Button>
            <Typography variant="body2" color="text.secondary" id="required-fields-note">
              * indicates mandatory fields
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default NewQuestionPage;
