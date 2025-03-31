import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { bookAPI } from '../services/api';
import { addToCart } from '../store/slices/cartSlice';

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await bookAPI.getBook(id);
        setBook(data);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch book details');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart({
      book: book._id,
      title: book.title,
      price: book.price,
      imageUrl: book.imageUrl,
      quantity
    }));
    toast.success('Added to cart!');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await bookAPI.addReview(id, { rating, review });
      toast.success('Review added successfully!');
      // Refresh book data to show new review
      const { data } = await bookAPI.getBook(id);
      setBook(data);
      setReview('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add review');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 p-4">{error}</div>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Book Image */}
      <div>
        <img
          src={book.imageUrl}
          alt={book.title}
          className="w-full rounded-lg shadow-lg"
        />
      </div>

      {/* Book Details */}
      <div>
        <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
        <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
        <p className="text-2xl text-blue-600 font-bold mb-4">${book.price.toFixed(2)}</p>
        <p className="text-gray-700 mb-6">{book.description}</p>

        {/* Add to Cart Section */}
        <div className="flex items-center gap-4 mb-8">
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="input max-w-[100px]"
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddToCart}
            className="btn btn-primary"
            disabled={book.stock === 0}
          >
            {book.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>

        {/* Reviews Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          
          {/* Add Review Form */}
          <form onSubmit={handleSubmitReview} className="mb-6">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="input"
              >
                {[5, 4, 3, 2, 1].map((num) => (
                  <option key={num} value={num}>
                    {num} Star{num !== 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Review</label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="input min-h-[100px]"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit Review
            </button>
          </form>

          {/* Reviews List */}
          <div className="space-y-4">
            {book.ratings.map((rating, index) => (
              <div key={index} className="border-b pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="font-bold">{rating.user.name}</div>
                  <div className="text-yellow-500">{'★'.repeat(rating.rating)}</div>
                </div>
                <p className="text-gray-700">{rating.review}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
