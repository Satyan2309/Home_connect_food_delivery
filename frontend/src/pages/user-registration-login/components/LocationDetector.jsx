import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
// Google Maps API integration would be imported here in production
// import { Loader } from '@googlemaps/js-api-loader';

const LocationDetector = ({ onComplete }) => {
  const [locationStatus, setLocationStatus] = useState('detecting'); // detecting, success, error
  const [locationData, setLocationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isManualEntryMode, setIsManualEntryMode] = useState(false);
  const [manualAddress, setManualAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  useEffect(() => {
    // In production, we would load the Google Maps API here
    // Example:
    /*
    const loader = new Loader({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
      version: 'weekly',
      libraries: ['places']
    });
    
    loader.load().then(() => {
      console.log('Google Maps API loaded');
      detectLocation();
    }).catch(err => {
      console.error('Error loading Google Maps API:', err);
      setLocationStatus('error');
      setIsLoading(false);
    });
    */
    
    // For development, we'll just call detectLocation directly
    detectLocation();
  }, []);

  const detectLocation = () => {
    setIsLoading(true);
    setLocationStatus('detecting');

    if (!navigator.geolocation) {
      setLocationStatus('error');
      setIsLoading(false);
      alert('Geolocation is not supported by your browser. Please enter your location manually.');
      return;
    }

    try {
      // Add a timeout to handle cases where the browser might hang on geolocation request
      const timeoutId = setTimeout(() => {
        console.error('Geolocation request timed out manually');
        setLocationStatus('error');
        setIsLoading(false);
        alert('Location request timed out. Please try again or enter your location manually.');
      }, 20000); // 20 second backup timeout
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Clear the backup timeout since we got a response
          clearTimeout(timeoutId);
          
          const { latitude, longitude } = position.coords;
          
          // In production, we would use the Google Maps Geocoding API here
          // Example:
          /*
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
            if (status === 'OK' && results[0]) {
              const addressComponents = results[0].address_components;
              
              // Extract address components
              const streetNumber = addressComponents.find(c => c.types.includes('street_number'))?.long_name || '';
              const route = addressComponents.find(c => c.types.includes('route'))?.long_name || '';
              const locality = addressComponents.find(c => c.types.includes('locality'))?.long_name || '';
              const adminArea = addressComponents.find(c => c.types.includes('administrative_area_level_1'))?.short_name || '';
              const postalCode = addressComponents.find(c => c.types.includes('postal_code'))?.long_name || '';
              const country = addressComponents.find(c => c.types.includes('country'))?.long_name || '';
              
              const formattedAddress = results[0].formatted_address;
              
              const locationData = {
                latitude,
                longitude,
                address: formattedAddress,
                streetAddress: `${streetNumber} ${route}`.trim(),
                city: locality,
                state: adminArea,
                zipCode: postalCode,
                country: country
              };
              
              setLocationData(locationData);
              setLocationStatus('success');
              setIsLoading(false);
              
              // Store location data
              localStorage.setItem('userLocation', JSON.stringify(locationData));
              localStorage.setItem('currentLocation', `${locationData.city}, ${locationData.state}`);
            } else {
              console.error('Geocoder failed:', status);
              setLocationStatus('error');
              setIsLoading(false);
            }
          });
          */
          
          // For development, we'll simulate reverse geocoding
          setTimeout(() => {
            const mockLocationData = {
              latitude,
              longitude,
              address: "123 Main Street, Downtown",
              city: "San Francisco",
              state: "CA",
              zipCode: "94102",
              country: "United States"
            };
            
            setLocationData(mockLocationData);
            setLocationStatus('success');
            setIsLoading(false);
            
            // Store location data
            localStorage.setItem('userLocation', JSON.stringify(mockLocationData));
            localStorage.setItem('currentLocation', `${mockLocationData.city}, ${mockLocationData.state}`);
          }, 2000);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationStatus('error');
          setIsLoading(false);
          
          // Provide specific error messages based on error code
          switch(error.code) {
            case error.PERMISSION_DENIED:
              alert('You denied the request for geolocation. Setting Delhi as your default location.');
              break;
            case error.POSITION_UNAVAILABLE:
              alert('Location information is unavailable. Setting Delhi as your default location.');
              break;
            case error.TIMEOUT:
              alert('The request to get your location timed out. Setting Delhi as your default location.');
              break;
            default:
              alert('An unknown error occurred while trying to get your location. Setting Delhi as your default location.');
              break;
          }
          
          // Set Delhi as the default location when geolocation fails
          const delhiLocationData = {
            latitude: 28.6139,
            longitude: 77.2090,
            address: 'Delhi, India',
            city: 'Delhi',
            state: 'Delhi',
            zipCode: '110001',
            country: 'India'
          };
          
          // Store location data
          localStorage.setItem('userLocation', JSON.stringify(delhiLocationData));
          localStorage.setItem('currentLocation', 'Delhi, India');
          
          // Update state
          setLocationData(delhiLocationData);
          setLocationStatus('success');
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000, // Increased timeout
          maximumAge: 60000 // Reduced max age for fresher results
        }
      );
    } catch (e) {
      console.error('Unexpected error in geolocation:', e);
      setLocationStatus('error');
      setIsLoading(false);
      alert('An unexpected error occurred. Please try again or enter your location manually.');
    }
  };

  const handleManualLocation = () => {
    // Toggle manual entry mode
    setIsManualEntryMode(true);
  };

  const handleManualAddressChange = (e) => {
    const { name, value } = e.target;
    setManualAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleManualAddressSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!manualAddress.street || !manualAddress.city || !manualAddress.state || !manualAddress.zipCode) {
      alert('Please fill in all required fields');
      return;
    }

    // In production, we would use the Google Maps Geocoding API to get coordinates
    // For development, we'll use mock coordinates
    const mockLocationData = {
      latitude: 37.7749,
      longitude: -122.4194,
      address: manualAddress.street,
      city: manualAddress.city,
      state: manualAddress.state,
      zipCode: manualAddress.zipCode,
      country: manualAddress.country
    };
    
    setLocationData(mockLocationData);
    setLocationStatus('success');
    setIsManualEntryMode(false);
    
    // Store location data
    localStorage.setItem('userLocation', JSON.stringify(mockLocationData));
    localStorage.setItem('currentLocation', `${mockLocationData.city}, ${mockLocationData.state}`);
  };

  const handleCancelManualEntry = () => {
    setIsManualEntryMode(false);
  };

  const handleSkip = () => {
    // Set Delhi as the default location when skipped
    const delhiLocationData = {
      latitude: 28.6139,
      longitude: 77.2090,
      address: 'Delhi, India',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001',
      country: 'India'
    };
    
    // Store location data
    localStorage.setItem('userLocation', JSON.stringify(delhiLocationData));
    localStorage.setItem('currentLocation', 'Delhi, India');
    localStorage.setItem('locationSkipped', 'true');
    onComplete();
  };

  const handleConfirm = () => {
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon 
            name={locationStatus === 'success' ? 'MapPin' : locationStatus === 'error' ? 'AlertCircle' : 'Loader'} 
            size={32} 
            color="var(--color-primary)"
            className={locationStatus === 'detecting' ? 'animate-spin' : ''}
          />
        </div>
        
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {locationStatus === 'detecting' && 'Detecting Your Location'}
          {locationStatus === 'success' && 'Location Detected'}
          {locationStatus === 'error' && 'Location Access Denied'}
        </h3>
        
        <p className="text-muted-foreground text-sm">
          {locationStatus === 'detecting' && 'Please allow location access to find nearby home chefs'}
          {locationStatus === 'success' && 'We found your location! This helps us show you nearby home chefs.'}
          {locationStatus === 'error' && 'We need your location to show nearby home chefs. You can enter it manually.'}
        </p>
      </div>

      {locationStatus === 'success' && locationData && (
        <div className="bg-muted rounded-lg p-4 space-y-4">
          <div className="flex items-start space-x-3">
            <Icon name="MapPin" size={20} color="var(--color-primary)" className="mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-foreground">{locationData.address}</p>
              <p className="text-sm text-muted-foreground">
                {locationData.city}, {locationData.state} {locationData.zipCode}
              </p>
            </div>
          </div>
          
          {/* Map Preview */}
          <div className="w-full h-32 bg-muted-foreground/10 rounded-lg overflow-hidden">
            {/* In production, we would use the Google Maps JavaScript API here */}
            {/* Example: */}
            {/*
            <div id="map" style={{ width: '100%', height: '100%' }}></div>
            
            // The map would be initialized in a useEffect hook:
            useEffect(() => {
              if (locationData && window.google) {
                const mapElement = document.getElementById('map');
                const map = new google.maps.Map(mapElement, {
                  center: { lat: locationData.latitude, lng: locationData.longitude },
                  zoom: 14,
                  disableDefaultUI: true,
                  zoomControl: true
                });
                
                new google.maps.Marker({
                  position: { lat: locationData.latitude, lng: locationData.longitude },
                  map: map,
                  title: 'Your Location'
                });
              }
            }, [locationData]);
            */}
            
            {/* For development, we'll use an iframe */}
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              title="Your Location"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}&z=14&output=embed`}
              className="border-0"
            />
          </div>
        </div>
      )}

      <div className="space-y-3">
        {locationStatus === 'detecting' && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="text-muted-foreground"
            >
              Skip for now
            </Button>
          </div>
        )}

        {locationStatus === 'success' && (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={detectLocation}
              iconName="RotateCcw"
              iconPosition="left"
              className="flex-1"
            >
              Detect Again
            </Button>
            <Button
              variant="default"
              onClick={handleConfirm}
              iconName="Check"
              iconPosition="left"
              className="flex-1"
            >
              Confirm Location
            </Button>
          </div>
        )}

        {locationStatus === 'error' && !isManualEntryMode && (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handleManualLocation}
              iconName="Edit"
              iconPosition="left"
              className="flex-1"
            >
              Enter Manually
            </Button>
            <Button
              variant="default"
              onClick={detectLocation}
              iconName="RotateCcw"
              iconPosition="left"
              className="flex-1"
            >
              Try Again
            </Button>
          </div>
        )}
        
        {isManualEntryMode && (
          <form onSubmit={handleManualAddressSubmit} className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Street Address*</label>
                <input
                  type="text"
                  name="street"
                  value={manualAddress.street}
                  onChange={handleManualAddressChange}
                  className="w-full p-2 border border-muted rounded-md"
                  placeholder="123 Main St"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">City*</label>
                  <input
                    type="text"
                    name="city"
                    value={manualAddress.city}
                    onChange={handleManualAddressChange}
                    className="w-full p-2 border border-muted rounded-md"
                    placeholder="San Francisco"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State*</label>
                  <input
                    type="text"
                    name="state"
                    value={manualAddress.state}
                    onChange={handleManualAddressChange}
                    className="w-full p-2 border border-muted rounded-md"
                    placeholder="CA"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Zip Code*</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={manualAddress.zipCode}
                    onChange={handleManualAddressChange}
                    className="w-full p-2 border border-muted rounded-md"
                    placeholder="94102"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={manualAddress.country}
                    onChange={handleManualAddressChange}
                    className="w-full p-2 border border-muted rounded-md"
                    placeholder="United States"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelManualEntry}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                className="flex-1"
              >
                Save Address
              </Button>
            </div>
          </form>
        )}
      </div>

      {locationStatus !== 'detecting' && (
        <div className="text-center">
          <button
            onClick={handleSkip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip and set location later
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationDetector;