import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { bookAPI } from '../services/api';
import { setFeaturedBooks, setLoading, setError } from '../store/slices/bookSlice';
import { addToCart } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';

export default function Home() {
  const dispatch = useDispatch();
  const { featuredBooks, loading, error } = useSelector((state) => state.book);

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        dispatch(setLoading());
        const { data } = await bookAPI.getBooks({ featured: true });
        dispatch(setFeaturedBooks(data));
      } catch (error) {
        dispatch(setError(error.response?.data?.message || 'Failed to fetch books'));
      }
    };

    fetchFeaturedBooks();
  }, [dispatch]);

  const handleAddToCart = (bookId) => {
    const book = featuredBooks.find((book) => book._id === bookId);
    if (book) {
      dispatch(
        addToCart({
          book: book._id,
          title: book.title,
          price: book.price,
          imageUrl: book.imageUrl,
          quantity: 1,
        })
      );
      toast.success('Added to cart!');
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
    <div>
      {/* Hero Section */}
      <div className="bg-blue-600 text-white rounded-lg p-8 mb-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">Welcome to BookStore</h1>
          <p className="text-lg mb-6">Discover your next favorite book from our vast collection.</p>
          <Link to="/books" className="btn bg-white text-blue-600 hover:bg-gray-100">
            Browse Books
          </Link>
        </div>
      </div>

      {/* Featured Books Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredBooks.map((book) => (
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
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}