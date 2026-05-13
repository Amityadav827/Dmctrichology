"use client";
import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { fetchComments, submitComment } from '../services/api';
import { formatDate } from '../utils/dateFormatter';

const BlogComments = ({ blogSlug }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', content: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const loadComments = async () => {
      try {
        const res = await fetchComments(blogSlug);
        if (res?.success) {
          setComments(res.data || []);
        }
      } catch (err) {
        console.error("Comments fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadComments();
  }, [blogSlug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.content) {
      setMessage({ type: 'error', text: 'All fields are required' });
      return;
    }
    
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await submitComment({
        blogSlug,
        ...formData
      });

      if (res?.success) {
        setMessage({ type: 'success', text: 'Comment posted successfully!' });
        setComments([res.data, ...comments]);
        setFormData({ name: '', email: '', content: '' });
      } else {
        setMessage({ type: 'error', text: res?.message || 'Failed to post comment' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="blog-interactions-wrapper">
      {/* Comments List */}
      <div className="comments-section">
        <h3 className="section-title">Comments ({comments.length})</h3>
        <div className="comments-list">
          {loading ? (
            <p>Loading comments...</p>
          ) : comments.length > 0 ? (
            comments.map((comment, idx) => (
              <div key={idx} className="comment-item">
                <div className="comment-avatar" style={{ backgroundColor: '#1a3760', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {comment.name?.charAt(0).toUpperCase()}
                </div>
                <div className="comment-content">
                  <div className="comment-header">
                    <h4 className="comment-author">{comment.name}</h4>
                    <span className="comment-date">{formatDate(comment.created_at)}</span>
                  </div>
                  <p className="comment-text">{comment.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No comments yet. Be the first to reply!</p>
          )}
        </div>
      </div>

      {/* Reply Form */}
      <div className="reply-form-section">
        <h3 className="section-title">Leave A Reply</h3>
        <p className="form-subtitle">Your Email Address Will Not Be Published. Required Fields Are Marked *</p>
        
        {message.text && (
          <div className={`form-message ${message.type}`} style={{ padding: '10px', marginBottom: '20px', borderRadius: '4px', backgroundColor: message.type === 'success' ? '#e6fffa' : '#fff5f5', color: message.type === 'success' ? '#2c7a7b' : '#c53030', border: `1px solid ${message.type === 'success' ? '#81e6d9' : '#feb2b2'}` }}>
            {message.text}
          </div>
        )}

        <form className="reply-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <input 
                type="text" 
                placeholder="Name*" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input 
                type="email" 
                placeholder="Your Email Address*" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <textarea 
              placeholder="Your Message*" 
              rows="6" 
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            ></textarea>
          </div>
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post Comment'}
            <Send size={14} className="ml-2" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlogComments;
