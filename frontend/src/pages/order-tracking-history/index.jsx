import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import ActiveOrderCard from './components/ActiveOrderCard';
import OrderHistoryCard from './components/OrderHistoryCard';
import OrderDetailsModal from './components/OrderDetailsModal';
import ReviewModal from './components/ReviewModal';
import OrderFilters from './components/OrderFilters';
import EmptyState from './components/EmptyState';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const OrderTrackingHistory = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    timeRange: 'all',
    sortBy: 'newest',
    fromDate: '',
    toDate: '',
    minAmount: '',
    maxAmount: '',
    chefName: '',
    minRating: null
  });

  // Mock data for active orders
  const mockActiveOrders = [
    {
      id: 'ORD-2024-001',
      chef: {
        name: 'Maria Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        speciality: 'Mexican Cuisine',
        rating: 4.8,
        location: { lat: 40.7128, lng: -74.0060 },
        phone: '+1 (555) 123-4567'
      },
      status: 'preparing',
      orderTime: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
      estimatedDeliveryTime: new Date(Date.now() + 1800000).toISOString(), // 30 minutes from now
      items: [
        {
          name: 'Chicken Tacos',
          quantity: 3,
          price: 12.99,
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=150',
          description: 'Authentic Mexican chicken tacos with fresh salsa'
        },
        {
          name: 'Guacamole & Chips',
          quantity: 1,
          price: 6.99,
          image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=150',
          description: 'Fresh homemade guacamole with tortilla chips'
        }
      ],
      total: 19.98,
      deliveryAddress: '123 Main St, Apt 4B, New York, NY 10001',
      deliveryFee: 2.99,
      serviceFee: 1.50,
      discount: 0,
      specialInstructions: 'Please ring doorbell twice'
    },
    {
      id: 'ORD-2024-002',
      chef: {
        name: 'David Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        speciality: 'Asian Fusion',
        rating: 4.9,
        location: { lat: 40.7589, lng: -73.9851 },
        phone: '+1 (555) 987-6543'
      },
      status: 'out_for_delivery',
      orderTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      estimatedDeliveryTime: new Date(Date.now() + 900000).toISOString(), // 15 minutes from now
      items: [
        {
          name: 'Pad Thai',
          quantity: 2,
          price: 14.99,
          image: 'https://images.unsplash.com/photo-1559314809-0f31657def5e?w=150',
          description: 'Traditional Thai stir-fried noodles with shrimp'
        }
      ],
      total: 29.98,
      deliveryAddress: '456 Oak Avenue, Brooklyn, NY 11201',
      deliveryFee: 3.99,
      serviceFee: 2.00,
      discount: 5.00,
      specialInstructions: 'Leave at door, text when delivered'
    }
  ];

  // Mock data for order history
  const mockOrderHistory = [
    {
      id: 'ORD-2024-003',
      chef: {
        name: 'Isabella Thompson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        speciality: 'Italian Cuisine',
        rating: 4.7,
        distance: '0.8 miles away'
      },
      status: 'delivered',
      orderDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      deliveryTime: new Date(Date.now() - 82800000).toISOString(), // 23 hours ago
      items: [
        {
          name: 'Homemade Lasagna',
          quantity: 1,
          price: 18.99,
          image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=150',
          description: 'Traditional Italian lasagna with meat sauce'
        },
        {
          name: 'Caesar Salad',
          quantity: 1,
          price: 8.99,
          image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=150',
          description: 'Fresh romaine lettuce with homemade dressing'
        }
      ],
      total: 27.98,
      deliveryAddress: '123 Main St, Apt 4B, New York, NY 10001',
      deliveryFee: 2.99,
      serviceFee: 1.50,
      discount: 0,
      rating: 5,
      review: 'Absolutely delicious! The lasagna was perfectly cooked and the portion size was generous.',
      deliveryPhotos: [
        'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=300',
        'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300'
      ]
    },
    {
      id: 'ORD-2024-004',
      chef: {
        name: 'Ahmed Hassan',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        speciality: 'Middle Eastern',
        rating: 4.6,
        distance: '1.2 miles away'
      },
      status: 'delivered',
      orderDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      deliveryTime: new Date(Date.now() - 169200000).toISOString(), // 47 hours ago
      items: [
        {
          name: 'Chicken Shawarma Plate',
          quantity: 1,
          price: 15.99,
          image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=150',
          description: 'Grilled chicken with rice, vegetables, and tahini sauce'
        },
        {
          name: 'Hummus & Pita',
          quantity: 1,
          price: 7.99,
          image: 'https://images.unsplash.com/photo-1571197119282-7c4e2b2d9c6d?w=150',
          description: 'Creamy hummus with warm pita bread'
        }
      ],
      total: 23.98,
      deliveryAddress: '789 Pine Street, Manhattan, NY 10003',
      deliveryFee: 3.99,
      serviceFee: 1.50,
      discount: 2.50,
      rating: 4,
      review: 'Great flavors and authentic taste. Delivery was on time.'
    },
    {
      id: 'ORD-2024-005',
      chef: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
        speciality: 'American Comfort Food',
        rating: 4.5,
        distance: '0.5 miles away'
      },
      status: 'delivered',
      orderDate: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      deliveryTime: new Date(Date.now() - 255600000).toISOString(), // 71 hours ago
      items: [
        {
          name: 'BBQ Pulled Pork Sandwich',
          quantity: 2,
          price: 13.99,
          image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=150',
          description: 'Slow-cooked pulled pork with homemade BBQ sauce'
        },
        {
          name: 'Mac & Cheese',
          quantity: 1,
          price: 9.99,
          image: 'https://images.unsplash.com/photo-1543826173-1ad6e4b3e8b2?w=150',
          description: 'Creamy three-cheese macaroni'
        }
      ],
      total: 37.97,
      deliveryAddress: '123 Main St, Apt 4B, New York, NY 10001',
      deliveryFee: 2.99,
      serviceFee: 2.00,
      discount: 0
    }
  ];

  const [activeOrders] = useState(mockActiveOrders);
  const [orderHistory, setOrderHistory] = useState(mockOrderHistory);
  const [filteredHistory, setFilteredHistory] = useState(mockOrderHistory);

  // Filter order history based on filters
  useEffect(() => {
    let filtered = [...orderHistory];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm) ||
        order.chef.name.toLowerCase().includes(searchTerm) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm))
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    // Time range filter
    if (filters.timeRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.timeRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case '3months':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case 'custom':
          if (filters.fromDate && filters.toDate) {
            const fromDate = new Date(filters.fromDate);
            const toDate = new Date(filters.toDate);
            filtered = filtered.filter(order => {
              const orderDate = new Date(order.orderDate);
              return orderDate >= fromDate && orderDate <= toDate;
            });
          }
          break;
      }

      if (filters.timeRange !== 'custom') {
        filtered = filtered.filter(order => new Date(order.orderDate) >= filterDate);
      }
    }

    // Amount filters
    if (filters.minAmount) {
      filtered = filtered.filter(order => order.total >= parseFloat(filters.minAmount));
    }
    if (filters.maxAmount) {
      filtered = filtered.filter(order => order.total <= parseFloat(filters.maxAmount));
    }

    // Chef name filter
    if (filters.chefName) {
      const chefName = filters.chefName.toLowerCase();
      filtered = filtered.filter(order => 
        order.chef.name.toLowerCase().includes(chefName)
      );
    }

    // Rating filter
    if (filters.minRating) {
      filtered = filtered.filter(order => 
        order.rating && order.rating >= filters.minRating
      );
    }

    // Sort orders
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
        break;
      case 'highest_amount':
        filtered.sort((a, b) => b.total - a.total);
        break;
      case 'lowest_amount':
        filtered.sort((a, b) => a.total - b.total);
        break;
    }

    setFilteredHistory(filtered);
  }, [filters, orderHistory]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleContactChef = (chef) => {
    // Simulate contacting chef
    alert(`Contacting ${chef.name} at ${chef.phone}`);
  };

  const handleReorder = (order) => {
    // Simulate reorder functionality
    alert(`Reordering items from ${order.chef.name}. Redirecting to cart...`);
  };

  const handleWriteReview = (order) => {
    setSelectedOrder(order);
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (reviewData) => {
    // Simulate review submission
    const updatedHistory = orderHistory.map(order => {
      if (order.id === reviewData.orderId) {
        return {
          ...order,
          rating: reviewData.rating,
          review: reviewData.review,
          deliveryRating: reviewData.deliveryRating
        };
      }
      return order;
    });
    
    setOrderHistory(updatedHistory);
    alert('Review submitted successfully!');
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      timeRange: 'all',
      sortBy: 'newest',
      fromDate: '',
      toDate: '',
      minAmount: '',
      maxAmount: '',
      chefName: '',
      minRating: null
    });
  };

  return (
    <>
      <Helmet>
        <title>Order Tracking & History - HomeCook Connect</title>
        <meta name="description" content="Track your active orders and view order history on HomeCook Connect. Real-time delivery tracking and comprehensive order management." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              My Orders
            </h1>
            <p className="text-muted-foreground">
              Track your active deliveries and browse your order history
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center space-x-1 mb-8 bg-muted/50 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'active' ?'bg-card text-foreground shadow-warm-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Icon name="Truck" size={16} />
                <span>Active Orders</span>
                {activeOrders.length > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                    {activeOrders.length}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'history' ?'bg-card text-foreground shadow-warm-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} />
                <span>Order History</span>
              </div>
            </button>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8">
              {activeTab === 'active' ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground">
                      Active Orders ({activeOrders.length})
                    </h2>
                    {activeOrders.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="RefreshCw"
                        iconPosition="left"
                      >
                        Refresh
                      </Button>
                    )}
                  </div>

                  {activeOrders.length === 0 ? (
                    <EmptyState type="no-active-orders" />
                  ) : (
                    <div className="space-y-6">
                      {activeOrders.map((order) => (
                        <ActiveOrderCard
                          key={order.id}
                          order={order}
                          onViewDetails={handleViewDetails}
                          onContactChef={handleContactChef}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground">
                      Order History ({filteredHistory.length})
                    </h2>
                  </div>

                  {/* Filters */}
                  <OrderFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    onClearFilters={handleClearFilters}
                    isExpanded={isFiltersExpanded}
                    onToggleExpanded={() => setIsFiltersExpanded(!isFiltersExpanded)}
                  />

                  {filteredHistory.length === 0 ? (
                    <EmptyState 
                      type={orderHistory.length === 0 ? "no-order-history" : "no-search-results"}
                      onClearFilters={handleClearFilters}
                    />
                  ) : (
                    <div className="space-y-4">
                      {filteredHistory.map((order) => (
                        <OrderHistoryCard
                          key={order.id}
                          order={order}
                          onReorder={handleReorder}
                          onViewDetails={handleViewDetails}
                          onWriteReview={handleWriteReview}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-card rounded-xl border border-border shadow-warm-sm p-6 sticky top-24">
                <h3 className="font-semibold text-foreground mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Active Orders</span>
                    <span className="font-medium text-foreground">{activeOrders.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Orders</span>
                    <span className="font-medium text-foreground">{orderHistory.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">This Month</span>
                    <span className="font-medium text-foreground">
                      {orderHistory.filter(order => {
                        const orderDate = new Date(order.orderDate);
                        const now = new Date();
                        return orderDate.getMonth() === now.getMonth() && 
                               orderDate.getFullYear() === now.getFullYear();
                      }).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Favorite Chef</span>
                    <span className="font-medium text-foreground">Maria R.</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="font-medium text-foreground mb-3">Need Help?</h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      iconName="MessageCircle"
                      iconPosition="left"
                    >
                      Contact Support
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      iconName="HelpCircle"
                      iconPosition="left"
                    >
                      Order FAQ
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Modals */}
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          onReorder={handleReorder}
          onWriteReview={handleWriteReview}
        />

        <ReviewModal
          order={selectedOrder}
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onSubmitReview={handleSubmitReview}
        />
      </div>
    </>
  );
};

export default OrderTrackingHistory;