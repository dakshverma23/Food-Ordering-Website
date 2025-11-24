import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Menu.css';

const Menu = ({ token, stallOwner, url }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Salad',
    image: null
  });

  useEffect(() => {
    fetchMenu();
  }, [stallOwner, url]);

  const fetchMenu = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list?stall=${stallOwner?.stallName}`);
      if (response.data.success) {
        setMenuItems(response.data.data);
      }
    } catch (error) {
      toast.error('Error fetching menu');
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('stall', stallOwner?.stallName);
    formDataToSend.append('image', formData.image);

    try {
      const response = await axios.post(`${url}/api/food/add`, formDataToSend);
      if (response.data.success) {
        toast.success('Item added successfully');
        setFormData({ name: '', description: '', price: '', category: 'Salad', image: null });
        setShowAddForm(false);
        fetchMenu();
      } else {
        toast.error('Error adding item');
      }
    } catch (error) {
      toast.error('Error adding item');
    }
  };

  const removeItem = async (itemId) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      try {
        const response = await axios.post(`${url}/api/food/remove`, { id: itemId });
        if (response.data.success) {
          toast.success('Item removed');
          fetchMenu();
        }
      } catch (error) {
        toast.error('Error removing item');
      }
    }
  };

  return (
    <div className="stall-menu">
      <div className="menu-header">
        <h1>Menu Management</h1>
        <button onClick={() => setShowAddForm(!showAddForm)} className="add-item-btn">
          {showAddForm ? 'Cancel' : '+ Add Item'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="add-item-form">
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <div className="form-row">
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              required
            />
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
          <input type="file" name="image" onChange={handleChange} accept="image/*" required />
          <button type="submit">Add Item</button>
        </form>
      )}

      <div className="menu-items-grid">
        {menuItems.length === 0 ? (
          <p>No menu items. Add your first item!</p>
        ) : (
          menuItems.map((item) => (
            <div key={item._id} className="menu-item-card">
              <img src={`${url}/images/${item.image}`} alt={item.name} />
              <div className="menu-item-info">
                <h3>{item.name}</h3>
                <p className="category">{item.category}</p>
                <p className="description">{item.description}</p>
                <div className="menu-item-footer">
                  <p className="price">₹{item.price}</p>
                  <button onClick={() => removeItem(item._id)} className="remove-btn">Remove</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Menu;

