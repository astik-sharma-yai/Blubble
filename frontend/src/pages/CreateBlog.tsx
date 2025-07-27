import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Eye, EyeOff, Tag, Send } from 'lucide-react';
import { blogApi } from '../services/api';
import { CreateBlogRequest } from '../types';
import { useBlogContext } from '../context/BlogContext';
import './CreateBlog.css';

export const CreateBlog = () => {
  const navigate = useNavigate();
  const { dispatch } = useBlogContext();
  const [formData, setFormData] = useState<CreateBlogRequest>({
    title: '',
    content: '',
    tags: [],
    isPublished: false
  });
  const [tagInput, setTagInput] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      return;
    }

    if (formData.tags.length === 0) {
      setError('At least one tag is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      const newBlog = await blogApi.createBlog(formData);
      
      dispatch({ type: 'SET_ERROR', payload: null });
      
      // Navigate to the new blog
      navigate(`/blogs/${newBlog.id}`);
    } catch (error) {
      console.error('Error creating blog:', error);
      setError('Failed to create blog. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      
      await blogApi.createBlog({
        ...formData,
        isPublished: false
      });
      
      dispatch({ type: 'SET_ERROR', payload: null });
      navigate('/blogs');
    } catch (error) {
      console.error('Error saving draft:', error);
      setError('Failed to save draft. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-blog">
      <div className="create-blog-header">
        <h1>Write a New Blog</h1>
        <p>Share your thoughts, ideas, and stories with the world</p>
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="blog-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter your blog title..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <div className="content-editor">
            <div className="editor-toolbar">
              <button
                type="button"
                className={`toolbar-btn ${isPreview ? 'active' : ''}`}
                onClick={() => setIsPreview(!isPreview)}
              >
                {isPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                {isPreview ? 'Edit' : 'Preview'}
              </button>
            </div>
            
            {isPreview ? (
              <div className="content-preview">
                <h2>{formData.title || 'Untitled'}</h2>
                <div className="markdown-preview">
                  {formData.content || 'Start writing your content...'}
                </div>
              </div>
            ) : (
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Write your blog content here... You can use Markdown formatting."
                required
                rows={20}
              />
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags *</label>
          <div className="tags-input">
            <div className="tag-input-container">
              <Tag size={16} />
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Add tags (press Enter or comma to add)"
              />
              <button type="button" onClick={addTag} className="add-tag-btn">
                Add
              </button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="tags-list">
                {formData.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="remove-tag"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                isPublished: e.target.checked
              }))}
            />
            Publish immediately
          </label>
          <small>
            {formData.isPublished 
              ? 'This blog will be published and visible to everyone immediately.'
              : 'This blog will be saved as a draft and won\'t be visible to others.'
            }
          </small>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="btn btn-secondary"
          >
            <Save size={16} />
            Save as Draft
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            <Send size={16} />
            {formData.isPublished ? 'Publish Blog' : 'Save Blog'}
          </button>
        </div>
      </form>

      <div className="markdown-help">
        <h3>Markdown Tips</h3>
        <div className="markdown-examples">
          <div className="example">
            <strong>Headers:</strong> # H1, ## H2, ### H3
          </div>
          <div className="example">
            <strong>Bold:</strong> **text** or __text__
          </div>
          <div className="example">
            <strong>Italic:</strong> *text* or _text_
          </div>
          <div className="example">
            <strong>Links:</strong> [text](url)
          </div>
          <div className="example">
            <strong>Code:</strong> `code` or ```code block```
          </div>
          <div className="example">
            <strong>Lists:</strong> - item or 1. item
          </div>
        </div>
      </div>
    </div>
  );
}; 