import axios from 'axios';
import { Blog, Comment, CreateBlogRequest, CreateCommentRequest, BlogListResponse, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Blog API calls
export const blogApi = {
  // Get all blogs with pagination
  getBlogs: async (page = 1, limit = 10, tag?: string): Promise<BlogListResponse> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (tag) params.append('tag', tag);
    
    const response = await api.get<ApiResponse<BlogListResponse>>(`/blogs?${params}`);
    return response.data.data!;
  },

  // Get a specific blog
  getBlog: async (id: string): Promise<Blog> => {
    const response = await api.get<ApiResponse<Blog>>(`/blogs/${id}`);
    return response.data.data!;
  },

  // Create a new blog
  createBlog: async (blogData: CreateBlogRequest): Promise<Blog> => {
    const response = await api.post<ApiResponse<Blog>>('/blogs', blogData);
    return response.data.data!;
  },

  // Update a blog
  updateBlog: async (id: string, blogData: Partial<CreateBlogRequest>): Promise<Blog> => {
    const response = await api.put<ApiResponse<Blog>>(`/blogs/${id}`, blogData);
    return response.data.data!;
  },

  // Delete a blog
  deleteBlog: async (id: string): Promise<void> => {
    await api.delete(`/blogs/${id}`);
  },

  // Like a blog
  likeBlog: async (id: string): Promise<void> => {
    await api.post(`/blogs/${id}/like`);
  },
};

// Comment API calls
export const commentApi = {
  // Get comments for a blog
  getComments: async (blogId: string): Promise<Comment[]> => {
    const response = await api.get<ApiResponse<Comment[]>>(`/comments/${blogId}`);
    return response.data.data!;
  },

  // Create a new comment
  createComment: async (commentData: CreateCommentRequest): Promise<Comment> => {
    const response = await api.post<ApiResponse<Comment>>('/comments', commentData);
    return response.data.data!;
  },

  // Update a comment
  updateComment: async (id: string, content: string): Promise<Comment> => {
    const response = await api.put<ApiResponse<Comment>>(`/comments/${id}`, { content });
    return response.data.data!;
  },

  // Delete a comment
  deleteComment: async (id: string): Promise<void> => {
    await api.delete(`/comments/${id}`);
  },

  // Like a comment
  likeComment: async (id: string): Promise<void> => {
    await api.post(`/comments/${id}/like`);
  },
};

export default api; 