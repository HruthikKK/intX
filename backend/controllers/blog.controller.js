import { BlogPost } from "../models/blog.model.js"; // Adjust the path to match your project structure
import { User } from "../models/user.model.js"
// Create a new blog post
export const createBlogPost = async (req, res) => {
    try {        
        const { title, description, author, company } = req.body;
        console.log(req.body)
        
        if (!title || !description || !author || !company) {
       
            return res.status(400).json({ message: "All fields are required." });
        }

        const newBlogPost = new BlogPost({
            title,
            description,
            company,
            author
        });

        console.log(newBlogPost);
        
        const savedBlogPost = await newBlogPost.save();
        
        console.log(savedBlogPost.message);
        
        res.status(201).json({ message: "Blog post created successfully.", blogPost: savedBlogPost });
    } catch (error) {
        res.status(500).json({ message: "Error creating blog post.", error: error.message });
    }
};

// Update an existing blog post
export const updateBlogPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, company,author } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Blog ID is required." });
        }

        const blogPost = await BlogPost.findById(id);

        if (!blogPost) {
            return res.status(404).json({ message: "Blog post not found." });
        }

        if (blogPost.author.toString() !== author) {
            return res.status(403).json({ message: "You are not authorized to update this blog post." });
        }

        const updatedBlogPost = await BlogPost.findByIdAndUpdate(
            id,
            { title, description, company },
            { new: true, runValidators: true }
        );

        res.status(200).json({ message: "Blog post updated successfully.", blogPost: updatedBlogPost });
    } catch (error) {
        res.status(500).json({ message: "Error updating blog post.", error: error.message });
    }
};

// Delete a blog post
export const deleteBlogPost = async (req, res) => {
    try {
        const { id } = req.params;
        const {author} = req.body; // Assuming current user info is available in req.user

        if (!id) {
            return res.status(400).json({ message: "Blog ID is required." });
        }

        const blogPost = await BlogPost.findById(id);

        if (!blogPost) {
            return res.status(404).json({ message: "Blog post not found." });
        }

        if (blogPost.author.toString() !== author) {
            console.log(blogPost.author.toString());
            console.log(author);
            return res.status(403).json({ message: "You are not authorized to delete this blog post." });
        }

        const deletedBlogPost = await BlogPost.findByIdAndDelete(id);

        res.status(200).json({ message: "Blog post deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error deleting blog post.", error: error.message });
    }
};

export const getBlogPost = async (req, res) => {
    try {

        const { id } = req.params;

        // Find the blog post by ID
        const blog = await BlogPost.findById(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found.' });
        }

        // Find the author by ID
        const author = await User.findById(blog.author);
        
        const authorDetails = author 
            ? { username: author.username, email: author.email } 
            : { username: 'Deleted User', email: 'N/A' };

        // Construct the response
        const response = {
            _id: blog._id,
            title: blog.title,
            description: blog.description,
            author: authorDetails,
            upvotes: blog.upvotes,
            downvotes: blog.vote.length - blog.upvotes,
        };

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export const getBlogsByAuthor = async (req, res) => {
    try {
      const { author } = req.query;
      const blogs = await BlogPost.find({ author });
      res.status(200).json({ blogs });
    } catch (error) {
      res.status(500).json({ message: "Error fetching blogs.", error: error.message });
    }
} 


export const voteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, author } = req.body;

        if (!author) {
            return res.status(401).json({ message: "Please log in to vote." });
        }

        const blog = await BlogPost.findById(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog post not found." });
        }

        const existingVote = blog.vote.find(v => v.user.toString() === author);
        if (existingVote) {
            return res.status(400).json({ message: "You have already voted this post." });
        }

        if (type === 'up') {
            blog.upvotes += 1;
            blog.vote.push({ user: author, type: 'up' }); // Add new upvote
        } else if (type === 'down') {    
            blog.vote.push({ user: author, type: 'down' }); // Add new downvote
        }
        else {
            return res.status(400).json({ message: "Invalid vote type." });
        }

        await blog.save();

        res.status(200).json({ message: "Vote updated successfully.", upvotes: blog.upvotes, downvotes : blog.vote.length - blog.upvotes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
