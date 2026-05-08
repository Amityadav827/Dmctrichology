import React, { useState, useEffect } from 'react';
import axios from '../../api/client';
import { toast } from 'react-hot-toast';

const PressMediaCMS = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: res } = await axios.get('/press-media');
      if (res.success) setData(res.data);
    } catch (error) {
      toast.error('Error fetching press media');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const { data: res } = await axios.put('/press-media', data);
      if (res.success) toast.success('Press & Media updated');
    } catch (error) {
      toast.error('Error updating press media');
    }
  };

  const handleListChange = (key, index, field, value) => {
    const newList = [...data[key]];
    newList[index][field] = value;
    setData({ ...data, [key]: newList });
  };

  const addItem = (key, defaultObj) => {
    setData({ ...data, [key]: [...data[key], { ...defaultObj, id: Date.now().toString() }] });
  };

  const removeItem = (key, index) => {
    const newList = [...data[key]];
    newList.splice(index, 1);
    setData({ ...data, [key]: newList });
  };

  if (loading) return <div className="p-8">Loading Press & Media...</div>;
  if (!data) return <div className="p-8 text-red-500">Error loading data.</div>;

  return (
    <div className="p-8 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Press & Media CMS</h2>
        <button onClick={handleUpdate} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Main Content</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
            <input type="text" value={data.heading} onChange={(e) => setData({...data, heading: e.target.value})} className="w-full p-2 border rounded" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating Text</label>
              <input type="text" value={data.ratingText} onChange={(e) => setData({...data, ratingText: e.target.value})} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient Count Text</label>
              <input type="text" value={data.patientCountText} onChange={(e) => setData({...data, patientCountText: e.target.value})} className="w-full p-2 border rounded" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
              <input type="text" value={data.button.text} onChange={(e) => setData({...data, button: {...data.button, text: e.target.value}})} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
              <input type="text" value={data.button.link} onChange={(e) => setData({...data, button: {...data.button, link: e.target.value}})} className="w-full p-2 border rounded" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-semibold text-gray-700">Patient Avatars</h3>
            <button onClick={() => addItem('avatars', { image: '' })} className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
              Add Avatar
            </button>
          </div>
          <div className="space-y-4">
            {data.avatars.map((avatar, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded border">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 border">
                  {avatar.image && <img src={avatar.image} alt="Avatar" className="w-full h-full object-cover" />}
                </div>
                <input type="text" value={avatar.image} onChange={(e) => handleListChange('avatars', idx, 'image', e.target.value)} placeholder="Avatar Image URL" className="flex-1 p-2 border rounded text-sm" />
                <button onClick={() => removeItem('avatars', idx)} className="text-red-500 hover:text-red-700">Remove</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-semibold text-gray-700">Media Logos Slider</h3>
          <button onClick={() => addItem('mediaLogos', { title: '', image: '', link: '#' })} className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
            Add Media Logo
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.mediaLogos.map((logo, idx) => (
            <div key={idx} className="p-4 border rounded bg-gray-50 space-y-3">
              <div className="h-16 flex items-center justify-center bg-white border rounded p-2">
                {logo.image && <img src={logo.image} alt={logo.title} className="max-h-full object-contain" />}
              </div>
              <input type="text" value={logo.title} onChange={(e) => handleListChange('mediaLogos', idx, 'title', e.target.value)} placeholder="Logo Title" className="w-full p-2 border rounded text-sm" />
              <input type="text" value={logo.image} onChange={(e) => handleListChange('mediaLogos', idx, 'image', e.target.value)} placeholder="Logo Image URL" className="w-full p-2 border rounded text-sm" />
              <input type="text" value={logo.link} onChange={(e) => handleListChange('mediaLogos', idx, 'link', e.target.value)} placeholder="Logo Redirect URL" className="w-full p-2 border rounded text-sm" />
              <button onClick={() => removeItem('mediaLogos', idx)} className="w-full text-red-500 hover:text-red-700 text-sm font-medium">Remove Logo</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PressMediaCMS;
