import React, { useState } from 'react';
import { ShoppingCart, Trash2, CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';

export const CheckoutView: React.FC = () => {
  // Mock cart items based on products
  const [cartItems, setCartItems] = useState([
    { ...MOCK_PRODUCTS[0], quantity: 2 },
    { ...MOCK_PRODUCTS[2], quantity: 5 }
  ]);
  const [isPaid, setIsPaid] = useState(false);

  const updateQuantity = (id: string, change: number) => {
      setCartItems(prev => prev.map(item => {
          if (item.id === id) {
              const newQty = Math.max(1, item.quantity + change);
              return { ...item, quantity: newQty };
          }
          return item;
      }));
  };

  const removeItem = (id: string) => {
      setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = cartItems.length > 0 ? 50.00 : 0;
  const total = subtotal + shipping;

  const handlePayment = () => {
      setIsPaid(true);
  };

  if (isPaid) {
      return (
          <div className="flex flex-col items-center justify-center h-[600px] animate-in fade-in zoom-in duration-300">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={48} className="text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
              <p className="text-gray-500 mb-8">Thank you for your purchase.</p>
              <button onClick={() => setIsPaid(false)} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700">
                  Continue Shopping
              </button>
          </div>
      )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-bold text-gray-900">Checkout</h2>

      {cartItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Your cart is empty.</p>
          </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingCart size={20} /> Your Cart
            </h3>
            <div className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 bg-gray-100 rounded-lg"></div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">Unit: {item.priceUnit}</p>
                      <p className="text-sm font-medium text-emerald-600">R$ {item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 text-gray-500 hover:bg-gray-50">-</button>
                      <span className="px-2 text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 text-gray-500 hover:bg-gray-50">+</button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
             <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard size={20} /> Payment Method
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border border-emerald-500 bg-emerald-50 rounded-lg cursor-pointer">
                <div className="h-4 w-4 rounded-full border border-emerald-600 bg-emerald-600"></div>
                <span className="font-medium text-gray-900">Credit Card ending in 4242</span>
              </div>
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="h-4 w-4 rounded-full border border-gray-300"></div>
                <span className="font-medium text-gray-900">PIX</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>R$ {shipping.toFixed(2)}</span>
              </div>
              <div className="h-px bg-gray-100 my-2"></div>
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>
            <button
                onClick={handlePayment}
                className="w-full py-3 bg-[#10b981] text-white rounded-xl font-bold shadow-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
            >
              Pay Now <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};