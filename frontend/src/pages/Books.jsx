import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { bookAPI } from '../services/api';
import { setBooks, setLoading, setError } from '../store/slices/bookSlice';
import { addToCart } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const categories = ['All', 'Fiction', 'Non-Fiction', 'Science', 'Technology', 'History', 'Biography'];

export default function Books() {
  const dispatch = useDispatch(); // Declare dispatch here
  const { books, loading, error } = useSelector((state) => state.book);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        dispatch(setLoading());
        const params = {};
        if (selectedCategory !== 'All') {
          params.category = selectedCategory;
        }
        if (searchQuery) {
          params.search = searchQuery;
        }
        const { data } = await bookAPI.getBooks(params);
        dispatch(setBooks(data));
      } catch (error) {
        dispatch(setError(error.response?.data?.message || 'Failed to fetch books'));
      }
    };

    const debounce = setTimeout(() => {
      fetchBooks();
    }, 300);

    return () => clearTimeout(debounce);
  }, [dispatch, selectedCategory, searchQuery]);

  const handleAddToCart = (bookId) => {
    const book = books.find((book) => book._id === bookId); // Use `books` instead of `featuredBooks`
    if (book) {
      dispatch(
        addToCart({
          book: book._id,
          title: book.title,
          price: book.price,
          imageUrl: book.imageUrl,
          quantity: 1, // Default quantity
        })
      );
      toast.success('Added to cart!');
    }
  };

  const navigate = useNavigate();

  const handleBuyNow = (bookId) => {
    const book = books.find((book) => book._id === bookId);
    if (book) {
      dispatch(
        addToCart({
          book: book._id,
          title: book.title,
          price: book.price,
          imageUrl: book.imageUrl,
          quantity: 1, // Default quantity
        })
      );
      toast.success('Proceeding to checkout...');
      navigate('/checkout'); // Redirect to the checkout page
    }
  };

  return (
    <div>
      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        <input
          type="text"
          placeholder="Search books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input"
        />

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`btn ${
                selectedCategory === category ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 p-4">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div key={book._id} className="card hover:shadow-lg transition-shadow">
              <Link to={`/books/${book._id}`} className="block">
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{book.title}</h3>
                  <p className="text-gray-600 mb-2">{book.author}</p>
                  <p className="text-blue-600 font-bold">${book.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1">{book.rating}</span>
                  </div>
                </div>
              </Link>
              <div className="mt-4 space-x-2 p-4">
                <button
                  className="btn btn-primary"
                  onClick={() => handleAddToCart(book._id)}
                >
                  Add to Cart
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleBuyNow(book._id)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}