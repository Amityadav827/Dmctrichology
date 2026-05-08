import React, { useState, useEffect } from 'react';
import axios from '../../api/client';
import { toast } from 'react-hot-toast';
import { Save, Plus, Trash2, Layout, FileText, User } from 'lucide-react';

const SurgeonsCMS = () => {
  const [data, setData] = useState({
    enabled: true,
    badgeText: '',
    heading: '',
    surgeons: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: res } = await axios.get('/surgeons');
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      toast.error('Failed to fetch surgeons data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put('/surgeons', data);
      toast.success('Changes saved and published!');
    } catch (err) {
      toast.error('Failed to save changes');
    }
  };

  const updateSurgeon = (index, field, value) => {
    const newSurgeons = [...data.surgeons];
    newSurgeons[index][field] = value;
    setData({ ...data, surgeons: newSurgeons });
  };

  const addSurgeon = () => {
    setData({
      ...data,
      surgeons: [...data.surgeons, { name: 'New Surgeon', role: '', image: '', features: [], buttonText: 'Get Details', buttonLink: '#' }]
    });
  };

  const removeSurgeon = (index) => {
    const newSurgeons = data.surgeons.filter((_, i) => i !== index);
    setData({ ...data, surgeons: newSurgeons });
  };

  const addFeature = (sIndex) => {
    const newSurgeons = [...data.surgeons];
    newSurgeons[sIndex].features = [...(newSurgeons[sIndex].features || []), 'New Feature'];
    setData({ ...data, surgeons: newSurgeons });
  };

  const updateFeature = (sIndex, fIndex, value) => {
    const newSurgeons = [...data.surgeons];
    newSurgeons[sIndex].features[fIndex] = value;
    setData({ ...data, surgeons: newSurgeons });
  };

  const removeFeature = (sIndex, fIndex) => {
    const newSurgeons = [...data.surgeons];
    newSurgeons[sIndex].features = newSurgeons[sIndex].features.filter((_, i) => i !== fIndex);
    setData({ ...data, surgeons: newSurgeons });
  };

  if (loading) return <div className="p-8">Loading Surgeons Editor...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Surgeons Section Editor</h1>
            <p className="text-gray-500">Manage your surgeon profiles and descriptions</p>
          </div>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            <Save size={20} />
            Save Changes
          </button>
        </div>

        {/* Global Settings */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Layout size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Section Header</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Badge Text</label>
              <input 
                type="text" 
                value={data.badgeText}
                onChange={(e) => setData({ ...data, badgeText: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Heading</label>
              <input 
                type="text" 
                value={data.heading}
                onChange={(e) => setData({ ...data, heading: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              />
            </div>
          </div>
        </div>

        {/* Surgeons List */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Surgeon Cards</h2>
            <button 
              onClick={addSurgeon}
              className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-all"
            >
              <Plus size={18} />
              Add Surgeon
            </button>
          </div>

          {data.surgeons.map((surgeon, sIndex) => (
            <div key={sIndex} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                    <User size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Surgeon #{sIndex + 1}</h3>
                </div>
                <button 
                  onClick={() => removeSurgeon(sIndex)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input 
                    type="text" 
                    value={surgeon.name}
                    onChange={(e) => updateSurgeon(sIndex, 'name', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Designation / Role</label>
                  <input 
                    type="text" 
                    value={surgeon.role}
                    onChange={(e) => updateSurgeon(sIndex, 'role', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input 
                    type="text" 
                    value={surgeon.image}
                    onChange={(e) => updateSurgeon(sIndex, 'image', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Features List */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">Specialties / Features</label>
                  <button 
                    onClick={() => addFeature(sIndex)}
                    className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded"
                  >
                    + Add Specialty
                  </button>
                </div>
                <div className="space-y-3">
                  {(surgeon.features || []).map((feature, fIndex) => (
                    <div key={fIndex} className="flex gap-2">
                      <input 
                        type="text" 
                        value={feature}
                        onChange={(e) => updateFeature(sIndex, fIndex, e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                      />
                      <button onClick={() => removeFeature(sIndex, fIndex)} className="text-red-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                  <input 
                    type="text" 
                    value={surgeon.buttonText}
                    onChange={(e) => updateSurgeon(sIndex, 'buttonText', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                  <input 
                    type="text" 
                    value={surgeon.buttonLink}
                    onChange={(e) => updateSurgeon(sIndex, 'buttonLink', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SurgeonsCMS;
