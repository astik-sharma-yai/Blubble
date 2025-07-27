import express from 'express';
import admin from 'firebase-admin';
import { getFirestore } from '../config/firebase';
import { Comment, CreateCommentRequest, UpdateCommentRequest } from '../types';

const router = express.Router();
const db = getFirestore();

// GET /api/comments/:blogId - Get all comments for a blog
router.get('/:blogId', async (req, res) => {
  try {
    const { blogId } = req.params;
    
    const snapshot = await db.collection('comments')
      .where('blogId', '==', blogId)
      .orderBy('createdAt', 'desc')
      .get();
    
    const comments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Comment[];
    
    res.json({ success: true, data: comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch comments' });
  }
});

// POST /api/comments - Create a new comment
router.post('/', async (req, res) => {
  try {
    const { blogId, author, content }: CreateCommentRequest = req.body;
    
    if (!blogId || !author || !content) {
      return res.status(400).json({ 
        success: false, 
        error: 'Blog ID, author, and content are required' 
      });
    }
    
    // Verify blog exists
    const blogDoc = await db.collection('blogs').doc(blogId).get();
    if (!blogDoc.exists) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    
    const now = new Date();
    const commentData: Omit<Comment, 'id'> = {
      blogId,
      author,
      content,
      createdAt: now,
      updatedAt: now,
      likes: 0
    };
    
    const docRef = await db.collection('comments').add(commentData);
    const comment = { id: docRef.id, ...commentData };
    
    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ success: false, error: 'Failed to create comment' });
  }
});

// PUT /api/comments/:id - Update a comment
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content }: UpdateCommentRequest = req.body;
    
    if (!content) {
      return res.status(400).json({ 
        success: false, 
        error: 'Content is required' 
      });
    }
    
    const docRef = db.collection('comments').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }
    
    await docRef.update({
      content,
      updatedAt: new Date()
    });
    
    const updatedDoc = await docRef.get();
    const comment = { id: updatedDoc.id, ...updatedDoc.data() } as Comment;
    
    res.json({ success: true, data: comment });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ success: false, error: 'Failed to update comment' });
  }
});

// DELETE /api/comments/:id - Delete a comment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection('comments').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }
    
    await docRef.delete();
    
    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ success: false, error: 'Failed to delete comment' });
  }
});

// POST /api/comments/:id/like - Like a comment
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection('comments').doc(id);
    
    await docRef.update({
      likes: admin.firestore.FieldValue.increment(1)
    });
    
    res.json({ success: true, message: 'Comment liked successfully' });
  } catch (error) {
    console.error('Error liking comment:', error);
    res.status(500).json({ success: false, error: 'Failed to like comment' });
  }
});

export { router as commentRoutes }; 