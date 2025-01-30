import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiClient, apiFetch } from "./Api.jsx";

const BlogModal = ({ show, initialData, setShow, iscreate, setBlogs }) => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const blogId = initialData?._id;
  const API_URL = import.meta.env.VITE_API_URL || "https://intx.onrender.com";

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    author: currentUser?.user?._id,
  });

  const [errorMessage, setErrorMessage] = useState('');

  // Initialize form fields with initialData when editing a blog
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        company: initialData.company || '',
        author: initialData.author || ''
      });
    }
  }, [initialData]);

  // Handle input changes for all form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrorMessage(''); // Clear error message on input change
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const { title, description, company, author } = formData;

    // Validation: Ensure all fields are filled
    if (!title || !description || !company) {
      setErrorMessage('All fields are required.');
      return;
    }

    try {
      let response = null;

      if (iscreate) {
        response = await fetch(`${API_URL}/api/blog/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, description, company, author }), // Sending formData as JSON
        });
      } else {
        response = await fetch(`${API_URL}/api/blog/update/${blogId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, description, company, author }), // Sending formData as JSON
        });
      }

      if (response.ok) {

        const updatedBlog = await response.json(); // Assuming the API returns the created/updated blog
        console.log(updatedBlog.blogPost);
        
        setBlogs((prevBlogs) => {
          if (iscreate) {
            // Add the new blog to the state
            return [...prevBlogs, updatedBlog.blogPost];
          } else {
            // Update the existing blog in the state
            return prevBlogs.map((blog) =>
              blog._id === blogId ? updatedBlog.blogPost : blog
            );
          }
        })

        // If the response is successful, close the modal and reset form
        setFormData({
          title: '',
          description: '',
          company: '',
        });
        setShow(false); // Close the modal
      } else {
        // If the response is not ok, display the backend error message
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to submit the blog.');
      }
    } catch (error) {
      // Handle any other errors
      setErrorMessage(error.message || 'Something went wrong while submitting the blog.');
    }
  };

  // Handle closing the modal
  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      company: '',
    });
    setErrorMessage(''); // Clear error message on close
    setShow(false); // Close the modal by setting show to false
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {iscreate ? 'Create Blog' : 'Edit Blog'}
        </h2>

        {/* Error message box */}
        {errorMessage && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter blog title"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter blog description"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Company Name:</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Enter company name"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mt-4 flex justify-between">
            <button
              type="button"
              onClick={handleClose} // Close the modal when Cancel is clicked
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
            >
              Cancel
            </button>
            <button
              type="submit" // Submit the form data when Submit is clicked
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogModal;
