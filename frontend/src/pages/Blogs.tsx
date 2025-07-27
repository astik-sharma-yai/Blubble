import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Heart, Clock, Tag, Search, Filter } from 'lucide-react';
import { blogApi } from '../services/api';
import { Blog } from '../types';
import { useBlogContext } from '../context/BlogContext';
import './Blogs.css';

export const Blogs = () => {
  const { state, dispatch } = useBlogContext();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const limit = 6; // Blogs per page

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        dispatch({ type: 'SET_LOADING', payload: true });
        
        const response = await blogApi.getBlogs(currentPage, limit, selectedTag);
        setBlogs(response.blogs);
        setTotalPages(Math.ceil(response.total / limit));
        
        // Extract unique tags from all blogs
        const tags = new Set<string>();
        response.blogs.forEach(blog => {
          blog.tags.forEach(tag => tags.add(tag));
        });
        setAllTags(Array.from(tags));
        
      } catch (error) {
        console.error('Error fetching blogs:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load blogs' });
      } finally {
        setIsLoading(false);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchBlogs();
  }, [currentPage, selectedTag, dispatch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleTagFilter = (tag: string) => {
    setSelectedTag(selectedTag === tag ? '' : tag);
    setCurrentPage(1);
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (state.loading && !isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="blogs-page">
      <div className="blogs-header">
        <h1>All Blogs</h1>
        <p>Discover stories, thoughts, and ideas</p>
      </div>

      <div className="blogs-filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="tag-filters">
          <Filter size={20} />
          <span>Filter by tags:</span>
          <div className="tag-buttons">
            <button
              className={`tag-btn ${selectedTag === '' ? 'active' : ''}`}
              onClick={() => handleTagFilter('')}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                className={`tag-btn ${selectedTag === tag ? 'active' : ''}`}
                onClick={() => handleTagFilter(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {state.error && <div className="error">{state.error}</div>}

      {filteredBlogs.length === 0 ? (
        <div className="no-blogs">
          <p>No blogs found.</p>
          {searchTerm && <p>Try adjusting your search terms.</p>}
        </div>
      ) : (
        <>
          <div className="blogs-grid">
            {filteredBlogs.map((blog) => (
              <article key={blog.id} className="blog-card">
                <div className="blog-header">
                  <h3>
                    <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                  </h3>
                  <div className="blog-meta">
                    <span>
                      <Clock size={16} />
                      {blog.readTime} min read
                    </span>
                    <span>
                      <Heart size={16} />
                      {blog.likes} likes
                    </span>
                  </div>
                </div>
                
                <p className="blog-excerpt">{blog.excerpt}</p>
                
                <div className="blog-tags">
                  {blog.tags.map((tag) => (
                    <span key={tag} className="tag">
                      <Tag size={14} />
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="blog-footer">
                  <span className="blog-date">
                    {format(new Date(blog.publishedAt), 'MMM dd, yyyy')}
                  </span>
                  <Link to={`/blogs/${blog.id}`} className="read-more">
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-secondary"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`page-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                className="btn btn-secondary"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}; 