import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Heart, Clock, Tag } from 'lucide-react';
import { blogApi } from '../services/api';
import { Blog } from '../types';
import { useBlogContext } from '../context/BlogContext';
import './Home.css';

export const Home = () => {
  const { state, dispatch } = useBlogContext();
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchRecentBlogs = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await blogApi.getBlogs(1, 3); // Get 3 most recent blogs
        setRecentBlogs(response.blogs);
      } catch (error) {
        console.error('Error fetching recent blogs:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load recent blogs' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchRecentBlogs();
  }, [dispatch]);

  if (state.loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to Blubble</h1>
        <p>A simple and elegant space for sharing thoughts, ideas, and stories.</p>
        <div className="hero-actions">
          <Link to="/blogs" className="btn btn-primary">
            Read Blogs
          </Link>
          <Link to="/create" className="btn btn-secondary">
            Write a Blog
          </Link>
        </div>
      </div>

      <section className="recent-blogs">
        <h2>Recent Posts</h2>
        {state.error && <div className="error">{state.error}</div>}
        
        {recentBlogs.length === 0 ? (
          <div className="no-blogs">
            <p>No blogs published yet.</p>
            <Link to="/create" className="btn btn-primary">
              Write Your First Blog
            </Link>
          </div>
        ) : (
          <div className="blogs-grid">
            {recentBlogs.map((blog) => (
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
        )}
        
        {recentBlogs.length > 0 && (
          <div className="view-all">
            <Link to="/blogs" className="btn btn-secondary">
              View All Blogs
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}; 