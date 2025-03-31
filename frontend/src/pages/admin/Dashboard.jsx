import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI, bookAPI } from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalOrders: 0,
    pendingOrders: 0,
    recentOrders: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [booksRes, ordersRes] = await Promise.all([
          bookAPI.getBooks(),
          orderAPI.getAllOrders()
        ]);

        setStats({
          totalBooks: booksRes.data.length,
          totalOrders: ordersRes.data.length,
          pendingOrders: ordersRes.data.filter(order => order.status === 'Pending').length,
          recentOrders: ordersRes.data.slice(0, 5)
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-blue-50">
          <h3 className="font-bold text-lg mb-2">Total Books</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalBooks}</p>
          <Link to="/admin/books" className="text-blue-600 hover:underline mt-2 inline-block">
            Manage Books →
          </Link>
        </div>

        <div className="card bg-green-50">
          <h3 className="font-bold text-lg mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalOrders}</p>
          <Link to="/admin/orders" className="text-green-600 hover:underline mt-2 inline-block">
            View All Orders →
          </Link>
        </div>

        <div className="card bg-yellow-50">
          <h3 className="font-bold text-lg mb-2">Pending Orders</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
          <Link to="/admin/orders" className="text-yellow-600 hover:underline mt-2 inline-block">
            Process Orders →
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Order ID</th>
                <th className="text-left py-2">Customer</th>
                <th className="text-left py-2">Total</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="py-2">{order._id.slice(-6)}</td>
                  <td className="py-2">{order.user.name}</td>
                  <td className="py-2">${order.totalAmount.toFixed(2)}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      order.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.status === 'Processing'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'Shipped'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}