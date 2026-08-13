import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import MealGrid from '../meal-discovery-browse/components/MealGrid';
import mealService from '../../utils/mealService';

const ChefProfile = () => {
  const { id } = useParams();
  const [chef, setChef] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChefData = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch chef data from an API
        // For now, we'll use mock data
        const mockChefs = [
          {
            id: '1',
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
              sunday: "10:00 AM - 6:00 PM"
            },
            verificationStatus: 'verified',
            isOnline: true
          },
          {
            id: '2',
            name: "Michael Chen",
            title: "Asian Fusion Specialist",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            location: "Capitol Hill, Seattle",
            joinedDate: "Mar 2023",
            rating: 4.6,
            totalOrders: 187,
            followers: 92,
            bio: `Culinary school graduate specializing in Asian fusion cuisine. I blend traditional techniques with modern flavors to create unique dining experiences. All my ingredients are sourced from local Asian markets for authenticity.`,
            specialties: ["Chinese", "Japanese", "Korean", "Fusion"],
            operatingHours: {
              monday: "11:00 AM - 8:00 PM",
              tuesday: "11:00 AM - 8:00 PM", 
              wednesday: "11:00 AM - 8:00 PM",
              thursday: "11:00 AM - 8:00 PM",
              friday: "11:00 AM - 9:00 PM",
              saturday: "11:00 AM - 9:00 PM",
              sunday: "Closed"
            },
            verificationStatus: 'verified',
            isOnline: false
          },
          {
            id: '3',
            name: "Priya Patel",
            title: "Indian Home Cook",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            location: "Bellevue, WA",
            joinedDate: "Feb 2023",
            rating: 4.9,
            totalOrders: 256,
            followers: 120,
            bio: `I learned to cook from my grandmother in Mumbai and bring authentic Indian flavors to every dish. My spice blends are hand-ground and my recipes have been passed down through generations.`,
            specialties: ["North Indian", "South Indian", "Vegetarian", "Vegan"],
            operatingHours: {
              monday: "Closed",
              tuesday: "10:00 AM - 7:00 PM", 
              wednesday: "10:00 AM - 7:00 PM",
              thursday: "10:00 AM - 7:00 PM",
              friday: "10:00 AM - 8:00 PM",
              saturday: "10:00 AM - 8:00 PM",
              sunday: "10:00 AM - 3:00 PM"
            },
            verificationStatus: 'verified',
            isOnline: true
          },
          {
            id: '4',
            name: "Sarah Johnson",
            title: "Vegan Chef",
            avatar: "https://randomuser.me/api/portraits/women/25.jpg",
            location: "Fremont, Seattle",
            joinedDate: "Apr 2023",
            rating: 4.6,
            totalOrders: 156,
            followers: 87,
            bio: `Certified plant-based chef creating nutritious and delicious vegan meals. I focus on whole foods and seasonal ingredients to create dishes that are good for you and the planet.`,
            specialties: ["Vegan", "Plant-based", "Gluten-Free", "Raw"],
            operatingHours: {
              monday: "9:00 AM - 6:00 PM",
              tuesday: "9:00 AM - 6:00 PM", 
              wednesday: "9:00 AM - 6:00 PM",
              thursday: "9:00 AM - 6:00 PM",
              friday: "9:00 AM - 6:00 PM",
              saturday: "10:00 AM - 4:00 PM",
              sunday: "Closed"
            },
            verificationStatus: 'pending',
            isOnline: false
          },
          {
            id: '5',
            name: "Siriporn Tanaka",
            title: "Thai Food Specialist",
            avatar: "https://randomuser.me/api/portraits/women/38.jpg",
            location: "Ballard, Seattle",
            joinedDate: "May 2023",
            rating: 4.8,
            totalOrders: 94,
            followers: 62,
            bio: `Born and raised in Bangkok, I bring authentic Thai flavors to Seattle. My dishes feature traditional techniques and imported Thai ingredients for the most authentic experience outside of Thailand.`,
            specialties: ["Thai", "Southeast Asian", "Spicy", "Street Food"],
            operatingHours: {
              monday: "Closed",
              tuesday: "11:00 AM - 8:00 PM", 
              wednesday: "11:00 AM - 8:00 PM",
              thursday: "11:00 AM - 8:00 PM",
              friday: "11:00 AM - 9:00 PM",
              saturday: "11:00 AM - 9:00 PM",
              sunday: "11:00 AM - 6:00 PM"
            },
            verificationStatus: 'verified',
            isOnline: true
          },
          {
            id: '6',
            name: "Carlos Martinez",
            title: "Latin American Chef",
            avatar: "https://randomuser.me/api/portraits/men/35.jpg",
            location: "West Seattle",
            joinedDate: "Jun 2023",
            rating: 4.5,
            totalOrders: 78,
            followers: 45,
            bio: `Bringing the vibrant flavors of Latin America to your table. My recipes are inspired by my travels throughout Mexico, Peru, and Colombia, featuring authentic techniques and ingredients.`,
            specialties: ["Mexican", "Peruvian", "Colombian", "Street Food"],
            operatingHours: {
              monday: "11:00 AM - 7:00 PM",
              tuesday: "11:00 AM - 7:00 PM", 
              wednesday: "11:00 AM - 7:00 PM",
              thursday: "11:00 AM - 7:00 PM",
              friday: "11:00 AM - 9:00 PM",
              saturday: "11:00 AM - 9:00 PM",
              sunday: "11:00 AM - 5:00 PM"
            },
            verificationStatus: 'verified',
            isOnline: true
          }
        ];

        const foundChef = mockChefs.find(c => c.id === id);
        setChef(foundChef || null);

        // Fetch meals by this chef
        if (foundChef) {
          const chefMeals = await mealService.getMealsByChef(id);
          setMeals(chefMeals);
        }
      } catch (error) {
        console.error('Error fetching chef data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchChefData();
    }
  }, [id]);

  const getVerificationColor = (status) => {
    switch (status) {
      case 'verified': return 'text-success';
      case 'pending': return 'text-warning';
      case 'rejected': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getVerificationIcon = (status) => {
    switch (status) {
      case 'verified': return 'CheckCircle';
      case 'pending': return 'Clock';
      case 'rejected': return 'XCircle';
      default: return 'AlertCircle';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-32 bg-muted rounded-xl mb-8"></div>
            <div className="flex items-start space-x-6">
              <div className="w-32 h-32 bg-muted rounded-full"></div>
              <div className="flex-1">
                <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/4 mb-6"></div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="h-20 bg-muted rounded"></div>
                  <div className="h-20 bg-muted rounded"></div>
                  <div className="h-20 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!chef) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <Icon name="UserX" size={64} className="mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Chef Not Found</h1>
          <p className="text-muted-foreground mb-6">The chef you're looking for doesn't exist or has been removed.</p>
          <Link to="/meal-discovery-browse">
            <Button variant="primary">Browse Meals</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{chef.name} - Chef Profile | HomeCook Connect</title>
        <meta name="description" content={`Order delicious homemade meals from ${chef.name}. ${chef.bio.substring(0, 100)}...`} />
      </Helmet>

      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cover Image */}
        <div className="h-48 md:h-64 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl mb-8 relative">
          <div className="absolute inset-0 bg-black/10 rounded-xl"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chef Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border shadow-warm-sm overflow-hidden sticky top-24">
              {/* Profile Content */}
              <div className="p-6 -mt-16 relative">
                {/* Avatar */}
                <div className="mb-6">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full border-4 border-card overflow-hidden bg-card">
                      <Image
                        src={chef.avatar}
                        alt={chef.name}
                        className="w-full h-full object-cover"
                        isAvatar={true}
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1">
                      <div className={`w-6 h-6 rounded-full border-2 border-card flex items-center justify-center ${getVerificationColor(chef.verificationStatus)} bg-card`}>
                        <Icon 
                          name={getVerificationIcon(chef.verificationStatus)} 
                          size={14} 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-1">
                    <h1 className="text-2xl font-bold text-foreground">
                      {chef.name}
                    </h1>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${chef.isOnline ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                      {chef.isOnline ? 'Online' : 'Offline'}
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-3">
                    {chef.title}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="MapPin" size={14} />
                      <span>{chef.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Calendar" size={14} />
                      <span>Joined {chef.joinedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Icon name="Star" size={16} className="text-warning fill-current" />
                    </div>
                    <p className="font-semibold text-foreground">{chef.rating}</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                  
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Icon name="ShoppingCart" size={16} className="text-primary" />
                    </div>
                    <p className="font-semibold text-foreground">{chef.totalOrders}</p>
                    <p className="text-xs text-muted-foreground">Orders</p>
                  </div>
                  
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Icon name="Users" size={16} className="text-success" />
                    </div>
                    <p className="font-semibold text-foreground">{chef.followers}</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-2">About</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {chef.bio}
                  </p>
                </div>

                {/* Specialties */}
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-2">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {chef.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-2">Operating Hours</h3>
                  <div className="space-y-1">
                    {Object.entries(chef.operatingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="text-muted-foreground capitalize">{day}:</span>
                        <span className="text-foreground">{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Button */}
                <Button className="w-full" variant="primary" iconName="MessageSquare" iconPosition="left">
                  Contact Chef
                </Button>
              </div>
            </div>
          </div>

          {/* Menu Section */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Available Meals</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">{meals.length} meals available</span>
                </div>
              </div>

              {meals.length > 0 ? (
                <MealGrid 
                  meals={meals} 
                  loading={false} 
                  onAddToCart={() => {}} 
                  onToggleFavorite={() => {}} 
                />
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-xl border border-border">
                  <Icon name="UtensilsCrossed" size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Meals Available</h3>
                  <p className="text-muted-foreground">
                    This chef doesn't have any meals available right now.
                    <br />
                    Check back later or browse other chefs.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ChefProfile;