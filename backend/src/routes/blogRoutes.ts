import express from 'express';
import admin from 'firebase-admin';
import { getFirestore } from '../config/firebase';
import { Blog, CreateBlogRequest, UpdateBlogRequest, BlogListResponse, ApiResponse } from '../types';

const router = express.Router();
const db = getFirestore();

// Helper function to calculate read time
const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Helper function to create excerpt
const createExcerpt = (content: string, maxLength: number = 150): string => {
  const plainText = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength).trim() + '...';
};

// GET /api/blogs - Get all published blogs with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const tag = req.query.tag as string;
    
    let query = db.collection('blogs')
      .where('isPublished', '==', true)
      .orderBy('publishedAt', 'desc');
    
    if (tag) {
      query = query.where('tags', 'array-contains', tag);
    }
    
    const snapshot = await query.get();
    const total = snapshot.size;
    
    const blogs = snapshot.docs
      .slice((page - 1) * limit, page * limit)
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Blog[];
    
    const response: BlogListResponse = {
      blogs,
      total,
      page,
      limit
    };
    
    res.json({ success: true, data: response });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch blogs' });
  }
});

// GET /api/blogs/:id - Get a specific blog
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('blogs').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    
    const blog = { id: doc.id, ...doc.data() } as Blog;
    res.json({ success: true, data: blog });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch blog' });
  }
});

// POST /api/blogs - Create a new blog
router.post('/', async (req, res) => {
  try {
    const { title, content, tags, isPublished = false }: CreateBlogRequest = req.body;
    
    if (!title || !content || !tags) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title, content, and tags are required' 
      });
    }
    
    const now = new Date();
    const blogData: Omit<Blog, 'id'> = {
      title,
      content,
      excerpt: createExcerpt(content),
      tags,
      author: 'Admin', // You can make this dynamic later
      publishedAt: isPublished ? now : new Date(0),
      updatedAt: now,
      likes: 0,
      readTime: calculateReadTime(content),
      isPublished
    };
    
    const docRef = await db.collection('blogs').add(blogData);
    const blog = { id: docRef.id, ...blogData };
    
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ success: false, error: 'Failed to create blog' });
  }
});

// PUT /api/blogs/:id - Update a blog
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates: UpdateBlogRequest = req.body;
    
    const docRef = db.collection('blogs').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    
    const updateData: any = {
      updatedAt: new Date()
    };
    
    if (updates.title) updateData.title = updates.title;
    if (updates.content) {
      updateData.content = updates.content;
      updateData.excerpt = createExcerpt(updates.content);
      updateData.readTime = calculateReadTime(updates.content);
    }
    if (updates.tags) updateData.tags = updates.tags;
    if (updates.isPublished !== undefined) {
      updateData.isPublished = updates.isPublished;
      if (updates.isPublished && !doc.data()?.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }
    
    await docRef.update(updateData);
    
    const updatedDoc = await docRef.get();
    const blog = { id: updatedDoc.id, ...updatedDoc.data() } as Blog;
    
    res.json({ success: true, data: blog });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ success: false, error: 'Failed to update blog' });
  }
});

// DELETE /api/blogs/:id - Delete a blog
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection('blogs').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    
    await docRef.delete();
    
    // Also delete associated comments
    const commentsSnapshot = await db.collection('comments')
      .where('blogId', '==', id)
      .get();
    
    const deletePromises = commentsSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
    
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ success: false, error: 'Failed to delete blog' });
  }
});

// POST /api/blogs/:id/like - Like a blog
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection('blogs').doc(id);
    
    await docRef.update({
      likes: admin.firestore.FieldValue.increment(1)
    });
    
    res.json({ success: true, message: 'Blog liked successfully' });
  } catch (error) {
    console.error('Error liking blog:', error);
    res.status(500).json({ success: false, error: 'Failed to like blog' });
  }
});

export { router as blogRoutes }; 