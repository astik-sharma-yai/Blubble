import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Heart, Clock, Tag, ArrowLeft, MessageCircle, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { blogApi, commentApi } from '../services/api';
import { Blog, Comment, CreateCommentRequest } from '../types';
import { useBlogContext } from '../context/BlogContext';
import './BlogDetail.css';

export const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useBlogContext();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogAndComments = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // Fetch blog and comments in parallel
        const [blogData, commentsData] = await Promise.all([
          blogApi.getBlog(id),
          commentApi.getComments(id)
        ]);
        
        setBlog(blogData);
        setComments(commentsData);
        dispatch({ type: 'SET_CURRENT_BLOG', payload: blogData });
        dispatch({ type: 'SET_COMMENTS', payload: commentsData });
        
      } catch (error) {
        console.error('Error fetching blog:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load blog' });
      } finally {
        setIsLoading(false);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchBlogAndComments();
  }, [id, dispatch]);

  const handleLike = async () => {
    if (!blog) return;
    
    try {
      await blogApi.likeBlog(blog.id);
      const updatedLikes = blog.likes + 1;
      setBlog({ ...blog, likes: updatedLikes });
      dispatch({ type: 'UPDATE_BLOG_LIKES', payload: { blogId: blog.id, likes: updatedLikes } });
      setIsLiked(true);
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  const handleCommentLike = async (commentId: string, currentLikes: number) => {
    try {
      await commentApi.likeComment(commentId);
      const updatedComments = comments.map(comment =>
        comment.id === commentId ? { ...comment, likes: currentLikes + 1 } : comment
      );
      setComments(updatedComments);
      dispatch({ type: 'UPDATE_COMMENT_LIKES', payload: { commentId, likes: currentLikes + 1 } });
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog || !newComment.trim() || !commentAuthor.trim()) return;
    
    try {
      const commentData: CreateCommentRequest = {
        blogId: blog.id,
        author: commentAuthor,
        content: newComment.trim()
      };
      
      const newCommentData = await commentApi.createComment(commentData);
      setComments([newCommentData, ...comments]);
      dispatch({ type: 'ADD_COMMENT', payload: newCommentData });
      setNewComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!blog) {
    return (
      <div className="error-container">
        <div className="error">Blog not found</div>
        <button className="btn btn-primary" onClick={() => navigate('/blogs')}>
          Back to Blogs
        </button>
      </div>
    );
  }

  return (
    <div className="blog-detail">
      <div className="blog-header">
        <button className="back-btn" onClick={() => navigate('/blogs')}>
          <ArrowLeft size={20} />
          Back to Blogs
        </button>
        
        <h1>{blog.title}</h1>
        
        <div className="blog-meta">
          <div className="meta-left">
            <span className="author">By {blog.author}</span>
            <span className="date">
              {format(new Date(blog.publishedAt), 'MMMM dd, yyyy')}
            </span>
            <span className="read-time">
              <Clock size={16} />
              {blog.readTime} min read
            </span>
          </div>
          
          <div className="meta-right">
            <button 
              className={`like-btn ${isLiked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              <Heart size={20} />
              {blog.likes} likes
            </button>
          </div>
        </div>
        
        <div className="blog-tags">
          {blog.tags.map((tag) => (
            <span key={tag} className="tag">
              <Tag size={14} />
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="blog-content">
        <ReactMarkdown>{blog.content}</ReactMarkdown>
      </div>

      <div className="comments-section">
        <h3>
          <MessageCircle size={20} />
          Comments ({comments.length})
        </h3>
        
        <form className="comment-form" onSubmit={handleSubmitComment}>
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                placeholder="Your name"
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary">
            <Send size={16} />
            Post Comment
          </button>
        </form>

        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <span className="comment-author">{comment.author}</span>
                  <span className="comment-date">
                    {format(new Date(comment.createdAt), 'MMM dd, yyyy HH:mm')}
                  </span>
                </div>
                
                <div className="comment-content">{comment.content}</div>
                
                <div className="comment-footer">
                  <button
                    className="comment-like-btn"
                    onClick={() => handleCommentLike(comment.id, comment.likes)}
                  >
                    <Heart size={14} />
                    {comment.likes} likes
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}; 