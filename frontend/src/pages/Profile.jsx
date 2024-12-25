import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate} from 'react-router-dom';
import { deleteSuccess, editSuccess } from '../app/features/userSlice';
import { setOpenedBlogId, clearOpenedBlogId } from '../app/features/blogSlice';

import axios from "axios";
import BlogModal from '../components/blogModal';
 
function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editFormError, setEditFormError] = useState(""); // Renamed to editFormError
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [iscreate, setIscreate] = useState(false)

  const handleDashboardNavigation = () => {
    navigate('/dashboard');
  };

  const handleSignInNavigation = () => {
    navigate('/signin'); // Replace with your sign-in route
  };

  const handleDelete = async (userId) => {
    if (!userId) {
      throw new Error("User ID is missing or invalid.");
      return;
    }

    const confirmation = window.confirm("Are you sure you want to delete this user?");
    if (!confirmation) return;

    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete user.");
      }

      const result = await response.json();
      console.log(result.message || "User deleted successfully.");

      // Clear Redux state and redirect
      dispatch(deleteSuccess());
      navigate("/");
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new error(error.message || "Something went wrong!");
    }
  };

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleEdit = () => {
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setFormData({
      username: '',
      email: '',
      // password: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    // Add your form submission logic here
    setIsFormVisible(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    setEditFormError(""); // Reset error before validation

    // Client-side validation
    if (formData.username.trim() === "" || formData.email.trim() === "") {
      setEditFormError("All fields are required."); // Update editFormError
      return;
    }

    try {
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser?.user?._id,
          username: formData.username,
          email: formData.email,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to update user.");
      }

      alert("User information updated successfully.");
      handleCancel();
      dispatch(editSuccess());
      navigate('/signin')

    } catch (err) {
      setEditFormError(err.message); // Update editFormError
    }

  };

  const [blogs, setBlogs] = useState([]);
  const currentUserId = currentUser?.user?._id

  // Fetch user blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`/api/blog?author=${currentUserId}`);
        setBlogs(response.data.blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    if (currentUserId) {
      fetchBlogs();
    }
  }, [currentUserId]);

  const [showModal, setShowModal] = useState(false);

  const setShow = (show) => {
    setShowModal(show); // Set showModal to true to display the modal
    console.log("Create Blog Button Clicked!");
  };

  const handleCreateBlog = (e) => {
    e.preventDefault();
    setSelectedBlog(null); // Reset selectedBlog to ensure no pre-filled data
    setShowModal(true); // Show the modal
    setIscreate(true)
    console.log("Create Blog Button Clicked!");
  };
  
  const handleOpenBlog = (blogId) => {
    dispatch(setOpenedBlogId(blogId));
    // For now, you can log the ID or perform navigation
    console.log(`Opening blog with ID: ${blogId}`);
    navigate(`/blog/${blogId}`); // Update the route when ready
  };

  const handleEditBlog = (blogId) => {
    // Find the blog to be edited using the blogId
    const blogToEdit = blogs.find((blog) => blog._id === blogId);
    
    if (blogToEdit) {
      setIscreate(false)
      setSelectedBlog(blogToEdit); // Set the selected blog for editing
      setShowModal(true); // Show the modal
      console.log("Edit Blog Button Clicked!");
    } else {
      console.error("Blog not found for the given ID!");
    }
  };
  
  const handleDeleteBlog = (blogId) => {
    // Ask for confirmation before deleting
    const isConfirmed = window.confirm("Are you sure you want to delete this blog?");
    if (isConfirmed) {
      // Proceed with deletion (this could be an API call to remove the blog from the database)
      console.log(`Deleting blog with ID: ${blogId}`);
  
      // Example: Remove the blog from the state (if you're managing the state locally)
      setBlogs((prevBlogs) => prevBlogs.filter(blog => blog._id !== blogId));
  
      // Optionally, make an API call to delete the blog from the server:
      fetch(`/api/blog/delete/${blogId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author: currentUser.user._id, // Including the current user's ID as the author
        }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Blog deleted:', data);
        // Optionally, update the local state to remove the blog
        setBlogs((prevBlogs) => prevBlogs.filter(blog => blog._id !== blogId));
      })
    }
  };
  


  if(currentUser){
    return (
    <div className="flex flex-col gap-4 p-4 md:flex-row bg-gray-400 h-screen">
      {/* Left Section */}
      <div className="flex flex-col gap-2 p-4 bg-gray-100 rounded shadow md:w-1/2">
      <h2 className="text-lg font-semibold">{currentUser?.user?.username}</h2>
      <h3 className="text-sm text-gray-600">{currentUser?.user?.email}</h3>
      <h3 className="text-sm text-gray-600">{currentUser?.user?.role}</h3>

      {/* Edit and Delete Buttons */}
      {!isFormVisible && (
        <div className="flex gap-2 mt-4">
          <button
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            onClick={() => handleEdit(currentUser?.user?._id)}
          >
            Edit
          </button>
          <button
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            onClick={() => handleDelete(currentUser?.user?._id)}
          >
            Delete
          </button>
        </div>
      )}
      
      {isFormVisible && (
        <form onSubmit={handleSubmit} className="mt-4 p-4 border rounded shadow-md bg-gray-100">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="username">
              New Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded  focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              New Email ID
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div> */}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
              onClick={handleCancel}
              >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
              onClick={handleEditFormSubmit}
              >
              Submit
            </button>
          </div>
          
          {editFormError && ( // Display editFormError
            <div className="mb-4 text-red-600">
              {editFormError}
            </div>
          )}

        </form>
      )}

      {/* Admin Dashboard Button */}
      <div>
      {currentUser?.user?.role === 'admin' && (
        <button
          className="px-4 py-2 mt-4 text-white bg-gray-500 rounded hover:bg-gray-600"
          onClick={handleDashboardNavigation}
        >
          Go to Dashboard
        </button>
      )}
      </div>
    </div>

      {/* Right Section */}
      <div className="flex flex-col gap-2 p-4 bg-gray-100 rounded shadow md:w-1/2">
          <button
            className="self-start px-4 py-2 mb-4 text-white bg-blue-500 rounded hover:bg-blue-600"
            onClick={handleCreateBlog}
          >
            Create Blog
          </button>

          {showModal && 
            <BlogModal
            show={showModal}
            initialData={selectedBlog} // Pass the selected blog data for editing
            setShow={setShowModal}
            iscreate={iscreate}
            setBlogs={setBlogs}
            />  
          }
          
          <h2 className="text-lg font-semibold">User Blogs</h2>

          {blogs.length > 0 ? (
              blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="p-3 bg-white border rounded shadow-sm"
                >
                  <h3 className="text-md font-bold">{blog.title}</h3>
                  <p className="text-sm text-gray-600">
                    {blog.description.length > 100 ? `${blog.description.slice(0, 100)}...` : blog.description}
                  </p>
                  <div className="flex justify-end gap-2 mt-2">
                  <button
                    className="px-3 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600"
                    onClick={() => handleOpenBlog(blog._id)}
                  >
                    Open
                  </button>
                    <button
                      className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                      onClick={() => handleEditBlog(blog._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                      onClick={() => handleDeleteBlog(blog._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">No blogs found.</p>
            )}
        </div>
     </div>
    )
  }
    // If username is null or empty, the user is not logged in
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-6 text-center bg-gray-100 rounded shadow">
          <h2 className="text-lg font-semibold">You are not logged in</h2>
          <p className="text-sm text-gray-600">Please sign in to view your profile.</p>
          <button
            className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
            onClick={handleSignInNavigation}
          >
            Sign In
          </button>
        </div>
      </div>
    );  
}

export default Profile;
