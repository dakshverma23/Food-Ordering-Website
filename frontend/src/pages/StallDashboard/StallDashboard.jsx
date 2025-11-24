import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './StallDashboard.css';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import { stalls_list } from '../../assets/assets';

const StallDashboard = () => {
  const { stallName } = useParams();
  const navigate = useNavigate();
  const { food_list, cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);
  const [stallMenu, setStallMenu] = useState([]);
  const [stallInfo, setStallInfo] = useState(null);

  useEffect(() => {
    // Find stall info
    const stall = stalls_list.find(s => s.stall_name === stallName);
    setStallInfo(stall);

    // Filter food items by stall
    const filteredMenu = food_list.filter(item => 
      item.stall && item.stall === stallName
    );
    setStallMenu(filteredMenu);
  }, [stallName, food_list]);

  const getQuantity = (itemId) => {
    return cartItems[itemId] || 0;
  };

  return (
    <div className="stall-dashboard">
      <div className="stall-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        {stallInfo && (
          <div className="stall-info">
            <img src={stallInfo.stall_image} alt={stallInfo.stall_name} className="stall-logo" />
            <div className="stall-details">
              <h1>{stallInfo.stall_name}</h1>
              <p className="stall-description">Explore our delicious menu and place your order</p>
            </div>
          </div>
        )}
      </div>

      <div className="stall-menu-section">
        <h2>Menu</h2>
        {stallMenu.length === 0 ? (
          <div className="no-menu">
            <p>No items available at this stall currently.</p>
          </div>
        ) : (
          <div className="menu-list">
            {stallMenu.map((item) => (
              <div key={item._id} className="menu-item-row">
                <div className="menu-item-image">
                  <img src={url + "/images/" + item.image} alt={item.name} />
                </div>
                <div className="menu-item-details">
                  <div className="menu-item-header">
                    <h3>{item.name}</h3>
                    <div className="menu-item-rating">
                      <img src={assets.rating_starts} alt="rating" />
                    </div>
                  </div>
                  <p className="menu-item-description">{item.description}</p>
                  <div className="menu-item-footer">
                    <span className="menu-item-price">₹{item.price}</span>
                    <div className="menu-item-actions">
                      {getQuantity(item._id) === 0 ? (
                        <button 
                          className="add-to-cart-btn"
                          onClick={() => addToCart(item._id)}
                        >
                          <img src={assets.add_icon_white} alt="add" />
                          Add
                        </button>
                      ) : (
                        <div className="quantity-controls">
                          <button 
                            className="quantity-btn"
                            onClick={() => removeFromCart(item._id)}
                          >
                            <img src={assets.remove_icon_red} alt="remove" />
                          </button>
                          <span className="quantity">{getQuantity(item._id)}</span>
                          <button 
                            className="quantity-btn"
                            onClick={() => addToCart(item._id)}
                          >
                            <img src={assets.add_icon_green} alt="add" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="stall-footer-actions">
        <button className="view-cart-btn" onClick={() => navigate('/cart')}>
          <img src={assets.basket_icon} alt="cart" />
          View Cart ({Object.keys(cartItems).length})
        </button>
      </div>
    </div>
  );
};

export default StallDashboard;

