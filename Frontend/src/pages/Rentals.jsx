import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RentalCard from '../components/ui/RentalCard';
import Layout from '../components/layout/Layout';
import { FaShoppingCart } from 'react-icons/fa';
import api from '../services/api';

// Define category order for display
const categoryOrder = [
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

const Rentals = () => {
  const navigate = useNavigate();
  const [rentalItems, setRentalItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await api.get('/rentals');
        setRentalItems(res.data.data || []);
      } catch (err) {
        console.error('Failed to load rentals', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  // Group items by category
  const groupedItems = rentalItems.reduce((groups, item) => {
    const category = item.category || 'Other';
    if (!groups[category]) groups[category] = [];
    groups[category].push(item);
    return groups;
  }, {});

  // Sort categories by the defined order
  const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const selectedItems = rentalItems.filter(item => selectedIds.includes(item._id || item.id));
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.pricePerDay, 0);
  const totalFormatted = totalPrice.toLocaleString('en-US');

  const handleProceed = () => {
    if (selectedItems.length === 0) return;
    navigate('/rental-application', { state: { selectedItems } });
  };

  const clearSelection = () => setSelectedIds([]);

  return (
    <Layout>
      <div className="pt-24 pb-16 px-4 bg-absolute-black min-h-screen">
        <div className="watermark display-font">RENTALS</div>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-white uppercase">
                Camera Rentals
              </h1>
              <p className="font-sans text-zinc-400 mt-2 uppercase">
                Select the equipment you need for your project.
              </p>
            </div>
            {selectedItems.length > 0 && (
              <div className="bg-studio-surface border border-zinc-800 rounded-xl p-4 shadow-lg">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4 text-white">
                    <FaShoppingCart className="text-[#00FFFF]" />
                    <span className="font-bold">{selectedItems.length}</span>
                    <span className="text-zinc-400 text-sm uppercase">items</span>
                    <span className="text-[#00FFFF] font-bold">LKR {totalFormatted}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={clearSelection}
                      className="border border-zinc-700 text-zinc-300 px-5 py-2 rounded-full hover:bg-white/5 transition uppercase"
                    >
                      Clear Selection
                    </button>
                    <button
                      onClick={handleProceed}
                      className="text-black px-6 py-2 rounded-full font-bold hover:bg-[#ff7f2c] transition uppercase"
                      style={{ background: '#de660e' }}
                    >
                      Proceed to Application
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-zinc-400 uppercase">Loading rentals...</div>
          ) : (
            <>
              {/* Category sections */}
              {sortedCategories.map((category, idx) => {
                const items = groupedItems[category];
                return (
                  <div key={category} className="mb-12">
                    {/* Category header */}
                    <div
                      className="flex items-center gap-4 mb-6"
                      data-aos="fade-right"
                      data-aos-duration="250"
                      data-aos-delay={idx * 20}
                    >
                      <h2 className="font-serif text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">
                        {category}
                      </h2>
                      <div className="flex-1 h-px bg-gradient-to-r from-[#de660e]/50 to-transparent"></div>
                      <span className="text-sm text-zinc-500 font-sans uppercase">
                        {items.length} items
                      </span>
                    </div>

                    {/* Cards grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {items.map((item) => (
                        <RentalCard
                          key={item._id || item.id}
                          {...item}
                          id={item._id || item.id}
                          isSelected={selectedIds.includes(item._id || item.id)}
                          onToggleSelect={toggleSelect}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Rentals;