import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfile} from '../store/profileSlice';
import { logout } from '../store/loginSlice';
import type { RootState, AppDispatch } from '../store/store';
import { User as UserIcon, Mail, Calendar, Edit2, Check, Camera, LogOut, ArrowRight, Phone } from 'lucide-react';

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { user, isAuthenticated } = useSelector((state: RootState) => state.login);
  const profile = useSelector((state: RootState) => state.profile);
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [cell, setCell] = useState(user?.cell || '');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setCell(user.cell || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!user?.id) return;
    
    try {
      await dispatch(updateProfile({
        userId: user.id,
        updatedData: { name, cell }
      })).unwrap();
      
      setIsEditing(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user?.id) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const profileImage = reader.result as string;
        
        try {
          await dispatch(updateProfile({
            userId: user.id,
            updatedData: { profileImage }
          })).unwrap();
        } catch (error) {
          console.error('Failed to upload image:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!user) return null;

  const joinDate = user.joinDate || new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        <div className="h-40 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        
        <div className="px-8 pb-10">
         
          <div className="flex flex-col md:flex-row md:items-end -mt-16 mb-8 gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl border-4 border-white bg-slate-200 overflow-hidden shadow-xl">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 bg-gradient-to-br from-blue-100 to-purple-100">
                    <UserIcon size={48} className="text-blue-600" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-2 right-2 bg-white p-2.5 rounded-xl shadow-lg cursor-pointer hover:bg-blue-50 transition-colors border border-slate-200">
                <Camera size={18} className="text-blue-600" />
                <input type="file" className="hidden" accept="image/*" onChange={handleProfileImageUpload} />
              </label>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-3xl font-bold text-slate-800">{user.name}</h1>
                  <p className="text-slate-600">Shopping Enthusiast 🛍️</p>
                </div>
                {isSaved && (
                  <div className="flex items-center space-x-2 text-green-600 text-sm font-semibold bg-green-50 px-4 py-2 rounded-xl border border-green-200">
                    <Check size={16} />
                    <span>Changes Saved!</span>
                  </div>
                )}
              </div>
            </div>
          </div>

         
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-3">Account Details</h3>
              
              <div className="space-y-4">
               
                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="p-2.5 bg-blue-100 rounded-lg">
                    <UserIcon size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Full Name</p>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white border border-blue-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    ) : (
                      <p className="font-semibold text-slate-800">{user.name}</p>
                    )}
                  </div>
                </div>

               
                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="p-2.5 bg-purple-100 rounded-lg">
                    <Mail size={20} className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Email Address</p>
                    <p className="font-semibold text-slate-800">{user.email}</p>
                  </div>
                </div>

                
                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="p-2.5 bg-green-100 rounded-lg">
                    <Phone size={20} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Phone Number</p>
                    {isEditing ? (
                      <input 
                        type="tel" 
                        value={cell} 
                        onChange={(e) => setCell(e.target.value)}
                        placeholder="Enter phone number"
                        className="w-full bg-white border border-blue-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="font-semibold text-slate-800">{user.cell || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                
                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="p-2.5 bg-orange-100 rounded-lg">
                    <Calendar size={20} className="text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Member Since</p>
                    <p className="font-semibold text-slate-800">{joinDate}</p>
                  </div>
                </div>

               
                <button 
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  disabled={profile.status === 'loading'}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {isEditing ? <Check size={18} /> : <Edit2 size={18} />}
                  <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
                </button>
              </div>
            </div>

           
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-3">Settings & Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:bg-blue-50 hover:border-blue-200 transition-all text-left">
                  <span className="font-semibold text-slate-800">Change Password</span>
                  <ArrowRight className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-blue-600" size={18} />
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:bg-blue-50 hover:border-blue-200 transition-all text-left">
                  <span className="font-semibold text-slate-800">Notification Preferences</span>
                  <ArrowRight className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-blue-600" size={18} />
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:bg-blue-50 hover:border-blue-200 transition-all text-left">
                  <span className="font-semibold text-slate-800">Privacy Settings</span>
                  <ArrowRight className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-blue-600" size={18} />
                </button>
                
                <div className="pt-4">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-3 p-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 border border-red-200 transition-all font-semibold"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Profile;
