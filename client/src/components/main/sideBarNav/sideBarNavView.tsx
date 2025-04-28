import "./sideBarNavView.css";
import { List, ListItem, ListItemButton, ListItemText, Paper, Box } from "@mui/material";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import useSideBar from "../../../hooks/useSideBar";

/**
 * Renders the sidebar navigation component with question and tag navigation options
 * 
 * This component provides navigation between the main question list and tags pages.
 * It highlights the currently active section and resets search and ordering state
 * when navigating between sections.
 * 
 * @returns {JSX.Element} The rendered SideBarNav component
 */
const SideBarNav = () => {
  const { isQuestionsSelected, isTagsSelected, handleQuestions, handleTags } = useSideBar();
  return (
    <Box 
      component="nav" 
      id="sideBarNav" 
      sx={{ 
        mt: 2, 
        width: '200px', 
        flexShrink: 0 
      }}
    >
      <Paper id="sideBarNavPaper" elevation={0} sx={{ borderRadius: 2, width: '100%' }}>
        <List id="sideBarNavList" disablePadding>
          <ListItem id="questionsListItem" disablePadding>
            <ListItemButton
              id="menu_question"
              selected={isQuestionsSelected}
              onClick={handleQuestions}
              sx={{
                borderRadius: 1,
                mb: 1,
                '&.Mui-selected': {
                  backgroundColor: '#e3f2fd',
                  color: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#d0e8fc',
                  }
                }
              }}
            >
              <QuestionAnswerIcon id="questionsIcon" sx={{ mr: 1.5, fontSize: '1.2rem' }} />
              <ListItemText id="questionsText" primary="Questions" />
            </ListItemButton>
          </ListItem>
          <ListItem id="tagsListItem" disablePadding>
            <ListItemButton
              id="menu_tag"
              selected={isTagsSelected}
              onClick={handleTags}
              sx={{
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: '#e3f2fd',
                  color: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#d0e8fc',
                  }
                }
              }}
            >
              <LocalOfferIcon id="tagsIcon" sx={{ mr: 1.5, fontSize: '1.2rem' }} />
              <ListItemText id="tagsText" primary="Tags" />
            </ListItemButton>
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default SideBarNav;
