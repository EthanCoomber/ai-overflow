import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./tagPageView.css";
import Tag from "../../components/main/tagPage/tag/tagView";
import { useTagPage } from "../../hooks/useTagPage";
import { ClickTagFunctionType } from "../../types/functionTypes";
import PageHeader from "../../components/main/baseComponents/pageheader/PageHeader";
import { Container, Grid, Box } from "@mui/material";
import { AppContext } from "../../context/AppContext";

const TagPage = () => {
  const { tlist } = useTagPage();
  const navigate = useNavigate();
  const { dispatch } = useContext(AppContext);

  const clickTag: ClickTagFunctionType = (tagName) => {
    console.log("clicked tag", tagName);
    const searchQuery = `[${tagName}]`;
    dispatch({ type: "SET_SEARCH", payload: searchQuery });
    navigate(`/`);
  };

  return (
    <Container maxWidth="lg" id="tag-page-container">
      <PageHeader
        title="Tags"
        count={tlist.length}
      />
      <Box className="right_padding" sx={{ mt: 3 }} id="tags-container">
        <Grid container spacing={3} className="tag_list" id="tag-grid">
          {tlist.map((t, idx) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={idx} id={`tag-grid-item-${idx}`}>
              <Tag t={t} clickTag={clickTag} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default TagPage;
