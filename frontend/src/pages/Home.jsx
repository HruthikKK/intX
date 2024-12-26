import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  // Sample data for blogs and contributors
  const [blogs, setBlogs] = useState([]);
const [visibleBlogs, setVisibleBlogs] = useState([]);
const [topContributors, setTopContributors] = useState([]);
const [topBlogs, setTopBlogs] = useState([]);
const [companyTags, setCompanyTags] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const navigate = useNavigate();  // Initialize the navigate function


// Load initial data from the backend
useEffect(() => {
  const fetchData = async () => {
    try {
      // Fetch data for blogs, contributors, top blogs, and company tags using axios
      const blogResponse = await axios.get('/api/blog/all');
      const blogsData = blogResponse.data;
      // console.log(blogsData);

      const contributorsResponse = await axios.get('/api/home/topContributors ');
      const contributorsData = contributorsResponse.data;
      // console.log(contributorsData);
      
      // const tagsResponse = await axios.get('/api/companies');
      // const tagsData = tagsResponse.data;
      // console.log(tagsData);
      
      // Set the data to the state
      setBlogs(blogsData);
      setTopContributors(contributorsData);
      if (blogsData.length > 0) {
        // Create a sorted copy of blogs based on upvotes without mutating the original array
        const sortedBlogs = [...blogsData].sort((a, b) => b.upvotes - a.upvotes);
        // Select the top 5 blogs
        setTopBlogs(sortedBlogs.slice(0, 5));
      }
      // console.log("HI",topBlogs);
      
      // Assuming the first 5 blogs are the top ones
      // setCompanyTags(tagsData);
      setVisibleBlogs(blogsData.slice(0, 5));  // Set initial visible blogs to 5
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  // Call the fetchData function
  fetchData();
}, []);

// console.log("djbkadj",topBlogs);
// Handle search button click
const handleSearch = () => {
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  setVisibleBlogs(filteredBlogs); // Update visible blogs with search results
};

// Load more blogs when the button is clicked
const loadMoreBlogs = () => {
  // Ensure that we do not load more blogs than available
  const nextVisibleBlogs = blogs.slice(0, visibleBlogs.length + 5);
  setVisibleBlogs(nextVisibleBlogs);
};

  const handleBlogClick = (id) => {
    // Redirect to the individual blog page using the blog ID
    navigate(`/blog/${id}`);
  };


  return (
    <div className="bg-gray-700 min-h-screen p-4">
      <div className="sm:flex sm:space-x-8">
        {/* Left Section */}
        <div className="sm:w-2/3 space-y-4">
          {/* Search Bar */}
          {/* Search Bar */}
          <div>
            <input
              type="text"
              placeholder="Search blogs..."
              className="w-2/3 p-2 text-black rounded-lg m-5"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Search
            </button>
          </div>
          
          {/* Blog List */}
          <div className="space-y-8">
            {visibleBlogs.map((blog, index) => (
              <div 
                key={index} 
                onClick={() => handleBlogClick(blog._id)} 
                className="text-white p-4 rounded-lg cursor-pointer hover:bg-gray-600"
              >
                <h3 className="text-lg font-semibold">{blog.title}</h3>
                
                {/* Truncate the description to 100 characters */}
                <p className="text-sm">
                  {blog.description.length > 100 ? `${blog.description.slice(0, 100)}...` : blog.description}
                </p>

                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-300">Upvotes: {blog.upvotes}</span>
                  <span className="text-sm text-gray-300">Author: {blog.authorName}</span>
                </div>
              </div>
            ))}
          </div>


          {/* Load More Button */}
          {visibleBlogs.length < blogs.length && (
            <button
              onClick={loadMoreBlogs}
              className="bg-blue-500 text-white p-2 rounded-lg mt-4"
            >
              Load More
            </button>
          )}
        </div>

        {/* Right Section (Visible only on larger screens) */}
        <div className="sm:w-1/3 space-y-8 mt-8 lg:mt-0 hidden sm:block">
        {/* Top Contributors */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-white text-xl mb-4">Top Contributors</h2>
            <ul className="space-y-2">
              {topContributors.map((contributor, index) => (
                <li key={index} className="text-white">
                  <div className="flex justify-between items-center">
                    <span>{index + 1}. {contributor.authorName}</span>
                    <span className="text-gray-400">Upvotes: {contributor.totalUpvotes}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>


          {/* Top Blogs */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-white text-xl mb-4">Top 5 Blogs</h2>
            <ul className="space-y-2">
              {topBlogs.map((blog, index) => (
                <li key={blog.id} className="text-white">
                  <div className="flex justify-between items-center">
                  <span>
                    {index + 1}. {blog.title.length > 10 ? `${blog.title.slice(0, 30)}...` : blog.title}
                  </span>
                    <span className="text-gray-400">Upvotes: {blog.upvotes}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>


          {/* Company Tags */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-white text-xl mb-4">Company Tags</h2>
            <div className="space-x-2 flex flex-wrap">
              {companyTags.map((tag, index) => (
                <span
                  key={index}
                  className="text-white text-sm px-4 py-2 rounded-full cursor-pointer hover:bg-gray-600 transition-all"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
