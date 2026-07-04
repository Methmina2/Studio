import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';

const emptyForm = {
  name: '',
  role: '',
  bio: '',
  specialties: '',
  featured: false,
  order: 0,
};

const buildImageUrl = (image) => {
  if (!image) return '';
  if (/^https?:\/\//i.test(image)) return image;
  const normalizedImage = image.startsWith('/') ? image : `/${image}`;
  const isBackendUpload = normalizedImage.startsWith('/uploads/');
  if (!isBackendUpload) return normalizedImage;
  const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace(/\/api\/?$/, '');
  return `${baseUrl}${normalizedImage}`;
};

const AdminCrew = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchCrew();
  }, []);

  const fetchCrew = async () => {
    try {
      const res = await api.get('/crew');
      setMembers(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch crew', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedImage(null);
      setPreview('');
      return;
    }
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setEditingMember(null);
    setSelectedImage(null);
    setPreview('');
  };

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    window.setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('role', formData.role);
      payload.append('bio', formData.bio);
      payload.append('specialties', JSON.stringify(formData.specialties.split(',').map((s) => s.trim()).filter(Boolean)));
      payload.append('featured', formData.featured ? 'true' : 'false');
      payload.append('order', formData.order);
      if (selectedImage) payload.append('image', selectedImage);

      if (editingId) {
        await api.put(`/crew/${editingId}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
        showFeedback('success', 'Crew member updated successfully.');
      } else {
        await api.post('/crew', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
        showFeedback('success', 'Crew member added successfully.');
      }
      resetForm();
      fetchCrew();
    } catch (err) {
      console.error('Failed to save crew member', err);
      showFeedback('error', 'Could not save crew member.');
    }
  };

  const handleEdit = (member) => {
    setEditingId(member._id);
    setEditingMember(member);
    setFormData({
      name: member.name || '',
      role: member.role || '',
      bio: member.bio || '',
      specialties: Array.isArray(member.specialties) ? member.specialties.join(', ') : '',
      featured: Boolean(member.featured),
      order: member.order || 0,
    });
    setPreview(member.image ? buildImageUrl(member.image) : '');
    setSelectedImage(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this crew member?')) return;
    try {
      await api.delete(`/crew/${id}`);
      fetchCrew();
      showFeedback('success', 'Crew member deleted successfully.');
    } catch (err) {
      console.error('Failed to delete crew member', err);
      showFeedback('error', 'Could not delete crew member.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-white">Crew Members</h1>
            <p className="text-zinc-400 mt-1">Manage names, bios, specialties, images and featured ordering.</p>
          </div>
        </div>

        {feedback.message && (
          <div className={`rounded-lg border px-4 py-3 text-sm ${feedback.type === 'success' ? 'border-[#de660e]/40 bg-[#de660e]/10 text-[#ffb07a]' : 'border-red-500/40 bg-red-500/10 text-red-300'}`}>
            {feedback.message}
          </div>
        )}

        {editingId && (
          <div className="rounded-lg border border-[#de660e]/40 bg-[#de660e]/10 p-4 text-sm text-[#ffb07a]">
            Editing profile for <span className="font-semibold text-white">{editingMember?.name || formData.name || 'selected member'}</span>. Select a new image only if you want to replace the current one.
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-studio-surface border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-300 mb-1">Name</label>
              <input name="name" value={formData.name} onChange={handleChange} required className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#de660e]" />
            </div>
            <div>
              <label className="block text-sm text-zinc-300 mb-1">Role</label>
              <input name="role" value={formData.role} onChange={handleChange} className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#de660e]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-zinc-300 mb-1">Bio</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} required rows="3" className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#de660e]" />
            </div>
            <div>
              <label className="block text-sm text-zinc-300 mb-1">Specialties (comma separated)</label>
              <input name="specialties" value={formData.specialties} onChange={handleChange} className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#de660e]" />
            </div>
            <div>
              <label className="block text-sm text-zinc-300 mb-1">Display Order</label>
              <input type="number" name="order" value={formData.order} onChange={handleChange} className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#de660e]" />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="accent-[#de660e]" />
                Featured member (shown prominently)
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-zinc-300 mb-1">Profile Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#de660e] file:text-black hover:file:bg-[#ff7f2c]" />
              {editingId && !selectedImage && preview && (
                <p className="text-xs text-zinc-500 mt-2">Current image shown below. Upload a new one to replace it.</p>
              )}
              {selectedImage && (
                <p className="text-xs text-zinc-500 mt-2">New image preview below. This will replace the current image on save.</p>
              )}
              {preview && <img src={preview} alt="Preview" className="mt-3 h-32 w-full object-cover rounded-lg border border-zinc-700" />}
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-[#de660e] text-black px-6 py-2 rounded-full font-semibold hover:bg-[#ff7f2c] transition">{editingId ? 'Update Member' : 'Add Member'}</button>
            <button type="button" onClick={resetForm} className="border border-zinc-700 text-zinc-400 px-6 py-2 rounded-full hover:bg-white/5 transition">Cancel</button>
          </div>
        </form>

        <div className="space-y-3">
          {loading ? (
            <div className="text-zinc-400">Loading crew...</div>
          ) : members.length === 0 ? (
            <div className="text-zinc-400">No crew members yet.</div>
          ) : (
            members.map((member) => (
              <div key={member._id} className="bg-studio-surface border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex gap-4 items-center">
                  {member.image && <img src={buildImageUrl(member.image)} alt={member.name} className="h-16 w-16 object-cover rounded-full border border-zinc-700" />}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{member.name}</h3>
                      {member.featured && <span className="text-[10px] uppercase tracking-widest bg-[#de660e] text-black px-2 py-1 rounded-full">Featured</span>}
                    </div>
                    <p className="text-sm text-[#de660e]">{member.role || 'Team Member'}</p>
                    <p className="text-sm text-zinc-400 line-clamp-2">{member.bio}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(member)} className="border border-zinc-700 text-zinc-300 px-4 py-2 rounded-full hover:bg-white/5 transition">Edit</button>
                  <button onClick={() => handleDelete(member._id)} className="bg-red-600/80 text-white px-4 py-2 rounded-full hover:bg-red-600 transition">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCrew;
