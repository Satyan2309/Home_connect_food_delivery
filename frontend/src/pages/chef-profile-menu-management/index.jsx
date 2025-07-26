import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import MenuCard from './components/MenuCard';
import AddDishModal from './components/AddDishModal';
import OrderCard from './components/OrderCard';
import EarningsChart from './components/EarningsChart';
import ChefProfileCard from './components/ChefProfileCard';

const ChefProfileMenuManagement = () => {
  const [activeTab, setActiveTab] = useState('menu');
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [earningsPeriod, setEarningsPeriod] = useState('daily');
  const [chefProfile, setChefProfile] = useState(null);

  // Mock data initialization
  useEffect(() => {
    // Mock chef profile
    setChefProfile({
      id: 1,
      name: "Sarah Johnson",
      title: "Home Chef & Culinary Artist",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      location: "Downtown, Seattle",
      joinedDate: "Jan 2023",
      rating: 4.8,
      totalOrders: 342,
      followers: 156,
      bio: `Passionate home chef with 8+ years of experience creating authentic Italian and Mediterranean dishes. I believe in using fresh, locally-sourced ingredients to bring traditional flavors to your table. Every meal is prepared with love and attention to detail.`,
      specialties: ["Italian Cuisine", "Mediterranean", "Vegetarian", "Gluten-Free"],
      operatingHours: {
        monday: "9:00 AM - 8:00 PM",
        tuesday: "9:00 AM - 8:00 PM", 
        wednesday: "9:00 AM - 8:00 PM",
        thursday: "9:00 AM - 8:00 PM",
        friday: "9:00 AM - 9:00 PM",
        saturday: "10:00 AM - 9:00 PM",
        sunday: "Closed"
      },
      verificationStatus: "verified",
      isOnline: true
    });

    // Initialize empty menu items array
    setMenuItems([]);

    // Mock active orders
    setActiveOrders([
      {
        id: 10234,
        customerName: "Michael Chen",
        customerPhone: "+1 (555) 123-4567",
        orderTime: new Date(Date.now() - 1800000), // 30 minutes ago
        status: "preparing",
        deliveryAddress: "123 Pine St, Seattle",
        specialInstructions: "Please make it extra spicy and add extra cheese on the lasagna.",
        estimatedTime: 15,
        items: [
          {
            name: "Homemade Lasagna",
            quantity: 2,
            price: 18.99,
            image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=100&h=100&fit=crop"
          }
        ],
        totalAmount: 37.98
      },
      {
        id: 10235,
        customerName: "Emma Rodriguez",
        customerPhone: "+1 (555) 987-6543",
        orderTime: new Date(Date.now() - 600000), // 10 minutes ago
        status: "pending",
        deliveryAddress: "456 Oak Ave, Seattle",
        specialInstructions: null,
        estimatedTime: 25,
        items: [
          {
            name: "Mediterranean Quinoa Bowl",
            quantity: 1,
            price: 14.50,
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop"
          },
          {
            name: "Tiramisu Cups",
            quantity: 2,
            price: 8.99,
            image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=100&h=100&fit=crop"
          }
        ],
        totalAmount: 32.48
      },
      {
        id: 10236,
        customerName: "David Park",
        customerPhone: "+1 (555) 456-7890",
        orderTime: new Date(Date.now() - 300000), // 5 minutes ago
        status: "ready",
        deliveryAddress: "789 Maple Dr, Seattle",
        specialInstructions: "Contactless delivery please",
        estimatedTime: 0,
        items: [
          {
            name: "Mediterranean Quinoa Bowl",
            quantity: 3,
            price: 14.50,
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop"
          }
        ],
        totalAmount: 43.50
      }
    ]);
  }, []);

  // Mock earnings data
  const generateEarningsData = (period) => {
    const data = [];
    const length = period === 'daily' ? 30 : period === 'weekly' ? 12 : 12;
    
    for (let i = 1; i <= length; i++) {
      data.push({
        period: i,
        earnings: Math.random() * 200 + 50,
        orders: Math.floor(Math.random() * 15) + 1
      });
    }
    return data;
  };

  const earningsData = generateEarningsData(earningsPeriod);
  const totalEarnings = earningsData.reduce((sum, item) => sum + item.earnings, 0);
  const pendingPayout = 1247.50;

  const handleAddDish = () => {
    setEditingDish(null);
    setIsAddDishModalOpen(true);
  };

  const handleEditDish = (dish) => {
    setEditingDish(dish);
    setIsAddDishModalOpen(true);
  };

  const handleSaveDish = async (dishData) => {
    if (editingDish) {
      // Update existing dish
      setMenuItems(prev => prev.map(item => 
        item.id === editingDish.id ? { ...dishData, id: editingDish.id } : item
      ));
    } else {
      // Add new dish
      setMenuItems(prev => [...prev, dishData]);
    }
  };

  const handleDeleteDish = async (dishId) => {
    setMenuItems(prev => prev.filter(item => item.id !== dishId));
  };

  const handleToggleAvailability = async (dishId) => {
    setMenuItems(prev => prev.map(item =>
      item.id === dishId ? { ...item, isAvailable: !item.isAvailable } : item
    ));
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setActiveOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleEditProfile = () => {
    // In real app, this would open a profile edit modal
    console.log('Edit profile clicked');
  };

  const tabs = [
    { id: 'menu', label: 'Menu Management', icon: 'ChefHat' },
    { id: 'orders', label: 'Active Orders', icon: 'Clock' },
    { id: 'earnings', label: 'Earnings', icon: 'DollarSign' },
    { id: 'profile', label: 'Profile', icon: 'User' }
  ];

  const getOrdersCount = () => {
    return activeOrders.filter(order => 
      ['pending', 'accepted', 'preparing', 'ready'].includes(order.status)
    ).length;
  };

  return (
    <>
      <Helmet>
        <title>Chef Dashboard - HomeCook Connect</title>
        <meta name="description" content="Manage your menu, track orders, and monitor earnings on HomeCook Connect chef dashboard" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b border-border shadow-warm-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div>
                <Link to="/" className="block">
                  <h1 className="text-2xl font-bold text-foreground hover:text-primary transition-colors">Chef Dashboard</h1>
                </Link>
                <p className="text-sm text-muted-foreground">
                  Manage your culinary business
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-muted-foreground">Online</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Bell" size={16} className="text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {getOrdersCount()} active orders
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                  {tab.id === 'orders' && getOrdersCount() > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-mono">
                      {getOrdersCount()}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Menu Management Tab */}
          {activeTab === 'menu' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Menu Items</h2>
                  <p className="text-sm text-muted-foreground">
                    {menuItems.length} dishes • {menuItems.filter(item => item.isAvailable).length} available
                  </p>
                </div>
                <Button
                  onClick={handleAddDish}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Add New Dish
                </Button>
              </div>

              {menuItems.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="ChefHat" size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No dishes yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Start building your menu by adding your first dish
                  </p>
                  <Button onClick={handleAddDish} iconName="Plus" iconPosition="left">
                    Add Your First Dish
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems.map((dish) => (
                    <MenuCard
                      key={dish.id}
                      dish={dish}
                      onEdit={handleEditDish}
                      onDelete={handleDeleteDish}
                      onToggleAvailability={handleToggleAvailability}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Active Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Active Orders</h2>
                  <p className="text-sm text-muted-foreground">
                    {getOrdersCount()} orders need your attention
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" iconName="RefreshCw">
                    Refresh
                  </Button>
                </div>
              </div>

              {activeOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="Clock" size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No active orders
                  </h3>
                  <p className="text-muted-foreground">
                    New orders will appear here when customers place them
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {activeOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onUpdateStatus={handleUpdateOrderStatus}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Earnings Tab */}
          {activeTab === 'earnings' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Earnings Overview</h2>
                  <p className="text-sm text-muted-foreground">
                    Track your revenue and request payouts
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={earningsPeriod}
                    onChange={(e) => setEarningsPeriod(e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg text-sm bg-card text-foreground"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <Button variant="outline" size="sm" iconName="Download">
                    Export
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <EarningsChart
                  data={earningsData}
                  period={earningsPeriod}
                  totalEarnings={totalEarnings}
                  pendingPayout={pendingPayout}
                />

                {/* Payout Section */}
                <div className="bg-card rounded-xl border border-border shadow-warm-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        Pending Payout
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Available for withdrawal
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        ₹{pendingPayout.toFixed(2)}
                      </p>
                      <Button size="sm" iconName="CreditCard" iconPosition="left">
                        Request Payout
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && chefProfile && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Chef Profile</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your public profile and settings
                  </p>
                </div>
              </div>

              <div className="max-w-2xl">
                <ChefProfileCard
                  profile={chefProfile}
                  onEdit={handleEditProfile}
                />
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit Dish Modal */}
        <AddDishModal
          isOpen={isAddDishModalOpen}
          onClose={() => {
            setIsAddDishModalOpen(false);
            setEditingDish(null);
          }}
          onSave={handleSaveDish}
          editingDish={editingDish}
        />
      </div>
    </>
  );
};

export default ChefProfileMenuManagement;