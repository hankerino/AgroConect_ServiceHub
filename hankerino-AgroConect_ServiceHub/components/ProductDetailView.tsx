import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { Star, ShoppingCart, Share2, ShieldCheck, Truck, Package, Check } from 'lucide-react';

export const ProductDetailView: React.FC = () => {
  // Mock selecting the first product for display
  const product = MOCK_PRODUCTS[0];
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
  };

  const handleShare = () => {
      navigator.clipboard.writeText(window.location.href);
      alert("Product link copied to clipboard!");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <nav className="text-sm text-gray-500 mb-4">
          Marketplace &gt; {product.category} &gt; <span className="text-gray-900 font-medium">{product.name}</span>
       </nav>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image Placeholder with SVG */}
          <div className="bg-gray-50 rounded-2xl h-[400px] flex flex-col items-center justify-center border border-gray-100 text-gray-300">
             <div className="bg-white p-8 rounded-full shadow-sm mb-4">
                <Package size={80} className="text-emerald-500" strokeWidth={1} />
             </div>
             <p className="font-medium text-gray-400">Product Image</p>
          </div>

          {/* Details */}
          <div className="space-y-6">
             <div>
                <div className="flex items-center gap-2 mb-2">
                   {product.tags?.map((tag, i) => (
                      <span key={i} className={`text-xs font-bold px-2 py-1 rounded-md ${tag.color}`}>{tag.label}</span>
                   ))}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center gap-4">
                   <div className="flex text-amber-500">
                      {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                   </div>
                   <span className="text-sm text-gray-500">124 reviews</span>
                </div>
             </div>

             <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-3xl font-bold text-emerald-600 mb-1">R$ {product.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Per {product.priceUnit} • Including VAT</p>
             </div>

             <div>
                <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description} Ideal para produtores que buscam eficiência e qualidade. Produto certificado com garantia de origem.</p>
             </div>

             <div className="grid grid-cols-2 gap-4">
                 <button
                    onClick={handleAddToCart}
                    className={`flex items-center justify-center gap-2 px-6 py-3 font-bold rounded-xl transition-all shadow-lg ${added ? 'bg-emerald-700 text-white scale-95' : 'bg-[#10b981] text-white hover:bg-emerald-600 shadow-emerald-200'}`}
                 >
                    {added ? <Check size={20} /> : <ShoppingCart size={20} />}
                    {added ? 'Added' : 'Add to Cart'}
                 </button>
                 <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                 >
                    <Share2 size={20} /> Share
                 </button>
             </div>

             <div className="space-y-3 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                   <ShieldCheck size={18} className="text-emerald-500" />
                   <span>Quality Guarantee verified by AgroConect</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                   <Truck size={18} className="text-blue-500" />
                   <span>Delivery available to Rondonópolis region</span>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};