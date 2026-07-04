import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword } from '../api/auth';
import { User, Lock, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const { register: regProfile, handleSubmit: handleProfile } = useForm({
    defaultValues: { name: user?.name, phone: user?.phone || '' }
  });

  const { register: regPw, handleSubmit: handlePw, reset: resetPw, formState: { errors: pwErrors } } = useForm();

  const onProfileSave = async (data) => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', data.name);
      fd.append('phone', data.phone || '');
      if (avatarFile) fd.append('avatar', avatarFile);
      await updateProfile(fd);
      await refreshUser();
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
    setSaving(false);
  };

  const onPwSave = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSaving(true);
    try {
      await changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password changed!');
      resetPw();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
    setSaving(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const avatarSrc = avatarPreview || (user?.avatar ? `${BASE}${user.avatar}` : null);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      {/* Avatar section */}
      <div className="card p-6 flex flex-col sm:flex-row items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
            {avatarSrc
              ? <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
              : <span className="text-3xl font-bold text-primary-700">{user?.name?.[0]?.toUpperCase()}</span>
            }
          </div>
          <label className="absolute bottom-0 right-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700">
            <Camera className="w-3 h-3 text-white" />
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </label>
        </div>
        <div>
          <p className="text-xl font-semibold text-gray-900">{user?.name}</p>
          <p className="text-gray-500">{user?.email}</p>
          <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full ${user?.role === 'admin' ? 'bg-red-100 text-red-700' : user?.role === 'agent' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
            {user?.role}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[['profile', 'Profile Info', User], ['password', 'Change Password', Lock]].map(([tab, label, Icon]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <form onSubmit={handleProfile(onProfileSave)} className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input className="input-field" {...regProfile('name', { required: true })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input className="input-field bg-gray-50 cursor-not-allowed" value={user?.email} disabled />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input className="input-field" placeholder="Enter phone number" {...regProfile('phone')} />
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}

      {activeTab === 'password' && (
        <form onSubmit={handlePw(onPwSave)} className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input type="password" className="input-field" {...regPw('currentPassword', { required: 'Required' })} />
            {pwErrors.currentPassword && <p className="text-red-500 text-xs mt-1">{pwErrors.currentPassword.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input type="password" className="input-field" {...regPw('newPassword', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })} />
            {pwErrors.newPassword && <p className="text-red-500 text-xs mt-1">{pwErrors.newPassword.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input type="password" className="input-field" {...regPw('confirmPassword', { required: 'Required' })} />
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      )}
    </div>
  );
}
