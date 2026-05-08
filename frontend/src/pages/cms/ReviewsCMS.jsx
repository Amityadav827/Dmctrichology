import React, { useState, useEffect } from 'react';
import axios from '../../api/client';
import { toast } from 'react-hot-toast';
import { Save, Plus, Trash2, MessageSquare, Video, Star, Layout } from 'lucide-react';

const ReviewsCMS = () => {
  const [data, setData] = useState({
    enabled: true,
    badgeText: '',
    heading: '',
    googleReviewText: '',
    reviews: [],
    videos: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: res } = await axios.get('/reviews');
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      toast.error('Failed to fetch reviews data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put('/reviews', data);
      toast.success('Changes saved and published!');
    } catch (err) {
      toast.error('Failed to save changes');
    }
  };

  const addReview = () => {
    setData({
      ...data,
      reviews: [...data.reviews, { name: 'New Reviewer', text: 'Amazing service!', rating: 5 }]
    });
  };

  const updateReview = (index, field, value) => {
    const newReviews = [...data.reviews];
    newReviews[index][field] = value;
    setData({ ...data, reviews: newReviews });
  };

  const removeReview = (index) => {
    setData({ ...data, reviews: data.reviews.filter((_, i) => i !== index) });
  };

  const addVideo = () => {
    setData({
      ...data,
      videos: [...data.videos, { name: 'New Story', image: '', url: '' }]
    });
  };

  const updateVideo = (index, field, value) => {
    const newVideos = [...data.videos];
    newVideos[index][field] = value;
    setData({ ...data, videos: newVideos });
  };

  const removeVideo = (index) => {
    setData({ ...data, videos: data.videos.filter((_, i) => i !== index) });
  };

  if (loading) return <div className="p-8">Loading Reviews Editor...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reviews & Stories Editor</h1>
            <p className="text-gray-500">Manage text reviews and video stories</p>
          </div>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            <Save size={20} />
            Save Changes
          </button>
        </div>

        {/* Section Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Layout size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Header Content</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Badge Text</label>
              <input type="text" value={data.badgeText} onChange={(e) => setData({ ...data, badgeText: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Heading</label>
              <input type="text" value={data.heading} onChange={(e) => setData({ ...data, heading: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Google Review Text</label>
              <input type="text" value={data.googleReviewText} onChange={(e) => setData({ ...data, googleReviewText: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Text Reviews */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <MessageSquare size={20} />
                Text Testimonials
              </h2>
              <button onClick={addReview} className="text-indigo-600 text-sm font-medium hover:underline">+ Add Review</button>
            </div>
            {data.reviews.map((review, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative group">
                <button onClick={() => removeReview(i)} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18} /></button>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Author Name</label>
                      <input type="text" value={review.name} onChange={(e) => updateReview(i, 'name', e.target.value)} className="w-full px-3 py-2 border-b border-gray-100 focus:border-indigo-500 outline-none text-sm font-semibold" />
                    </div>
                    <div className="w-24">
                      <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Rating</label>
                      <select value={review.rating} onChange={(e) => updateReview(i, 'rating', Number(e.target.value))} className="w-full px-3 py-2 border-b border-gray-100 outline-none text-sm">
                        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Stars</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Review Content</label>
                    <textarea value={review.text} onChange={(e) => updateReview(i, 'text', e.target.value)} className="w-full px-3 py-2 border border-gray-50 rounded-lg text-sm min-h-[80px]" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Video Stories */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Video size={20} />
                Video Stories
              </h2>
              <button onClick={addVideo} className="text-indigo-600 text-sm font-medium hover:underline">+ Add Video</button>
            </div>
            {data.videos.map((video, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative group">
                <button onClick={() => removeVideo(i)} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18} /></button>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Video Title</label>
                    <input type="text" value={video.name} onChange={(e) => updateVideo(i, 'name', e.target.value)} className="w-full px-3 py-2 border-b border-gray-100 focus:border-indigo-500 outline-none text-sm font-semibold" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Thumbnail URL</label>
                      <input type="text" value={video.image} onChange={(e) => updateVideo(i, 'image', e.target.value)} className="w-full px-3 py-2 border-b border-gray-100 outline-none text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">YouTube Embed URL</label>
                      <input type="text" value={video.url} onChange={(e) => updateVideo(i, 'url', e.target.value)} className="w-full px-3 py-2 border-b border-gray-100 outline-none text-xs" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReviewsCMS;
