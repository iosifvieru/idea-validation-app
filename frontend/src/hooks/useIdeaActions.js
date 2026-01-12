import { graphqlFetch } from "../utils/graphqlFetch";
import {
  CREATE_COMMENT_MUTATION,
  GET_IDEAS_QUERY,
  CREATE_IDEA_MUTATION,
  DELETE_IDEA_MUTATION,
  UPDATE_IDEA_MUTATION,
  VOTE_IDEA_MUTATION,
  GET_IDEA_QUERY,
} from "../graphql/idea.gql";

export function useIdeaActions(token) {
  const voteIdea = (id, value) =>
    graphqlFetch(VOTE_IDEA_MUTATION, { id, value }, token);

  const createIdea = (title, content) =>
    graphqlFetch(CREATE_IDEA_MUTATION, { title, content }, token);

  const updateIdea = (id, title, content) =>
    graphqlFetch(UPDATE_IDEA_MUTATION, { id, title, content }, token);

  const deleteIdea = (id) =>
    graphqlFetch(DELETE_IDEA_MUTATION, { id }, token);

  const addComment = (ideaId, content) =>
    graphqlFetch(CREATE_COMMENT_MUTATION, { ideaId, content }, token);

  const getIdeas = (page) => 
    graphqlFetch(GET_IDEAS_QUERY, { page, pageSize: 10 });

  const getIdea = (id, page) => 
    graphqlFetch(GET_IDEA_QUERY, { id, page, pageSize: 10 }, token);

  return { voteIdea, createIdea, updateIdea, deleteIdea, addComment, getIdeas, getIdea };
}
