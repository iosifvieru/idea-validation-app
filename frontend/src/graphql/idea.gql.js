const COMMENT_FIELDS = `
fragment CommentFields on Comment {
  id
  author
  content
  upvotes
  downvotes
  score
  createdAt
}
`;

const IDEA_FIELDS = `
fragment IdeaFields on Idea {
  id
  author
  title
  content
  upvotes
  downvotes
  commentsCount
  createdAt
}
`;

export const GET_IDEAS_QUERY = `
${COMMENT_FIELDS}
${IDEA_FIELDS}
query GetIdeas($page: Int = 1, $pageSize: Int = 10) {
  ideas(page: $page, pageSize: $pageSize) {
    items {
      ...IdeaFields
      comments(page: 1, pageSize: 3) {
        items { ...CommentFields }
      }
    }
    meta {
      totalItems
      hasNextPage
    }
  }
}
`;

export const GET_IDEA_QUERY = `
${COMMENT_FIELDS}
query GetIdea($id: ID!, $page: Int = 1, $pageSize: Int = 10) {
  idea(id: $id) {
    id
    title
    content
    author
    upvotes
    downvotes
    createdAt
    comments(page: $page, pageSize: $pageSize) {
      items { ...CommentFields }
      meta { hasNextPage }
    }
  }
}
`;

export const VOTE_IDEA_MUTATION = `
mutation VoteIdea($id: ID!, $value: Int!) {
  voteIdea(id: $id, value: $value) {
    id
    upvotes
    downvotes
    score
  }
}
`;

export const CREATE_IDEA_MUTATION = `
${COMMENT_FIELDS}
${IDEA_FIELDS}
mutation CreateIdea($title: String!, $content: String!) {
  createIdea(title: $title, content: $content) {
    ...IdeaFields
    comments(page: 1, pageSize: 3) {
      items { ...CommentFields }
    }
  }
}
`;

export const UPDATE_IDEA_MUTATION = `
mutation UpdateIdea($id: ID!, $title: String!, $content: String!) {
  updateIdea(id: $id, title: $title, content: $content) {
    id
    title
    content
    upvotes
    downvotes
    commentsCount
  }
}
`;

export const DELETE_IDEA_MUTATION = `
mutation DeleteIdea($id: ID!) {
  deleteIdea(id: $id)
}
`;

export const CREATE_COMMENT_MUTATION = `
${COMMENT_FIELDS}
mutation AddComment($ideaId: ID!, $content: String!) {
  addComment(ideaId: $ideaId, content: $content) {
    ...CommentFields
  }
}
`;
