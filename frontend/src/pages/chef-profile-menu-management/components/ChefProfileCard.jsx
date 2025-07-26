import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChefProfileCard = ({ profile, onEdit }) => {
  const [isOnline, setIsOnline] = useState(profile.isOnline);

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    // In real app, this would update the backend
  };

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

  return (
    <div className="bg-card rounded-xl border border-border shadow-warm-sm overflow-hidden">
      {/* Cover Image */}
      <div className="h-32 bg-gradient-to-r from-primary/20 to-accent/20 relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleOnlineStatus}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              isOnline 
                ? 'bg-success text-success-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {isOnline ? 'Online' : 'Offline'}
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-6 -mt-16 relative">
        {/* Avatar */}
        <div className="flex items-end justify-between mb-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-card overflow-hidden bg-card">
              <Image
              src={profile.avatar}
              alt={profile.name}
              className="w-full h-full object-cover"
              isAvatar={true}
            />
            </div>
            <div className="absolute -bottom-1 -right-1">
              <div className={`w-6 h-6 rounded-full border-2 border-card flex items-center justify-center ${getVerificationColor(profile.verificationStatus)} bg-card`}>
                <Icon 
                  name={getVerificationIcon(profile.verificationStatus)} 
                  size={14} 
                />
              </div>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            iconName="Edit"
            iconPosition="left"
          >
            Edit Profile
          </Button>
        </div>

        {/* Basic Info */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-foreground mb-1">
            {profile.name}
          </h2>
          <p className="text-muted-foreground mb-2">
            {profile.title}
          </p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="MapPin" size={14} />
              <span>{profile.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" size={14} />
              <span>Joined {profile.joinedDate}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Icon name="Star" size={16} className="text-warning fill-current" />
            </div>
            <p className="font-semibold text-foreground">{profile.rating}</p>
            <p className="text-xs text-muted-foreground">Rating</p>
          </div>
          
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Icon name="ShoppingCart" size={16} className="text-primary" />
            </div>
            <p className="font-semibold text-foreground">{profile.totalOrders}</p>
            <p className="text-xs text-muted-foreground">Orders</p>
          </div>
          
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Icon name="Users" size={16} className="text-success" />
            </div>
            <p className="font-semibold text-foreground">{profile.followers}</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-4">
          <h3 className="font-semibold text-foreground mb-2">About</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {profile.bio}
          </p>
        </div>

        {/* Specialties */}
        <div className="mb-4">
          <h3 className="font-semibold text-foreground mb-2">Specialties</h3>
          <div className="flex flex-wrap gap-2">
            {profile.specialties.map((specialty, index) => (
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
        <div className="mb-4">
          <h3 className="font-semibold text-foreground mb-2">Operating Hours</h3>
          <div className="space-y-1">
            {Object.entries(profile.operatingHours).map(([day, hours]) => (
              <div key={day} className="flex justify-between text-sm">
                <span className="text-muted-foreground capitalize">{day}:</span>
                <span className="text-foreground">{hours}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Status */}
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon 
              name={getVerificationIcon(profile.verificationStatus)} 
              size={16} 
              className={getVerificationColor(profile.verificationStatus)}
            />
            <span className="text-sm font-medium text-foreground">
              Verification Status:
            </span>
            <span className={`text-sm font-medium ${getVerificationColor(profile.verificationStatus)}`}>
              {profile.verificationStatus.charAt(0).toUpperCase() + profile.verificationStatus.slice(1)}
            </span>
          </div>
          {profile.verificationStatus === 'pending' && (
            <p className="text-xs text-muted-foreground mt-1">
              Your documents are being reviewed. This usually takes 1-2 business days.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChefProfileCard;