import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { orderAPI } from '../services/api';
import { clearCart } from '../store/slices/cartSlice';

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);

  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const orderData = {
        items: items.map(item => ({
          book: item.book,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: formData
      };

      await orderAPI.createOrder(orderData);
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Checkout</h1>
        <p className="text-center text-gray-600">Your cart is empty. Please add items to proceed.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.book} className="flex justify-between">
              <span>
                {item.title} x {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-4 font-bold flex justify-between">
            <span>Total</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
        
        <div>
          <label className="block text-gray-700 mb-2">Street Address</label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">ZIP Code</label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div className="pt-4">
          <button type="submit" className="btn btn-primary w-full">
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
}