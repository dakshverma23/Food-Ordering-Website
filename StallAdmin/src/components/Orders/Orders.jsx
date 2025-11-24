import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Orders.css';

const Orders = ({ token, stallOwner, url }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, [token, url]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/stall/orders`, {
        headers: { token }
      });
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      toast.error('Error fetching orders');
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const response = await axios.post(
        `${url}/api/stall/update-status`,
        { orderId, status },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success('Order status updated');
        fetchOrders();
      }
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  return (
    <div className="stall-orders">
      <h1>Orders for {stallOwner?.stallName}</h1>
      <div className="orders-list">
        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h3>Order #{order._id.slice(-6)}</h3>
                <span className={`status-badge ${order.status.toLowerCase().replace(' ', '-')}`}>
                  {order.status}
                </span>
              </div>
              <div className="order-items">
                <h4>Items:</h4>
                {order.stallItems?.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <img src={`${url}/images/${item.foodDetails?.image}`} alt={item.foodDetails?.name} />
                    <div>
                      <p>{item.foodDetails?.name}</p>
                      <p>Qty: {item.quantity} × ₹{item.foodDetails?.price}</p>
                    </div>
                    <p className="item-total">₹{item.quantity * item.foodDetails?.price}</p>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <div className="order-address">
                  <p><strong>Customer:</strong> {order.address?.firstName} {order.address?.lastName}</p>
                  <p>{order.address?.street}, {order.address?.city}</p>
                  <p>Phone: {order.address?.phone}</p>
                </div>
                <div className="order-actions">
                  <p className="order-total">Total: ₹{order.stallTotal?.toFixed(2)}</p>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                  >
                    <option value="Food Processing">Food Processing</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;

