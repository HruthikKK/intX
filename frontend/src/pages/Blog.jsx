import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { FiMessageCircle } from 'react-icons/fi';
import { apiClient } from "./Api.jsx";
import { apiFetch } from "./Api.jsx";

function Blog() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const author = currentUser?.user?._id;

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [commentError, setCommentError] = useState(null);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [parentCommentId, setParentCommentId] = useState(null);

  useEffect(() => {
    if (!id) {
      setError('No blog found');
      return;
    }

    const fetchBlog = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`/api/blog/${id}`);
        if (response.data) {
          console.log(response.data);
          
          setBlog(response.data);
          setUpvotes(response.data.upvotes || 0);
          setDownvotes(response.data.downvotes || 0);
          setComments(response.data.comments || []);
          setError(null);
        } else {
          setError('Blog not found');
        }
      } catch (err) {
        setError('Failed to fetch the blog. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleVote = async (type) => {
    if (!currentUser) {
      alert("Please log in to vote!");
    } else {
      try {
        const response = await apiClient.post(`/api/blog/vote/${id}`, { type, author });
        setUpvotes(response.data.upvotes);
        setDownvotes(response.data.downvotes);
      } catch (err) {
        // Check if the error contains a response from the backend
        if (err.response && err.response.data && err.response.data.message) {
          alert(err.response.data.message); // Show the error message sent from the backend
        } else {
          alert("An unexpected error occurred."); // Fallback for unexpected errors
        }
      }
    }
  };
  

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const response = await apiClient.post(`/api/comment/create`, {
          blogPostId : id,
          content: newComment.trim(),
          parentCommentId: parentCommentId,
          userId : author
        });

        console.log(response);
        
        // Update the comments list with the new comment
        setComments((prevComments) => [...prevComments, response.data.comment]);

        // Clear the input field and reset state
        setNewComment('');
        setParentCommentId(null);
        setCommentError(null);  // Clear any previous error message
      } catch (err) {
        setCommentError(err.message);
      }
    } else {
      setCommentError('Comment cannot be empty!');
    }
  };


  const [replyOpen, setReplyOpen] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [childReplyContent, setchildReplyContent] = useState([]);


  const handleReplyClick = async (commentId) => {
    if (replyOpen === commentId) {
      // Close the reply section
      setReplyOpen(null);
      setchildReplyContent([]);
    } else {
      setReplyOpen(commentId);
  
      try {
        // Fetch the child comments for the specified commentId
        const response = await apiClient.get(`/api/comment/children`, {
          params: {
            parentCommentId: commentId, // Send the parent comment ID as a query parameter
          },
        });
  
        // Update the childReplyContent state with the fetched comments
        setchildReplyContent(response.data);
      } catch (error) {
        console.error('Error fetching child comments:', error);
        alert('Failed to load child comments. Please try again later.');
      }
    }
  };  


  const handleReplySubmit = async (commentId) => {
    try {
      // Check if replyContent is empty
      if (!replyContent.trim()) {
        alert("Reply content cannot be empty!");
        return;
      }
  
      // Make a POST request to your backend API using axios
      const response = await apiClient.post(`/api/comment/create`, {
        blogPostId: blog._id, // Assuming `blog._id` is the current blog post ID
        content: replyContent.trim(),
        parentCommentId: commentId, // Parent comment ID for threading
        userId: author, // Assuming `author` is the current user ID
      });
  
      console.log(`Reply submitted successfully:`, response.data);
  
      // Reset the state after successful submission
      // setReplyOpen(null); // Close the reply textbox
      setReplyContent('');
      setchildReplyContent((prevComments) => [...prevComments, response.data.comment]);
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert('Failed to submit reply. Please try again later.');
    }
  };
    

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-between bg-gray-50 p-4">
      <div className="w-full min-w-max-w-7xl bg-white shadow-lg rounded-lg p-6 flex gap-6">
        {loading && <p className="text-blue-500 text-center">Loading...</p>}
        {error && (
          <div className="text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={handleBack}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Back
            </button>
          </div>
        )}
        {!loading && !error && blog && (
          <>
          <div className="w-full flex flex-col lg:flex-row gap-6 lg:justify-between">
            {/* Main Content */}
            <div className="lg:flex-[7] w-full">
              <h1 className="text-3xl font-bold text-gray-800">{blog.title}</h1>
              <p className="mt-2 text-gray-500 italic">
                Author: {blog.author.username || 'Deleted User'}
              </p>
              <p className="mt-4 text-gray-700">{blog.description}</p>
              <button
                onClick={handleBack}
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Back
              </button>
            </div>
        
            {/* Sidebar */}
            <div className="lg:flex-[3] w-full space-y-6">
              {/* Votes Section */}
              <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-bold text-gray-700">Votes</h2>
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => handleVote('up')}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Upvote
                  </button>
                  <p className="text-green-700 text-xl font-semibold">{upvotes}</p>
                  <button
                    onClick={() => handleVote('down')}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Downvote
                  </button>
                  <p className="text-red-700 text-xl font-semibold">{downvotes}</p>
                </div>
              </div>
        
              {/* Comments Section */}
              <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-bold text-gray-700">Comments</h2>
                
                {/* Input for Adding New Comment */}
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                  />
                  <button
                    onClick={handleAddComment}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Post
                  </button>
                </div>
                <div>
                  <p className="text-red-500">{commentError}</p>
                </div>
                
                {/* Display Existing Comments */}
                <div className="mt-6 space-y-4">
                  {comments && comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment._id} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between">
                          <h3 className="text-md font-semibold text-gray-800">{comment.authorName}</h3>
                          <p className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
                        </div>
                        <p className="mt-2 text-gray-700">{comment.content}</p>
                        
                        {/* Reply Button */}
                        <div className="flex items-center justify-end space-x-4">
                          <button
                            onClick={() => handleReplyClick(comment._id)}
                            className="px-2 py-2 text-sm font-medium text-blue-600 rounded-md hover:bg-blue-300"
                          >
                            <FiMessageCircle className="text-blue-700" size={20} />
                          </button>
                        </div>



                        {replyOpen === comment._id && (
                          <div>
                            <div className="mt-4">
                              <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Type your reply..."
                              />
                              <button
                                onClick={() => handleReplySubmit(comment._id)}
                                className="m-2 bg-blue-600 text-white px-4 py-1 rounded-lg"
                              >
                                Send
                              </button>
                            </div>

                            <div className="mt-4 space-y-2">
                              {childReplyContent.length > 0 ? (
                                childReplyContent.map((child) => (
                                  <div
                                    key={child._id}
                                    className="p-2 border border-gray-200 rounded-md bg-gray-100"
                                  >
                                    <p className="text-sm text-gray-700">
                                      <strong>{child.authorName}</strong>: {child.content}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {new Date(child.createdAt).toLocaleString()}
                                    </p>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-gray-500">No replies yet.</p>
                              )}
                            </div>
                          </div>
                        )}

                      </div>


                    ))
                  ) : (
                    <p className="text-gray-500">No comments yet.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </>
        
        )}
      </div>
    </div>
  );
}

export default Blog;
  