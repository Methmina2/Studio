import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import { buildImageUrl } from '../../utils/buildImageUrl';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', price: '', imageUrls: [] });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get('/services');
      setServices(res.data.data);
    } catch (err) {
      console.error('Failed to fetch services', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditing(service.type);
    setFormData({
      title: service.title,
      description: service.description || '',
      price: service.price || '',
      imageUrls: service.imageUrls || [],
    });
    setSelectedImage(null);
    setImagePreview(service.imageUrls?.[0] ? buildImageUrl(service.imageUrls[0]) : '');
  };

  const handleSave = async (type) => {
    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('price', formData.price);
      if (selectedImage) {
        payload.append('image', selectedImage);
      }

      await api.put(`/services/${type}`, payload);

      setSelectedImage(null);
      setImagePreview('');
      fetchServices();
      setEditing(null);
    } catch (err) {
      console.error('Failed to update service', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedImage(null);
      setImagePreview('');
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <AdminLayout>
      <h1 className="font-serif text-3xl font-bold text-white mb-6">Services</h1>
      {loading ? (
        <div className="text-zinc-400">Loading...</div>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.type} className="bg-studio-surface border border-zinc-800 rounded-xl p-6">
              {editing === service.type ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#de660e]"
                    placeholder="Title"
                  />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#de660e]"
                    placeholder="Description"
                    rows="3"
                  />
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#de660e]"
                    placeholder="Price (e.g., From $1,200)"
                  />
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-300">Service Image</label>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Service preview"
                        className="h-32 w-full object-cover rounded-lg border border-zinc-700"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#de660e] file:text-black hover:file:bg-[#ff7f2c]"
                    />
                    <p className="text-xs text-zinc-500">Upload a new image for this service card.</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleSave(service.type)}
                      className="bg-[#de660e] text-black px-6 py-2 rounded-full font-semibold hover:bg-[#ff7f2c] transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="border border-zinc-700 text-zinc-400 px-6 py-2 rounded-full hover:bg-white/5 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white capitalize">{service.title}</h3>
                    <p className="text-zinc-400 text-sm mt-1">{service.description}</p>
                    <p className="text-[#de660e] text-sm mt-1">{service.price}</p>
                    <p className="text-zinc-500 text-xs mt-1">Type: {service.type}</p>
                  </div>
                  {service.imageUrls?.[0] && (
                    <img
                      src={buildImageUrl(service.imageUrls[0])}
                      alt={service.title}
                      className="h-24 w-36 object-cover rounded-lg border border-zinc-700"
                    />
                  )}
                  <button
                    onClick={() => handleEdit(service)}
                    className="bg-white/10 text-zinc-400 hover:text-white px-4 py-2 rounded-lg text-sm transition"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminServices;
