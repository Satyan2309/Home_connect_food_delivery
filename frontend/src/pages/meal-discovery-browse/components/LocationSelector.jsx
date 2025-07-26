import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LocationSelector = ({ 
  currentLocation, 
  onLocationChange, 
  isDetecting,
  onDetectStart = () => {} // Default to empty function if not provided
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const inputRef = useRef(null);
  
  // Listen for events to open the location selector
  React.useEffect(() => {
    const handleOpenLocationSelector = () => {
      console.log('openLocationSelector event received');
      setIsExpanded(true);
    };
    
    document.addEventListener('openLocationSelector', handleOpenLocationSelector);
    
    return () => {
      document.removeEventListener('openLocationSelector', handleOpenLocationSelector);
    };
  }, []);
  
  // Debug log for component mount
  React.useEffect(() => {
    console.log('LocationSelector component mounted');
  }, []);

  const recentLocations = [
    "Delhi, India",
    "Noida, Uttar Pradesh, India",
    "Gurgaon, Haryana, India",
    "Faridabad, Haryana, India",
    "Ghaziabad, Uttar Pradesh, India"
  ];

  // Function to get address from coordinates using Geoapify
  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      // Using Geoapify Reverse Geocoding API
      // Using the provided API key directly
      const apiKey = '6f16595dc3c14020bd062d0fcc82ada1';
      console.log('Using Geoapify API to get address from coordinates');
      
      const maskedApiKey = apiKey.substring(0, 5) + '...';
      console.log(`Making API request to: https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${maskedApiKey}`);  // Log URL but hide full API key
      
      // The correct endpoint for Geoapify Reverse Geocoding API
      const apiUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`;
      console.log('Request method: GET');
      
      // Add detailed fetch logging
      console.log('Sending fetch request to Geoapify API...');
      const startTime = Date.now();
      const response = await fetch(apiUrl);
      const requestTime = Date.now() - startTime;
      console.log(`API response received in ${requestTime}ms`);
      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);
      console.log('Response headers:', [...response.headers.entries()]);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`Geocoding API error: ${response.status} - ${response.statusText} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Geoapify API response type:', typeof data);
      console.log('Geoapify API response keys:', Object.keys(data));
      console.log('Geoapify API response structure:', JSON.stringify(data, null, 2).substring(0, 500) + '...');
      
      if (data && data.features && data.features.length > 0) {
        // Handle response format for Geoapify Reverse Geocoding API
        const addressProps = data.features[0].properties;
        console.log('Address properties:', addressProps);
        console.log('Available address fields:', Object.keys(addressProps));
        
        // Format the address based on available properties
        const formattedAddress = [
          addressProps.housenumber,
          addressProps.street,
          addressProps.city || addressProps.county,
          addressProps.state,
          addressProps.postcode
        ].filter(Boolean).join(', ');
        
        console.log('Formatted address components:', [
          addressProps.housenumber,
          addressProps.street,
          addressProps.city || addressProps.county,
          addressProps.state,
          addressProps.postcode
        ].filter(Boolean));
        console.log('Final formatted address:', formattedAddress);
        
        return formattedAddress || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      } else {
        // Fallback to coordinates if no address found
        console.error('No features found in geocoding response. Full response:', JSON.stringify(data));
        return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      }
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      // Return coordinates if geocoding fails
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  };

  const handleDetectLocation = () => {
    // Notify parent component that we're starting detection
    onDetectStart();
    console.log('Starting location detection with detailed logging');
    
    if (navigator.geolocation) {
      try {
        // Add a backup timeout in case the browser hangs on geolocation request
        const timeoutId = setTimeout(() => {
          console.error('Geolocation request timed out manually after 15 seconds');
          alert('Location request timed out. Please try again or enter your address manually.');
        }, 15000); // 15 second backup timeout
        
        console.log('Requesting geolocation from browser with high accuracy...');
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            // Clear the backup timeout since we got a response
            clearTimeout(timeoutId);
            console.log('Got position:', position.coords);
            console.log(`Coordinates: lat=${position.coords.latitude}, lng=${position.coords.longitude}, accuracy=${position.coords.accuracy}m`);
            
            const { latitude, longitude } = position.coords;
            
            // Use reverse geocoding to get a human-readable address
            try {
              console.log(`Attempting to get address from coordinates: ${latitude}, ${longitude}`);
              const address = await getAddressFromCoordinates(latitude, longitude);
              console.log('Resolved address:', address);
              onLocationChange(address);
              
              // Store in localStorage for persistence
              console.log('Storing location in localStorage');
              localStorage.setItem('currentLocation', address);
              console.log('Location successfully updated');
            } catch (geocodeError) {
              console.error('Error in geocoding:', geocodeError);
              console.error('Geocoding error details:', JSON.stringify(geocodeError, Object.getOwnPropertyNames(geocodeError)));
              // Fallback to coordinates if geocoding fails
              const fallbackAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
              console.log('Using fallback coordinates as address:', fallbackAddress);
              onLocationChange(fallbackAddress);
              localStorage.setItem('currentLocation', fallbackAddress);
            }
          },
          (error) => {
            // Clear the backup timeout since we got a response
            clearTimeout(timeoutId);
            
            console.error('Error detecting location:', error);
            console.error('Geolocation error code:', error.code);
            console.error('Geolocation error message:', error.message);
            
            // Show a more user-friendly error message based on the error code
            let errorMessage = 'Unable to detect your location. Setting Delhi as your location.';
            
            switch(error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'Location permission denied. Setting Delhi as your location.';
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'Location information is unavailable. Setting Delhi as your location.';
                break;
              case error.TIMEOUT:
                errorMessage = 'Location request timed out. Setting Delhi as your location.';
                break;
              default:
                errorMessage = `Location error: ${error.message}. Setting Delhi as your location.`;
            }
            
            console.error('User-facing error message:', errorMessage);
            alert(errorMessage);
            
            // Set Delhi as the default location
            const delhiLocation = 'Delhi, India';
            onLocationChange(delhiLocation);
            localStorage.setItem('currentLocation', delhiLocation);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000 // Reduced from 300000 to get fresher results
          }
        );
      } catch (err) {
        console.error('Geolocation error:', err);
        console.error('Unexpected geolocation error details:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
        alert('An error occurred while trying to detect your location. Setting Delhi as your location.');
        
        // Set Delhi as the default location
        const delhiLocation = 'Delhi, India';
        onLocationChange(delhiLocation);
        localStorage.setItem('currentLocation', delhiLocation);
      }
    } else {
      console.error('Geolocation API not supported in this browser');
      alert('Geolocation is not supported by your browser. Setting Delhi as your location.');
      
      // Set Delhi as the default location
      const delhiLocation = 'Delhi, India';
      onLocationChange(delhiLocation);
      localStorage.setItem('currentLocation', delhiLocation);
    }
  };

  const handleLocationSelect = (location) => {
    onLocationChange(location);
    setIsExpanded(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors w-full sm:w-auto"
      >
        <Icon name="MapPin" size={16} className="text-primary" />
        <span className="text-sm font-medium truncate max-w-48">
          {currentLocation}
        </span>
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-warm-lg z-50 min-w-80">
          <div className="p-4">
            {/* Detect Current Location */}
            <Button
              variant="outline"
              fullWidth
              onClick={handleDetectLocation}
              loading={isDetecting}
              iconName="Navigation"
              iconPosition="left"
              className="mb-4"
            >
              {isDetecting ? 'Detecting...' : 'Use Current Location'}
            </Button>

            {/* Recent Locations */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Recent Locations
              </h4>
              {recentLocations.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationSelect(location)}
                  className="flex items-start space-x-3 w-full p-2 hover:bg-muted rounded-lg transition-colors text-left"
                >
                  <Icon name="Clock" size={14} className="text-muted-foreground mt-0.5" />
                  <span className="text-sm text-foreground">{location}</span>
                </button>
              ))}
            </div>

            {/* Manual Entry */}
            <div className="mt-4 pt-4 border-t border-border">
              {!isManualEntry ? (
                <button
                  onClick={() => {
                    setIsManualEntry(true);
                    // Focus the input after rendering
                    setTimeout(() => {
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }, 0);
                  }}
                  className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  <Icon name="Edit" size={14} />
                  <span>Enter address manually</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={manualAddress}
                      onChange={(e) => setManualAddress(e.target.value)}
                      placeholder="Enter your address"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsManualEntry(false);
                        setManualAddress('');
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        if (manualAddress.trim()) {
                          onLocationChange(manualAddress);
                          setIsExpanded(false);
                          setIsManualEntry(false);
                          setManualAddress('');
                        }
                      }}
                      disabled={!manualAddress.trim()}
                      className="flex-1"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;