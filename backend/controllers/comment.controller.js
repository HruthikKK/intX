import { Comment } from "../models/comment.model.js";
import { BlogPost } from "../models/blog.model.js";
import { User } from "../models/user.model.js";

export const createComment = async (req, res) => {
    try {
        const { blogPostId, content, parentCommentId, userId } = req.body;
        
        // Validate input
        if (!content || !blogPostId || !userId) {
            return res.status(400).json({ message: "BlogPost ID, content, and user ID are required." });
        }

        // Check if the blog post exists
        const blogPost = await BlogPost.findById(blogPostId);
        if (!blogPost) {
            return res.status(404).json({ message: "Blog post not found." });
        }

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // If it's a reply, ensure the parent comment exists and belongs to the same blog post
        let parentComment = null;
        if (parentCommentId) {
            parentComment = await Comment.findById(parentCommentId);
            if (!parentComment || String(parentComment.blogPost) !== blogPostId) {
                return res.status(400).json({ message: "Invalid parent comment." });
            }
        }

        // Create the comment
        const newComment = new Comment({
            blogPost: blogPostId,
            author: userId,
            content,
            parentComment: parentCommentId || null,
        });        

        // Save the comment
        const savedComment = await newComment.save();

        // Fetch the author's username using the author ObjectId from savedComment
        const authorName = await User.findById(savedComment.author);

        // Add the authorName to the savedComment object
        const updatedComment = savedComment.toObject();
        updatedComment.authorName = authorName?.username || "Deleted User"

        // Respond with the created comment including authorName
        return res.status(201).json({
            message: "Comment created successfully.",
            comment: updatedComment,
        });
            } catch (error) {
                console.error("Error creating comment:", error);
                return res.status(500).json({ message: error.message });
            }
};

export const getChildComments = async (req, res) => {
    const { parentCommentId } = req.query;
  
    // Validate input
    if (!parentCommentId) {
      return res.status(400).json({ error: 'parentCommentId is required' });
    }
  
    try {
      // Fetch child comments from the database
      const childComments = await Comment.find({ parentComment: parentCommentId }).sort({ createdAt: 1 }); // Sorting by creation date (oldest first)
    
      const commentsWithAuthorName = await Promise.all(childComments.map(async (comment) => {
        // Fetch the author details for each comment
        const author = await User.findById(comment.author).select('username'); // Select the username (or name)
        return {
            ...comment.toObject(),
            authorName: author ? author.username : 'Deleted account' // Add the author name
        };
    }));

      // Respond with the fetched child comments
      res.status(200).json(commentsWithAuthorName);
    } catch (error) {
      console.error('Error fetching child comments:', error);
  
      // Respond with an error
      res.status(500).json({ error: 'Failed to fetch child comments' });
    }
  };

  


