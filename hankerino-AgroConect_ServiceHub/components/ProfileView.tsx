import React, { useState, useEffect } from 'react';
import { Edit2, MessageCircle, Instagram, Facebook, Phone, QrCode, Users, Plus, UserCheck, Check } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface ProfileViewProps {
  language: Language['code'];
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  displayName: string;
  bio: string;
  location: string;
  specialties: string[];
  phone: string;
  whatsapp: string;
  instagram: string;
  followers: number;
  following: number;
  avatarInitial: string;
  isMainProfile?: boolean;
}

const DEFAULT_PROFILE: UserProfile = {
  id: '1',
  name: "Carlos Eduardo Lima",
  email: "henryquinones101@gmail.com",
  displayName: "Carlos Eduardo Lima",
  bio: "Consultor agrícola especializado em drones e tecnologia. Ajudo produtores a implementar agricultura de precisão.",
  location: "Rio Verde, GO",
  specialties: ["drones", "sensoriamento remoto", "consultoria"],
  phone: "(64) 3621-9876",
  whatsapp: "(64) 99234-5678",
  instagram: "@agro_tech_carlos",
  followers: 1250,
  following: 45,
  avatarInitial: "C",
  isMainProfile: true
};

export const ProfileView: React.FC<ProfileViewProps> = ({ language }) => {
  const t = TRANSLATIONS[language];

  const [profiles, setProfiles] = useState<UserProfile[]>([DEFAULT_PROFILE]);
  const [activeProfileId, setActiveProfileId] = useState<string>('1');
  const [isCreating, setIsCreating] = useState(false);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  // New Profile Form State
  const [newProfile, setNewProfile] = useState<Partial<UserProfile>>({
    name: '',
    email: '',
    bio: '',
    specialties: []
  });
  const [followMain, setFollowMain] = useState(true);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedProfiles = localStorage.getItem('agro_profiles');
    const savedActiveId = localStorage.getItem('agro_active_profile_id');

    if (savedProfiles) {
      setProfiles(JSON.parse(savedProfiles));
    }
    if (savedActiveId) {
      setActiveProfileId(savedActiveId);
    }
  }, []);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('agro_profiles', JSON.stringify(profiles));
    localStorage.setItem('agro_active_profile_id', activeProfileId);
  }, [profiles, activeProfileId]);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  const handleCreateProfile = () => {
    const newId = Date.now().toString();
    const createdProfile: UserProfile = {
      id: newId,
      name: newProfile.name || 'New User',
      email: newProfile.email || 'user@example.com',
      displayName: newProfile.name || 'New User',
      bio: newProfile.bio || 'Agricultural enthusiast.',
      location: 'Unknown',
      specialties: newProfile.specialties || ['general'],
      phone: '',
      whatsapp: '',
      instagram: '',
      followers: 0,
      following: followMain ? 1 : 0,
      avatarInitial: (newProfile.name || 'U')[0].toUpperCase(),
      isMainProfile: false
    };

    let updatedProfiles = [...profiles, createdProfile];

    // If following main profile (Carlos), update his stats
    if (followMain) {
      updatedProfiles = updatedProfiles.map(p => {
        if (p.isMainProfile) {
          return { ...p, followers: p.followers + 1 };
        }
        return p;
      });
    }

    setProfiles(updatedProfiles);
    setActiveProfileId(newId);
    setIsCreating(false);
    setNewProfile({ name: '', email: '', bio: '', specialties: [] });
    setIsSwitcherOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header / Profile Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
         <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#10b981] text-white flex items-center justify-center font-bold text-lg">
               {activeProfile.avatarInitial}
            </div>
            <div>
               <p className="text-xs text-gray-500 uppercase font-bold">Current Identity</p>
               <h3 className="text-sm font-bold text-gray-900">{activeProfile.name}</h3>
            </div>
         </div>

         <div className="relative">
            <button
              onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
               <Users size={16} /> Switch Profile
            </button>

            {isSwitcherOpen && (
               <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-2 bg-gray-50 border-b border-gray-100">
                     <p className="text-xs font-bold text-gray-500 px-2">Select Account</p>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                     {profiles.map(profile => (
                        <button
                           key={profile.id}
                           onClick={() => { setActiveProfileId(profile.id); setIsSwitcherOpen(false); setIsCreating(false); }}
                           className={`w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 transition-colors ${activeProfileId === profile.id ? 'bg-emerald-50' : ''}`}
                        >
                           <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                              {profile.avatarInitial}
                           </div>
                           <div className="flex-1">
                              <p className={`text-sm font-bold ${activeProfileId === profile.id ? 'text-emerald-700' : 'text-gray-800'}`}>
                                 {profile.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">{profile.isMainProfile ? 'Main Profile' : 'Community Member'}</p>
                           </div>
                           {activeProfileId === profile.id && <Check size={16} className="text-emerald-600" />}
                        </button>
                     ))}
                  </div>
                  <div className="p-2 border-t border-gray-100 bg-gray-50">
                     <button
                        onClick={() => { setIsCreating(true); setIsSwitcherOpen(false); }}
                        className="w-full flex items-center justify-center gap-2 p-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-emerald-600 hover:bg-emerald-50 transition-colors"
                     >
                        <Plus size={16} /> Create New Profile
                     </button>
                  </div>
               </div>
            )}
         </div>
      </div>

      {isCreating ? (
         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
               <UserCheck className="text-emerald-600" /> Create New Identity
            </h2>

            <div className="space-y-5">
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                     type="text"
                     value={newProfile.name}
                     onChange={(e) => setNewProfile({...newProfile, name: e.target.value})}
                     placeholder="e.g. John Doe"
                     className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
               </div>
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                  <input
                     type="email"
                     value={newProfile.email}
                     onChange={(e) => setNewProfile({...newProfile, email: e.target.value})}
                     placeholder="john@example.com"
                     className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
               </div>
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Bio</label>
                  <textarea
                     value={newProfile.bio}
                     onChange={(e) => setNewProfile({...newProfile, bio: e.target.value})}
                     placeholder="Tell us about your farm or expertise..."
                     className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 h-24 resize-none"
                  />
               </div>

               <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-center gap-3">
                  <input
                     type="checkbox"
                     id="followMain"
                     checked={followMain}
                     onChange={(e) => setFollowMain(e.target.checked)}
                     className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300"
                  />
                  <label htmlFor="followMain" className="text-sm font-medium text-gray-700 cursor-pointer">
                     Follow <strong>Carlos Eduardo Lima</strong> (Main Profile) automatically?
                  </label>
               </div>

               <div className="flex gap-3 pt-4">
                  <button
                     onClick={handleCreateProfile}
                     disabled={!newProfile.name || !newProfile.email}
                     className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     Create & Switch
                  </button>
                  <button
                     onClick={() => setIsCreating(false)}
                     className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                     Cancel
                  </button>
               </div>
            </div>
         </div>
      ) : (
         <>
            <div className="bg-[#10b981] rounded-xl p-8 text-white relative overflow-hidden mb-8">
               <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-2">My Community Profile</h2>
                  <p className="text-emerald-50 text-lg opacity-90">Manage your public information and social connections.</p>
               </div>
               <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Left Column - Profile Details */}
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
                  <div className="p-6 md:p-8">
                    <div className="flex justify-between items-start mb-6">
                       <div className="flex items-center gap-4">
                          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-400 border-2 border-gray-200">
                             {activeProfile.avatarInitial}
                          </div>
                          <div>
                             <h3 className="text-2xl font-bold text-gray-900">{activeProfile.name}</h3>
                             <p className="text-gray-500">{activeProfile.email}</p>
                          </div>
                       </div>
                       <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors bg-white shadow-sm">
                          <Edit2 size={14} /> Edit
                       </button>
                    </div>

                    {/* Stats Row */}
                    <div className="flex gap-8 mb-8 pb-6 border-b border-gray-100">
                        <div className="text-center">
                           <span className="block text-xl font-bold text-gray-900">{activeProfile.followers}</span>
                           <span className="text-xs text-gray-500 uppercase font-bold tracking-wide">Followers</span>
                        </div>
                        <div className="text-center">
                           <span className="block text-xl font-bold text-gray-900">{activeProfile.following}</span>
                           <span className="text-xs text-gray-500 uppercase font-bold tracking-wide">Following</span>
                        </div>
                        <div className="text-center">
                           <span className="block text-xl font-bold text-gray-900">{activeProfile.isMainProfile ? '12' : '0'}</span>
                           <span className="text-xs text-gray-500 uppercase font-bold tracking-wide">Posts</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1">Display Name</label>
                        <p className="text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">{activeProfile.displayName}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1">Your Bio</label>
                        <p className="text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 leading-relaxed">
                          {activeProfile.bio}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1">Location</label>
                        <p className="text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">{activeProfile.location}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Specialties</label>
                        <div className="flex flex-wrap gap-2">
                          {activeProfile.specialties.map((tag, idx) => (
                            <span key={idx} className="bg-gray-100 text-gray-800 font-bold text-xs px-3 py-1.5 rounded-md border border-gray-200">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Social & QR */}
              <div className="lg:col-span-2 space-y-6">
                {/* Social Connections */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Social Connections</h3>
                  <div className="space-y-5">

                    {/* WhatsApp */}
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                         <MessageCircle size={24} className="text-green-500" />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-gray-900">Whatsapp</p>
                         <p className="text-gray-500 text-sm mt-0.5">{activeProfile.whatsapp || 'Not connected'}</p>
                      </div>
                    </div>

                    {/* Instagram */}
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                         <Instagram size={24} className="text-pink-500" />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-gray-900">Instagram</p>
                         <p className="text-gray-500 text-sm mt-0.5">{activeProfile.instagram || 'Not connected'}</p>
                      </div>
                    </div>

                    {/* Facebook */}
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                         <Facebook size={24} className="text-blue-600" />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-gray-900">Facebook</p>
                         <p className="text-gray-400 text-sm italic mt-0.5">Not connected</p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                         <Phone size={24} className="text-gray-600" />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-gray-900">Phone</p>
                         <p className="text-gray-500 text-sm mt-0.5">{activeProfile.phone || 'Not connected'}</p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* QR Code */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                   <div className="flex items-center gap-2 mb-6">
                      <QrCode size={20} className="text-gray-900" />
                      <h3 className="text-lg font-bold text-gray-900">Your QR Code</h3>
                   </div>

                   <div className="flex justify-center py-4">
                      <div className="bg-white p-2 border-2 border-gray-900 rounded-lg">
                         {/* Mock QR Code representation */}
                         <div className="w-48 h-48 bg-gray-900 flex items-center justify-center relative overflow-hidden">
                             <div className="absolute inset-2 bg-white flex flex-wrap content-start">
                                 {/* Random blocks to simulate QR based on ID */}
                                 {Array.from({ length: 64 }).map((_, i) => (
                                     <div key={i} className={`w-1/8 h-6 w-6 ${(i * activeProfile.id.length) % 3 === 0 ? 'bg-black' : 'bg-white'}`}></div>
                                 ))}
                                 {/* Position Squares */}
                                 <div className="absolute top-0 left-0 w-12 h-12 border-4 border-black bg-white flex items-center justify-center">
                                     <div className="w-6 h-6 bg-black"></div>
                                 </div>
                                 <div className="absolute top-0 right-0 w-12 h-12 border-4 border-black bg-white flex items-center justify-center">
                                     <div className="w-6 h-6 bg-black"></div>
                                 </div>
                                 <div className="absolute bottom-0 left-0 w-12 h-12 border-4 border-black bg-white flex items-center justify-center">
                                     <div className="w-6 h-6 bg-black"></div>
                                 </div>
                             </div>
                         </div>
                      </div>
                   </div>
                   <p className="text-center text-xs text-gray-500 mt-4">Scan to share {activeProfile.name}'s profile</p>
                </div>
              </div>
            </div>
         </>
      )}
    </div>
  );
};