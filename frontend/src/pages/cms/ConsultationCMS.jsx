import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Save, Phone, Clock, FileText, Image as ImageIcon, Settings } from 'lucide-react';

const ConsultationCMS = () => {
  const [data, setData] = useState({
    enabled: true,
    badgeText: '',
    heading: '',
    subtitle: '',
    phoneNumber: '',
    serviceTimingMonSat: '',
    serviceTimingSunday: '',
    namePlaceholder: '',
    emailPlaceholder: '',
    messagePlaceholder: '',
    serviceOptions: [],
    buttonText: '',
    beforeImage: '',
    backgroundColor: '#ffffff'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/consultation`);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to fetch consultation data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/consultation`, data);
      toast.success('Changes saved and published!');
    } catch (err) {
      toast.error('Failed to save changes');
    }
  };

  const addOption = () => {
    setData({ ...data, serviceOptions: [...data.serviceOptions, 'New Option'] });
  };

  const updateOption = (index, value) => {
    const newOptions = [...data.serviceOptions];
    newOptions[index] = value;
    setData({ ...data, serviceOptions: newOptions });
  };

  const removeOption = (index) => {
    setData({ ...data, serviceOptions: data.serviceOptions.filter((_, i) => i !== index) });
  };

  if (loading) return <div className="p-8">Loading Consultation Editor...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Consultation Form Editor</h1>
            <p className="text-gray-500">Customize form fields, contact info, and timing</p>
          </div>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            <Save size={20} />
            Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: General & Contact */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Settings size={24} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">General Settings</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Badge Text</label>
                  <input type="text" value={data.badgeText} onChange={(e) => setData({ ...data, badgeText: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Main Heading</label>
                  <input type="text" value={data.heading} onChange={(e) => setData({ ...data, heading: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input type="text" value={data.subtitle} onChange={(e) => setData({ ...data, subtitle: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <Phone size={24} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Contact & Timing</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input type="text" value={data.phoneNumber} onChange={(e) => setData({ ...data, phoneNumber: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mon-Sat Timing</label>
                  <input type="text" value={data.serviceTimingMonSat} onChange={(e) => setData({ ...data, serviceTimingMonSat: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sunday Timing</label>
                  <input type="text" value={data.serviceTimingSunday} onChange={(e) => setData({ ...data, serviceTimingSunday: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form Fields & Options */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                  <FileText size={24} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Form Fields</h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name Placeholder</label>
                    <input type="text" value={data.namePlaceholder} onChange={(e) => setData({ ...data, namePlaceholder: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Placeholder</label>
                    <input type="text" value={data.emailPlaceholder} onChange={(e) => setData({ ...data, emailPlaceholder: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message Placeholder</label>
                  <input type="text" value={data.messagePlaceholder} onChange={(e) => setData({ ...data, messagePlaceholder: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Submit Button Text</label>
                  <input type="text" value={data.buttonText} onChange={(e) => setData({ ...data, buttonText: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                
                {/* Service Options */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Service Dropdown Options</label>
                    <button onClick={addOption} className="text-xs text-indigo-600">+ Add Option</button>
                  </div>
                  <div className="space-y-2">
                    {data.serviceOptions.map((opt, i) => (
                      <div key={i} className="flex gap-2">
                        <input type="text" value={opt} onChange={(e) => updateOption(i, e.target.value)} className="flex-1 px-4 py-2 rounded-lg border border-gray-100 text-sm outline-none" />
                        <button onClick={() => removeOption(i)} className="text-red-400">×</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <ImageIcon size={24} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Visuals</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bottom Image URL</label>
                  <input type="text" value={data.beforeImage} onChange={(e) => setData({ ...data, beforeImage: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section Background Color</label>
                  <div className="flex gap-3 items-center">
                    <input type="color" value={data.backgroundColor} onChange={(e) => setData({ ...data, backgroundColor: e.target.value })} className="h-10 w-20 rounded cursor-pointer" />
                    <span className="text-gray-500 font-mono text-sm uppercase">{data.backgroundColor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationCMS;
