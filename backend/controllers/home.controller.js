import { User } from "../models/user.model.js";
import { BlogPost } from "../models/blog.model.js";

export const getTopContributors = async (req, res) => {
    try {
      const topContributors = await BlogPost.aggregate([
        {
          $group: {
            _id: '$author', // Group by author (author is assumed to be a user ID)
            totalUpvotes: { $sum: '$upvotes' }, // Sum upvotes for each author
          },
        },
        {
          $sort: { totalUpvotes: -1 }, // Sort by total upvotes in descending order
        },
        {
          $limit: 5, // Limit to top 5 contributors
        },
        {
          $lookup: {
            from: 'users', // The name of the collection where user details are stored
            localField: '_id', // The field from the BlogPost collection (author ID)
            foreignField: '_id', // The field from the User collection (user ID)
            as: 'userDetails', // Alias to store the resulting user details
          },
        },
        {
          $unwind: '$userDetails', // Unwind the array to get the user details
        },
        {
          $project: {
            _id: 1, // Include the author ID
            totalUpvotes: 1, // Include total upvotes
            authorName: '$userDetails.username', // Include the username as authorName
          },
        },
      ]);
  
      res.status(200).json(topContributors); // Send the result as a response
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving top contributors' });
    }
  };