import React from 'react';
import { MOCK_CONSULTANTS } from '../constants';
import { MapPin, Calendar, Award, MessageCircle } from 'lucide-react';

export const ExpertDetailView: React.FC = () => {
  const expert = MOCK_CONSULTANTS[0];

  const handleFollow = () => {
      alert(`You are now following ${expert.name}`);
  };

  const handleBook = () => {
      alert(`Booking request sent to ${expert.name}. Check your email for confirmation.`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
         {/* Cover */}
         <div className="h-32 bg-gradient-to-r from-emerald-600 to-emerald-400"></div>

         <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
               <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500 shadow-md">
                  {expert.name.split(' ').map(n=>n[0]).join('')}
               </div>
               <div className="flex gap-3">
                  <button onClick={handleFollow} className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-medium text-gray-700 shadow-sm hover:bg-gray-50">Follow</button>
                  <button onClick={handleBook} className="px-4 py-2 bg-[#10b981] text-white rounded-lg font-medium shadow-sm hover:bg-emerald-600">Book Session</button>
               </div>
            </div>

            <div>
               <h1 className="text-2xl font-bold text-gray-900">{expert.name}</h1>
               <p className="text-emerald-600 font-medium">{expert.specialty}</p>

               <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><MapPin size={16} /> São Paulo, SP</span>
                  <span className="flex items-center gap-1"><Calendar size={16} /> Joined Jan 2024</span>
               </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="col-span-2 space-y-6">
                  <div>
                     <h3 className="font-bold text-gray-900 mb-2">About</h3>
                     <p className="text-gray-600 leading-relaxed">
                        Ph.D. in Soil Science with over 15 years of experience in tropical agriculture. Specialized in regenerative practices and nutrient management for large-scale soybean and corn production.
                     </p>
                  </div>

                  <div>
                     <h3 className="font-bold text-gray-900 mb-3">Certifications</h3>
                     <div className="flex gap-3">
                        <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 flex items-center gap-2">
                           <Award size={16} className="text-amber-500" />
                           <span className="text-sm font-medium">Certified Crop Advisor</span>
                        </div>
                        <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 flex items-center gap-2">
                           <Award size={16} className="text-amber-500" />
                           <span className="text-sm font-medium">Precision Ag Specialist</span>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 h-fit">
                  <h3 className="font-bold text-gray-900 mb-4">Consultation Rates</h3>
                  <div className="space-y-3">
                     <div className="flex justify-between items-center text-sm">
                        <span>Video Call (1h)</span>
                        <span className="font-bold">R$ {expert.rate}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span>Site Visit (Day)</span>
                        <span className="font-bold">R$ 1,200</span>
                     </div>
                     <hr className="border-gray-200" />
                     <button onClick={() => alert('Calendar opening...')} className="w-full mt-2 py-2 text-emerald-600 font-bold text-sm hover:bg-emerald-50 rounded-lg">View Availability</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};