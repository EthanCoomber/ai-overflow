/**
 * @fileoverview Service module for handling tag-related operations
 * @module services/tagService
 */

import Tag from "../models/tags";
import Question from "../models/questions";
import { ITag } from "../types/types";

/**
 * Fetches all tags with their respective question counts
 * @async
 * @function getTagsWithQuestionCount
 * @returns {Promise<Array<{_id: string, name: string, qcnt: number}>>} Array of tag objects containing:
 *   - _id: The tag's unique identifier
 *   - name: The tag's name
 *   - qcnt: Number of questions using this tag
 * @description 
 * 1. Retrieves all tags from the database
 * 2. For each tag, counts how many questions use it
 * 3. Returns array of tags with their counts, filtering out any null values
 */
export const getTagsWithQuestionCount = async () => {
  const tags = await Tag.findAllTags();
  const tagCounts = await Promise.all(
    tags.map(async (tag: ITag) => {
      if (tag._id) {
        const questions = await Question.findQuestionsWithTag(tag._id);
        return {
          _id: tag._id.toString(),
          name: tag.name,
          qcnt: questions.length,
        };
      }
      return null;
    })
  );
  return tagCounts.filter(Boolean);
};
