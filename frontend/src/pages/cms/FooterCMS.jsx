import React, { useState, useEffect } from 'react';
import axios from '../../api/client';
import { toast } from 'react-hot-toast';

const FooterCMS = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: res } = await axios.get('/footer');
      if (res.success) setData(res.data);
    } catch (error) {
      toast.error('Error fetching footer');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const { data: res } = await axios.put('/footer', data);
      if (res.success) toast.success('Footer updated');
    } catch (error) {
      toast.error('Error updating footer');
    }
  };

  const handleLinkChange = (colIdx, linkIdx, field, value) => {
    const newColumns = [...data.columns];
    newColumns[colIdx].links[linkIdx][field] = value;
    setData({ ...data, columns: newColumns });
  };

  const addLink = (colIdx) => {
    const newColumns = [...data.columns];
    newColumns[colIdx].links.push({ id: Date.now().toString(), label: 'New Link', url: '#' });
    setData({ ...data, columns: newColumns });
  };

  const removeLink = (colIdx, linkIdx) => {
    const newColumns = [...data.columns];
    newColumns[colIdx].links.splice(linkIdx, 1);
    setData({ ...data, columns: newColumns });
  };

  if (loading) return <div className="p-8">Loading Footer CMS...</div>;
  if (!data) return <div className="p-8 text-red-500">Error loading data.</div>;

  return (
    <div className="p-8 bg-white rounded-lg shadow max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Footer CMS</h2>
        <button onClick={handleUpdate} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          Save Changes
        </button>
      </div>

      <div className="space-y-12">
        
        {/* Navigation Columns */}
        <section>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Navigation Columns</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.columns.map((col, cIdx) => (
              <div key={cIdx} className="p-4 bg-gray-50 border rounded-lg">
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Column Title</label>
                  <input type="text" value={col.title} onChange={(e) => {
                    const newColumns = [...data.columns];
                    newColumns[cIdx].title = e.target.value;
                    setData({...data, columns: newColumns});
                  }} className="w-full p-2 border rounded" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-500 uppercase">Links</label>
                    <button onClick={() => addLink(cIdx)} className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Add Link</button>
                  </div>
                  {col.links.map((link, lIdx) => (
                    <div key={lIdx} className="flex gap-2 items-center bg-white p-2 border rounded shadow-sm">
                      <input type="text" value={link.label} onChange={(e) => handleLinkChange(cIdx, lIdx, 'label', e.target.value)} placeholder="Label" className="flex-1 p-1 text-sm border rounded" />
                      <input type="text" value={link.url} onChange={(e) => handleLinkChange(cIdx, lIdx, 'url', e.target.value)} placeholder="URL" className="flex-1 p-1 text-sm border rounded" />
                      <button onClick={() => removeLink(cIdx, lIdx)} className="text-red-500 hover:text-red-700 text-sm">×</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Details */}
        <section>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 border rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
              <input type="text" value={data.contact.heading} onChange={(e) => setData({...data, contact: {...data.contact, heading: e.target.value}})} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="text" value={data.contact.email} onChange={(e) => setData({...data, contact: {...data.contact, email: e.target.value}})} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
              <input type="text" value={data.contact.address1} onChange={(e) => setData({...data, contact: {...data.contact, address1: e.target.value}})} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
              <input type="text" value={data.contact.address2} onChange={(e) => setData({...data, contact: {...data.contact, address2: e.target.value}})} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone 1</label>
              <input type="text" value={data.contact.phone1} onChange={(e) => setData({...data, contact: {...data.contact, phone1: e.target.value}})} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone 2</label>
              <input type="text" value={data.contact.phone2} onChange={(e) => setData({...data, contact: {...data.contact, phone2: e.target.value}})} className="w-full p-2 border rounded" />
            </div>
          </div>
        </section>

        {/* Newsletter & Branding */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Newsletter Card</h3>
            <div className="p-4 bg-gray-50 border rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
                <input type="text" value={data.newsletter.heading} onChange={(e) => setData({...data, newsletter: {...data.newsletter, heading: e.target.value}})} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={data.newsletter.description} onChange={(e) => setData({...data, newsletter: {...data.newsletter, description: e.target.value}})} className="w-full p-2 border rounded h-20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                  <input type="text" value={data.newsletter.buttonText} onChange={(e) => setData({...data, newsletter: {...data.newsletter, buttonText: e.target.value}})} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
                  <input type="text" value={data.newsletter.placeholder} onChange={(e) => setData({...data, newsletter: {...data.newsletter, placeholder: e.target.value}})} className="w-full p-2 border rounded" />
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Branding Area</h3>
            <div className="p-4 bg-gray-50 border rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Footer Logo URL</label>
                <input type="text" value={data.branding.logo} onChange={(e) => setData({...data, branding: {...data.branding, logo: e.target.value}})} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">About Text</label>
                <textarea value={data.branding.aboutText} onChange={(e) => setData({...data, branding: {...data.branding, aboutText: e.target.value}})} className="w-full p-2 border rounded h-24" />
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Footer */}
        <section>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Disclaimer & Bottom Footer</h3>
          <div className="p-4 bg-gray-50 border rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Disclaimer Text</label>
              <textarea value={data.disclaimer} onChange={(e) => setData({...data, disclaimer: e.target.value})} className="w-full p-2 border rounded h-20" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Text</label>
                <input type="text" value={data.bottomFooter.copyright} onChange={(e) => setData({...data, bottomFooter: {...data.bottomFooter, copyright: e.target.value}})} className="w-full p-2 border rounded" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Terms Label</label>
                  <input type="text" value={data.bottomFooter.termsText} onChange={(e) => setData({...data, bottomFooter: {...data.bottomFooter, termsText: e.target.value}})} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Privacy Label</label>
                  <input type="text" value={data.bottomFooter.privacyText} onChange={(e) => setData({...data, bottomFooter: {...data.bottomFooter, privacyText: e.target.value}})} className="w-full p-2 border rounded" />
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default FooterCMS;
