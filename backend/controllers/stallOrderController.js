import orderModel from "../models/orderModel.js";
import foodModel from "../models/foodModel.js";

// Get orders for a specific stall
const getStallOrders = async (req, res) => {
    try {
        const { stallName } = req;
        
        // Get all orders
        const allOrders = await orderModel.find({});
        
        // Filter orders that contain items from this stall
        const stallOrders = allOrders.filter(order => {
            // Check if any item in the order belongs to this stall
            return order.items.some(item => {
                // We need to check if the food item belongs to this stall
                // Since items array contains food IDs, we'll need to check the food model
                // For now, we'll check the stalls array in the order
                return order.stalls && order.stalls.includes(stallName);
            });
        });

        // Populate order details with food information
        const populatedOrders = await Promise.all(
            stallOrders.map(async (order) => {
                const stallItems = [];
                let stallTotal = 0;

                for (const item of order.items) {
                    // Handle both old format (full object) and new format (itemId)
                    const itemId = item.itemId || item._id;
                    const food = await foodModel.findById(itemId);
                    if (food && food.stall === stallName) {
                        const quantity = item.quantity || 1;
                        stallItems.push({
                            ...item,
                            quantity: quantity,
                            foodDetails: {
                                name: food.name,
                                price: food.price,
                                image: food.image
                            }
                        });
                        stallTotal += food.price * quantity;
                    }
                }

                return {
                    ...order.toObject(),
                    stallItems,
                    stallTotal
                };
            })
        );

        res.json({ success: true, data: populatedOrders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching stall orders" });
    }
};

// Update order status (for stall owner)
const updateStallOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Order status updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating order status" });
    }
};

export { getStallOrders, updateStallOrderStatus };

