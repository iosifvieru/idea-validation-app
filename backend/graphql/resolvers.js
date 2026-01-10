const Idea = require('../models/Idea');
const Comment = require('../models/Comment');
const Vote = require('../models/Vote');
const { AuthenticationError, ForbiddenError, UserInputError, ApolloError } = require('apollo-server-express');

const MAX_PAGE_SIZE = 20;

function validatePageSize(pageSize) {
  if (pageSize > MAX_PAGE_SIZE) {
    throw new UserInputError(`Page Size cannot be greater than ${MAX_PAGE_SIZE}`, { invalidArgs: ["pageSize"] } );
  }
}

function calculateScore(obj) {
  return (obj.upvotes || 0) - (obj.downvotes || 0);
}

function checkAuth(user) {
  if (!user) throw new AuthenticationError("Unauthorized");
}

const resolvers = {
  Idea: {
    score: (idea) => calculateScore(idea),

    comments: async (idea) => {

      const total = await Comment.countDocuments({ ideaId: idea.id });
      const items = await Comment.find({ ideaId: idea.id })
        .sort({ createdAt: -1 })

      return {
        items,
        meta: { totalItems: total, hasNextPage: false }
      };
    }
  },

  Comment: {
    score: (comment) => calculateScore(comment)
  },

  Query: {
    ideas: async (_, { page = 1, pageSize = 10}) => {
      validatePageSize(pageSize);

      const total = await Idea.countDocuments();
      const items = await Idea.find()
        .skip((page - 1) * pageSize)
        .limit(pageSize);

      return {
        items,
        meta: { totalItems: total, hasNextPage: page * pageSize < total }
      };
    },

    idea: async (_, { id }) => {
      const idea = await Idea.findById(id);
      if (!idea) throw new ApolloError("Idea not found!", "NOT_FOUND");
      return idea;
    },
  },

  Mutation: {
    createIdea: async (_, { title, content }, { user }) => {
        console.log(user);
      checkAuth(user);

      
      if (!title) throw new UserInputError(`Title required`, { invalidArgs: ["title"] } );
      if (!content || content.length < 10) throw new UserInputError(`Content too short`, { invalidArgs: ["content"] } );

      const idea = await Idea.create({ author: user.email, title, content });
      return idea;
    },

    addComment: async (_, { ideaId, content }, { user }) => {
      checkAuth(user);

      if (!content || content.trim() === "")
        throw new UserInputError(`Comment text required`, { invalidArgs: ["content"] } );

      const idea = await Idea.findById(ideaId);
      if (!idea) throw new ApolloError("Idea not found!", "NOT_FOUND");

      const comment = await Comment.create({ ideaId, author: user.username, content });
      await Idea.findByIdAndUpdate(ideaId, { $inc: { commentsCount: 1 } });

      return comment;
    },

    voteIdea: async (_, { id, value }, { user }) => {
      checkAuth(user);
      if (![1, -1].includes(value)) throw new UserInputError(`Invalid vote value`, { invalidArgs: ["value"] } );
      

      const idea = await Idea.findById(id);
      if (!idea) throw new ApolloError("Idea not found!", "NOT_FOUND");

      const prevVote = await Vote.findOne({ user: user.username, targetId: id, targetType: "IDEA" });

      if (prevVote) {
        if (prevVote.value !== value) {
          if (prevVote.value === 1) idea.upvotes--;
          else idea.downvotes--;

          prevVote.value = value;
          await prevVote.save();
        } else return idea;
      } else {
        await Vote.create({ user: user.username, targetId: id, targetType: "IDEA", value });
      }

      if (value === 1) idea.upvotes++;
      else idea.downvotes++;

      await idea.save();
      return idea;
    },

    removeVote: async (_, { targetId, targetType }, { user }) => {
      checkAuth(user);

      const vote = await Vote.findOne({ user: user.username, targetId, targetType });
      if (!vote) return false;

      if (targetType === "IDEA") {
        const idea = await Idea.findById(targetId);
        if (!idea) throw new ApolloError("Idea not found!", "NOT_FOUND");
        if (vote.value === 1) idea.upvotes--;
        else idea.downvotes--;
        await idea.save();
      }

      await vote.remove();
      return true;
    }
  }
};

module.exports = resolvers;
