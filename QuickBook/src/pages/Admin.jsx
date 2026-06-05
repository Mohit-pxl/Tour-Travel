import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, BookOpen, Plus, Edit2, Trash2,
  Loader2, X, CheckCircle2, XCircle, AlertCircle, TrendingUp,
  Users, IndianRupee, Star, Settings
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { apiFetch, apiGet } from '../services/api';

const TOUR_TYPES = ['Cultural', 'Relaxation', 'Adventure', 'Wildlife'];

const TourFormModal = ({ tour, onClose, onSave }) => {
  const { getToken } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(tour?.image || '');
  const [form, setForm] = useState({
    title: tour?.title || '',
    location: tour?.location || '',
    duration: tour?.duration || '',
    tourType: tour?.tourType || 'Cultural',
    price: tour?.price || '',
    rating: tour?.rating || 4.5,
    reviews: tour?.reviews || 0,
    image: tour?.image || '',
    description: tour?.description || '',
    facilities: tour?.facilities?.join(', ') || '',
    isActive: tour?.isActive !== false,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = form.image;
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        const uploadRes = await apiFetch('/admin/upload', getToken, {
          method: 'POST',
          body: formData,
        });
        imageUrl = uploadRes.data.url;
      } else if (!imageUrl) {
        toast.error('Please select an image');
        return;
      }

      await onSave({
        ...form,
        image: imageUrl,
        price: Number(form.price),
        rating: Number(form.rating),
        reviews: Number(form.reviews),
        facilities: form.facilities.split(',').map(f => f.trim()).filter(Boolean),
        images: [imageUrl],
      });
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setSaving(false);
    }
  };

  const field = (label, key, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
        required={['title', 'location', 'duration', 'price', 'image', 'description'].includes(key)}
      />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">{tour ? 'Edit Tour' : 'Add New Tour'}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {field('Tour Title', 'title', 'text', 'e.g. Goa Beach Escape')}
            {field('Location', 'location', 'text', 'e.g. Goa, India')}
            {field('Duration', 'duration', 'text', 'e.g. 5 Days / 4 Nights')}
            <div className="col-span-2 grid grid-cols-2 gap-4">
              {field('Price (₹ per person)', 'price', 'number', '15000')}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Rating & Reviews</label>
                <div className="w-full px-3 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-500 text-sm">
                  {form.rating} ⭐ ({form.reviews} reviews) - Auto-calculated
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Tour Type</label>
            <select
              value={form.tourType}
              onChange={e => setForm(f => ({ ...f, tourType: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400 transition-all"
            >
              {TOUR_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Tour Image</label>
            <div className="flex items-center gap-4">
              {previewUrl && (
                <img src={previewUrl} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={e => {
                  if (e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                    setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                  }
                }}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3}
              required
              placeholder="A beautiful description of the tour..."
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Facilities (comma separated)
            </label>
            <input
              type="text"
              value={form.facilities}
              onChange={e => setForm(f => ({ ...f, facilities: e.target.value }))}
              placeholder="Free Breakfast, Hotel Stay, AC Transport, Guide"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400 transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
              className="w-4 h-4 accent-blue-600"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active (visible to users)</label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              {saving ? <Loader2 size={16} className="animate-spin" /> : null}
              {tour ? 'Save Changes' : 'Create Tour'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export const Admin = () => {
  const { getToken } = useAuth();
  const [tab, setTab] = useState('stats');
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingTour, setEditingTour] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [heroImagePreview, setHeroImagePreview] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, toursRes, bookingsRes, heroRes] = await Promise.all([
        apiFetch('/admin/stats', getToken),
        apiFetch('/admin/tours', getToken),
        apiFetch('/admin/bookings', getToken),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/settings/heroImage`).then(res => res.ok ? res.json() : null),
      ]);
      setStats(statsRes.data);
      setTours(toursRes.data.tours);
      setBookings(bookingsRes.data.bookings);
      if (heroRes?.data?.value) setHeroImagePreview(heroRes.data.value);
    } catch (err) {
      toast.error('Failed to load admin data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [getToken]);

  const handleCreateTour = async (tourData) => {
    try {
      await apiFetch('/admin/tours', getToken, {
        method: 'POST',
        body: JSON.stringify(tourData),
      });
      toast.success('Tour created successfully!');
      setShowAddModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdateTour = async (tourData) => {
    try {
      await apiFetch(`/admin/tours/${editingTour._id}`, getToken, {
        method: 'PUT',
        body: JSON.stringify(tourData),
      });
      toast.success('Tour updated!');
      setEditingTour(null);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteTour = async (tourId, tourTitle) => {
    if (!window.confirm(`Deactivate "${tourTitle}"?`)) return;
    try {
      await apiFetch(`/admin/tours/${tourId}`, getToken, { method: 'DELETE' });
      toast.success('Tour deactivated');
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSaveSettings = async () => {
    if (!heroImageFile) return toast.error('Please select an image first');
    setSavingSettings(true);
    try {
      const formData = new FormData();
      formData.append('image', heroImageFile);
      
      const uploadRes = await apiFetch('/admin/upload', getToken, {
        method: 'POST',
        body: formData,
      });
      
      const imageUrl = uploadRes.data.url;
      
      await apiFetch('/admin/settings/heroImage', getToken, {
        method: 'PUT',
        body: JSON.stringify({ value: imageUrl })
      });
      
      toast.success('Hero image updated successfully!');
      setHeroImageFile(null);
    } catch (err) {
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const statusColor = {
    confirmed: 'bg-green-100 text-green-700',
    pending:   'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const tabs = [
    { id: 'stats',    label: 'Dashboard',  icon: LayoutDashboard },
    { id: 'tours',    label: 'Tours',       icon: Package },
    { id: 'bookings', label: 'Bookings',    icon: BookOpen },
    { id: 'settings', label: 'Settings',    icon: Settings },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Panel — TripQuick</title>
      </Helmet>

      <div className="min-h-screen bg-transparent pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <LayoutDashboard size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-400">Manage your tours, bookings, and more</p>
            </div>
          </div>

          {/* Tab Bar */}
          <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 w-fit">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  tab === id ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-blue-500" />
            </div>
          ) : (
            <>
              {/* ── STATS TAB ── */}
              {tab === 'stats' && stats && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { icon: Package,    label: 'Total Tours',    value: stats.totalTours,    color: 'blue' },
                      { icon: BookOpen,   label: 'Total Bookings', value: stats.totalBookings, color: 'green' },
                      { icon: IndianRupee, label: 'Revenue',       value: `₹${(stats.totalRevenue/1000).toFixed(0)}K`, color: 'purple' },
                      { icon: Users,      label: 'Active Users',   value: stats.totalBookings, color: 'orange' },
                    ].map(({ icon: Icon, label, value, color }) => (
                      <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <div className={`w-10 h-10 bg-${color}-100 rounded-xl flex items-center justify-center mb-3`}>
                          <Icon size={20} className={`text-${color}-600`} />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{value}</p>
                        <p className="text-xs text-gray-400 mt-1">{label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Recent Bookings</h3>
                    <div className="space-y-3">
                      {stats.recentBookings?.map(b => (
                        <div key={b._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{b.tourTitle}</p>
                            <p className="text-xs text-gray-400">{b.userName} · {b.guests} guest(s)</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">₹{b.totalPrice?.toLocaleString('en-IN')}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[b.status] || 'bg-gray-100 text-gray-700'}`}>
                              {b.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── TOURS TAB ── */}
              {tab === 'tours' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-500">{tours.length} total tours</p>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-md"
                    >
                      <Plus size={16} /> Add Tour
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100">
                            {['Tour', 'Type', 'Price', 'Rating', 'Status', 'Actions'].map(h => (
                              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {tours.map(tour => (
                            <tr key={tour._id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <img src={tour.image} alt={tour.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                                  <div>
                                    <p className="font-medium text-gray-900 leading-tight">{tour.title}</p>
                                    <p className="text-xs text-gray-400">{tour.location}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">{tour.tourType}</span>
                              </td>
                              <td className="px-4 py-3 font-semibold text-gray-900">₹{tour.price?.toLocaleString('en-IN')}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                  <Star size={13} className="text-yellow-500 fill-yellow-500" />
                                  <span className="font-medium">{tour.rating}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${tour.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                  {tour.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <button onClick={() => setEditingTour(tour)} className="p-1.5 rounded-lg hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition-colors">
                                    <Edit2 size={15} />
                                  </button>
                                  <button onClick={() => handleDeleteTour(tour._id, tour.title)} className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors">
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── BOOKINGS TAB ── */}
              {tab === 'bookings' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-sm text-gray-500 mb-4">{bookings.length} total bookings</p>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100">
                            {['Guest', 'Tour', 'Date', 'Guests', 'Total', 'Status'].map(h => (
                              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {bookings.map(b => (
                            <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3">
                                <p className="font-medium text-gray-900">{b.userName}</p>
                                <p className="text-xs text-gray-400">{b.userEmail}</p>
                              </td>
                              <td className="px-4 py-3 text-gray-700">{b.tourTitle}</td>
                              <td className="px-4 py-3 text-gray-600">
                                {new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </td>
                              <td className="px-4 py-3 text-gray-700">{b.guests}</td>
                              <td className="px-4 py-3 font-bold text-gray-900">₹{b.totalPrice?.toLocaleString('en-IN')}</td>
                              <td className="px-4 py-3">
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[b.status] || 'bg-gray-100'}`}>
                                  {b.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── SETTINGS TAB ── */}
              {tab === 'settings' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Website Settings</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Section Background Image</label>
                        <p className="text-xs text-gray-500 mb-4">Upload a high-quality image (ideally landscape, min 1920x1080) for the main homepage banner.</p>
                        
                        {heroImagePreview && (
                          <div className="mb-4 rounded-xl overflow-hidden border border-gray-200 aspect-video relative">
                            <img src={heroImagePreview} alt="Hero Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => {
                              if (e.target.files[0]) {
                                setHeroImageFile(e.target.files[0]);
                                setHeroImagePreview(URL.createObjectURL(e.target.files[0]));
                              }
                            }}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
                          />
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-100">
                        <button
                          onClick={handleSaveSettings}
                          disabled={savingSettings || !heroImageFile}
                          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {savingSettings && <Loader2 size={16} className="animate-spin" />}
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && (
          <TourFormModal onClose={() => setShowAddModal(false)} onSave={handleCreateTour} />
        )}
        {editingTour && (
          <TourFormModal tour={editingTour} onClose={() => setEditingTour(null)} onSave={handleUpdateTour} />
        )}
      </AnimatePresence>
    </>
  );
};
