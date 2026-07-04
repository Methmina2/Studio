import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await api.get('/contact');
        setContacts(res.data.data);
      } catch (err) {
        console.error('Failed to fetch contacts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  return (
    <AdminLayout>
      <h1 className="font-serif text-3xl font-bold text-white mb-6">Contact Messages</h1>
      {loading ? (
        <div className="text-zinc-400">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 px-4 text-zinc-500 text-sm font-medium">Name</th>
                <th className="text-left py-3 px-4 text-zinc-500 text-sm font-medium">Email</th>
                <th className="text-left py-3 px-4 text-zinc-500 text-sm font-medium">Subject</th>
                <th className="text-left py-3 px-4 text-zinc-500 text-sm font-medium">Message</th>
                <th className="text-left py-3 px-4 text-zinc-500 text-sm font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact._id} className="border-b border-zinc-800 hover:bg-white/5">
                  <td className="py-3 px-4 text-white">{contact.name}</td>
                  <td className="py-3 px-4 text-zinc-400">{contact.email}</td>
                  <td className="py-3 px-4 text-zinc-400">{contact.subject || 'N/A'}</td>
                  <td className="py-3 px-4 text-zinc-400 max-w-xs truncate">{contact.message}</td>
                  <td className="py-3 px-4 text-zinc-400">{new Date(contact.createdAt).toDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminContacts;