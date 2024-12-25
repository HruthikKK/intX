import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

function Blog() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const author = currentUser?.user?._id;

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
        const response = await axios.get(`/api/blog/${id}`);
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
        const response = await axios.post(`/api/blog/vote/${id}`, { type, author });
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
        const response = await axios.post(`/api/blog/${id}/comment`, {
          text: newComment.trim(),
          parentId: parentCommentId,
        });
        setComments(response.data.updatedComments);
        setNewComment('');
        setParentCommentId(null);
      } catch (err) {
        alert('Failed to add comment. Please try again.');
      }
    }
  };

  const handleReply = (commentId) => {
    setParentCommentId(commentId);
    setNewComment('');
  };

  const handleBack = () => {
    navigate('/');
  };

  const renderComments = (comments, parentId = null) => {
    return comments
      .filter((comment) => comment.parentId === parentId)
      .map((comment) => (
        <div key={comment.id} className="ml-4 mt-2">
          <div className="bg-white p-2 rounded shadow text-gray-700">
            <p className="font-bold">{comment.author}</p>
            <p>{comment.text}</p>
            <button
              onClick={() => handleReply(comment.id)}
              className="text-sm text-blue-500 hover:underline"
            >
              Reply
            </button>
          </div>
          <div className="pl-4">{renderComments(comments, comment.id)}</div>
        </div>
      ));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-7xl bg-white shadow-lg rounded-lg p-6 flex gap-6">
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
          <div className="flex flex-col lg:flex-row gap-6">
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
                {renderComments(comments)}
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
  