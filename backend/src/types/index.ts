export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  author: string;
  publishedAt: Date;
  updatedAt: Date;
  likes: number;
  readTime: number; // in minutes
  isPublished: boolean;
}

export interface Comment {
  id: string;
  blogId: string;
  author: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
}

export interface CreateBlogRequest {
  title: string;
  content: string;
  tags: string[];
  isPublished?: boolean;
}

export interface UpdateBlogRequest {
  title?: string;
  content?: string;
  tags?: string[];
  isPublished?: boolean;
}

export interface CreateCommentRequest {
  blogId: string;
  author: string;
  content: string;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface BlogListResponse {
  blogs: Blog[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
} 