import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Blog, Comment } from '../types';

interface BlogState {
  blogs: Blog[];
  currentBlog: Blog | null;
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

type BlogAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_BLOGS'; payload: Blog[] }
  | { type: 'SET_CURRENT_BLOG'; payload: Blog | null }
  | { type: 'SET_COMMENTS'; payload: Comment[] }
  | { type: 'ADD_COMMENT'; payload: Comment }
  | { type: 'UPDATE_BLOG_LIKES'; payload: { blogId: string; likes: number } }
  | { type: 'UPDATE_COMMENT_LIKES'; payload: { commentId: string; likes: number } };

const initialState: BlogState = {
  blogs: [],
  currentBlog: null,
  comments: [],
  loading: false,
  error: null,
};

const blogReducer = (state: BlogState, action: BlogAction): BlogState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_BLOGS':
      return { ...state, blogs: action.payload };
    case 'SET_CURRENT_BLOG':
      return { ...state, currentBlog: action.payload };
    case 'SET_COMMENTS':
      return { ...state, comments: action.payload };
    case 'ADD_COMMENT':
      return { ...state, comments: [action.payload, ...state.comments] };
    case 'UPDATE_BLOG_LIKES':
      return {
        ...state,
        blogs: state.blogs.map(blog =>
          blog.id === action.payload.blogId
            ? { ...blog, likes: action.payload.likes }
            : blog
        ),
        currentBlog: state.currentBlog?.id === action.payload.blogId
          ? { ...state.currentBlog, likes: action.payload.likes }
          : state.currentBlog,
      };
    case 'UPDATE_COMMENT_LIKES':
      return {
        ...state,
        comments: state.comments.map(comment =>
          comment.id === action.payload.commentId
            ? { ...comment, likes: action.payload.likes }
            : comment
        ),
      };
    default:
      return state;
  }
};

interface BlogContextType {
  state: BlogState;
  dispatch: React.Dispatch<BlogAction>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const useBlogContext = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlogContext must be used within a BlogProvider');
  }
  return context;
};

interface BlogProviderProps {
  children: ReactNode;
}

export const BlogProvider: React.FC<BlogProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(blogReducer, initialState);

  return (
    <BlogContext.Provider value={{ state, dispatch }}>
      {children}
    </BlogContext.Provider>
  );
}; 