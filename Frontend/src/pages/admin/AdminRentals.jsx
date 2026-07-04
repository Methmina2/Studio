import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

// Predefined category list
const CATEGORIES = [
  'Camera',
  'Lens',
  'Drone',
  'Gimbal',
  'Audio',
  'Lighting',
  'Modifier',
  'Tripod',
  'Monitor',
  'Streaming',
  'Battery',
  'Photobooth',
  'Accessories',
];

const AdminRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    pricePerDay: '',
    description: '',
    specs: '',
    available: true,
    imageFile: null,
    existingImage: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchRentals = async () => {
    try {
      const res = await api.get('/rentals');
      setRentals(res.data.data);
    } catch (err) {
      console.error('Failed to fetch rentals', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const handleAdd = () => {
    setIsAdding(true);
    setEditing(null);
    setFormData({ name: '', category: '', pricePerDay: '', description: '', specs: '', available: true, imageFile: null, existingImage: '' });
  };

  const handleEdit = (rental) => {
    setIsAdding(false);
    setEditing(rental._id);
    setFormData({
      name: rental.name,
      category: rental.category,
      pricePerDay: rental.pricePerDay.toString(),
      description: rental.description || '',
      specs: rental.specs ? rental.specs.join('\n') : '',
      available: rental.available,
      imageFile: null,
      existingImage: rental.image || '',
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData((prev) => ({ ...prev, imageFile: files[0] }));
    } else if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.category || !formData.pricePerDay) {
      alert('Please fill in all required fields (Name, Category, Price)');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('category', formData.category);
      data.append('pricePerDay', formData.pricePerDay);
      data.append('description', formData.description);
      data.append('specs', JSON.stringify(formData.specs.split('\n').filter(s => s.trim())));
      data.append('available', formData.available);
      if (formData.imageFile) {
        data.append('image', formData.imageFile);
      }

      if (isAdding) {
        await api.post('/rentals', data);
      } else {
        await api.put(`/rentals/${editing}`, data);
      }

      await fetchRentals();
      handleCancel();
    } catch (err) {
      console.error('Failed to save rental', err);
      alert('Save failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/rentals/${id}`);
        fetchRentals();
      } catch (err) {
        console.error('Failed to delete rental', err);
        alert('Delete failed. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditing(null);
    setFormData({ name: '', category: '', pricePerDay: '', description: '', specs: '', available: true, imageFile: null, existingImage: '' });
  };

  const handleToggleAvailability = async (rental, nextAvailability) => {
    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('name', rental.name);
      data.append('category', rental.category);
      data.append('pricePerDay', rental.pricePerDay);
      data.append('description', rental.description || '');
      data.append('specs', JSON.stringify(rental.specs || []));
      data.append('available', nextAvailability);
      await api.put(`/rentals/${rental._id}`, data);
      await fetchRentals();
    } catch (err) {
      console.error('Failed to update availability', err);
      alert('Could not update availability. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-3xl font-bold text-white">Rental Equipment</h1>
        <button
          onClick={handleAdd}
          className="bg-yellow-500 text-black px-4 py-2 rounded-full font-semibold hover:bg-yellow-400 transition flex items-center gap-2"
        >
          <FaPlus size={14} /> Add Item
        </button>
      </div>

      {(isAdding || editing) && (
        <div className="bg-studio-surface border border-zinc-800 rounded-xl p-6 mb-6">
          <h2 className="font-serif text-xl font-bold text-white mb-4">{isAdding ? 'Add New Rental Item' : 'Edit Rental Item'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                placeholder="Sony A7 IV"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Price Per Day (LKR) *</label>
              <input
                type="number"
                name="pricePerDay"
                value={formData.pricePerDay}
                onChange={handleChange}
                className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                placeholder="9500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Available</label>
              <label className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  className="w-4 h-4 accent-yellow-500"
                />
                <span className="text-zinc-400 text-sm">Yes, this item is available for rent</span>
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="2"
                className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                placeholder="Describe the equipment..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-1">Specs (one per line)</label>
              <textarea
                name="specs"
                value={formData.specs}
                onChange={handleChange}
                rows="3"
                className="w-full bg-absolute-black border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                placeholder="33MP Sensor&#10;4K 60fps&#10;IBIS"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-1">Image</label>
              <input
                type="file"
                name="imageFile"
                accept="image/*"
                onChange={handleChange}
                className="w-full text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-yellow-500 file:text-black file:font-semibold hover:file:bg-yellow-400"
              />
              {formData.existingImage && (
                <div className="mt-2">
                  <p className="text-xs text-zinc-500">Current image:</p>
                  <img src={formData.existingImage} alt="Current" className="w-20 h-20 object-cover rounded-lg border border-zinc-700 mt-1" />
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSave}
              disabled={submitting}
              className="bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-400 transition disabled:opacity-50"
            >
              {submitting ? 'Saving...' : isAdding ? 'Add Item' : 'Save Changes'}
            </button>
            <button
              onClick={handleCancel}
              className="border border-zinc-700 text-zinc-400 px-6 py-2 rounded-full hover:bg-white/5 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-zinc-400">Loading...</div>
      ) : rentals.length === 0 ? (
        <div className="text-zinc-400 text-center py-12 bg-studio-surface border border-zinc-800 rounded-xl">
          <p className="text-lg">No rental items yet.</p>
          <p className="text-sm mt-1">Click "Add Item" to create your first rental equipment.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 px-4 text-zinc-500 text-sm font-medium">Image</th>
                <th className="text-left py-3 px-4 text-zinc-500 text-sm font-medium">Name</th>
                <th className="text-left py-3 px-4 text-zinc-500 text-sm font-medium">Category</th>
                <th className="text-left py-3 px-4 text-zinc-500 text-sm font-medium">Price/Day</th>
                <th className="text-left py-3 px-4 text-zinc-500 text-sm font-medium">Available</th>
                <th className="text-left py-3 px-4 text-zinc-500 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((item) => (
                <tr key={item._id} className="border-b border-zinc-800 hover:bg-white/5">
                  <td className="py-3 px-4">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg border border-zinc-700" />
                    ) : (
                      <div className="w-12 h-12 bg-zinc-800 rounded-lg border border-zinc-700" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-white">{item.name}</td>
                  <td className="py-3 px-4 text-zinc-400">{item.category}</td>
                  <td className="py-3 px-4 text-yellow-500">LKR {item.pricePerDay.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <select
                      value={item.available ? 'available' : 'unavailable'}
                      onChange={(e) => handleToggleAvailability(item, e.target.value === 'available')}
                      disabled={submitting}
                      className="bg-absolute-black border border-zinc-700 text-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:border-yellow-500"
                    >
                      <option value="available">Available</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-zinc-400 hover:text-yellow-500 transition"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-zinc-400 hover:text-red-400 transition"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminRentals;