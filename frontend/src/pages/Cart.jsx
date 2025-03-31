import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleQuantityChange = (bookId, quantity) => {
    dispatch(updateQuantity({ book: bookId, quantity: parseInt(quantity) }));
  };

  const handleRemoveItem = (bookId) => {
    dispatch(removeFromCart(bookId));
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/books" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.book} className="card flex gap-4">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-grow">
                <Link to={`/books/${item.book}`} className="font-semibold hover:text-blue-600">
                  {item.title}
                </Link>
                <div className="text-blue-600 font-bold mt-1">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <select
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.book, e.target.value)}
                    className="input max-w-[80px]"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleRemoveItem(item.book)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="card h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t pt-2 font-bold flex justify-between">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
          <button onClick={handleCheckout} className="btn btn-primary w-full">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
