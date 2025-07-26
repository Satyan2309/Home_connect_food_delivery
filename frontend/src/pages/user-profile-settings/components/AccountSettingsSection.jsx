import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const AccountSettingsSection = ({ onUpdateSettings }) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    showOnlineStatus: false,
    allowDirectMessages: true,
    shareOrderHistory: false
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePassword = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async () => {
    if (validatePassword()) {
      try {
        // Import userService dynamically to avoid circular dependencies
        const { userService } = await import('../../../utils');
        
        // Call the API to update password
        await userService.updatePassword({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        });
        
        console.log('Password updated successfully');
        setShowPasswordForm(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setErrors({});
        
        // Show success message (could use a toast notification here)
      } catch (error) {
        console.error('Failed to update password:', error);
        // Set error for current password if server returns authentication error
        if (error.includes('current password')) {
          setErrors(prev => ({
            ...prev,
            currentPassword: 'Current password is incorrect'
          }));
        } else {
          // Generic error handling
          setErrors(prev => ({
            ...prev,
            form: 'Failed to update password. Please try again.'
          }));
        }
      }
    }
  };

  const handlePrivacyChange = async (key, checked) => {
    // Update local state immediately for responsive UI
    setPrivacySettings(prev => ({
      ...prev,
      [key]: checked
    }));
    
    try {
      // Import userService dynamically to avoid circular dependencies
      const { userService } = await import('../../../utils');
      
      // In a real implementation, this would update user preferences via API
      // We'll use the updatePreferences method with the privacy settings
      await userService.updatePreferences({
        privacy: {
          ...privacySettings,
          [key]: checked
        }
      });
      
      console.log(`Privacy setting '${key}' updated to: ${checked}`);
    } catch (error) {
      console.error('Failed to update privacy settings:', error);
      
      // Revert the local state change if the API call fails
      setPrivacySettings(prev => ({
        ...prev,
        [key]: !checked
      }));
      
      // Could show an error message to the user here
    }
  };

  const handleDataExport = async () => {
    try {
      // Import userService dynamically to avoid circular dependencies
      const { userService } = await import('../../../utils');
      
      // In a real implementation, this would call an API endpoint to get user data
      // For now, we'll use the getUserProfile method and add mock order data
      const userProfile = await userService.getUserProfile();
      
      // Combine with mock order data since we don't have a specific export endpoint yet
      const exportData = {
        profile: userProfile,
        orders: 'Order history data would come from a real API...',
        preferences: userProfile.preferences || {},
        exportDate: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'homecook-connect-data.json';
      link.click();
      URL.revokeObjectURL(url);
      
      console.log('User data exported successfully');
    } catch (error) {
      console.error('Failed to export user data:', error);
      // Could show an error message to the user here
    }
  };

  const handleAccountDeletion = async () => {
    try {
      // Import userService and authService dynamically to avoid circular dependencies
      const { userService, authService } = await import('../../../utils');
      
      // Call the API to delete the account
      await userService.deleteAccount();
      
      console.log('Account deleted successfully');
      
      // Close the confirmation modal
      setShowDeleteConfirm(false);
      
      // Log the user out after account deletion
      await authService.logout();
      
      // Redirect to home page or login page
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to delete account:', error);
      setShowDeleteConfirm(false);
      // Could show an error message to the user here
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-warm-sm">
      <h2 className="text-xl font-semibold text-foreground mb-6">Account Settings</h2>

      <div className="space-y-8">
        {/* Password Management */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium text-foreground flex items-center">
                <Icon name="Lock" size={18} className="mr-2 text-warning" />
                Password & Security
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Keep your account secure with a strong password
              </p>
            </div>
            {!showPasswordForm && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPasswordForm(true)}
              >
                Change Password
              </Button>
            )}
          </div>

          {showPasswordForm && (
            <div className="border border-border rounded-lg p-4 bg-muted/20">
              <div className="space-y-4">
                <Input
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  error={errors.currentPassword}
                  required
                  placeholder="Enter current password"
                />
                
                <Input
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  error={errors.newPassword}
                  required
                  placeholder="Enter new password"
                  description="Must be at least 8 characters with uppercase, lowercase, and number"
                />
                
                <Input
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  error={errors.confirmPassword}
                  required
                  placeholder="Confirm new password"
                />

                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                      setErrors({});
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handlePasswordSubmit}
                  >
                    Update Password
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 bg-muted/50 rounded-lg p-3">
            <div className="flex items-start space-x-3">
              <Icon name="Shield" size={16} className="text-success mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-muted-foreground">
                  Add an extra layer of security to your account (Coming Soon)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Controls */}
        <div>
          <h3 className="font-medium text-foreground mb-4 flex items-center">
            <Icon name="Eye" size={18} className="mr-2 text-secondary" />
            Privacy Controls
          </h3>
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <Checkbox
                label="Make Profile Visible"
                description="Allow other users to see your profile and reviews"
                checked={privacySettings.profileVisible}
                onChange={(e) => handlePrivacyChange('profileVisible', e.target.checked)}
              />
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <Checkbox
                label="Show Online Status"
                description="Let chefs know when you're actively browsing"
                checked={privacySettings.showOnlineStatus}
                onChange={(e) => handlePrivacyChange('showOnlineStatus', e.target.checked)}
              />
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <Checkbox
                label="Allow Direct Messages"
                description="Let chefs send you messages about special offers"
                checked={privacySettings.allowDirectMessages}
                onChange={(e) => handlePrivacyChange('allowDirectMessages', e.target.checked)}
              />
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <Checkbox
                label="Share Order History"
                description="Help improve recommendations by sharing anonymous order data"
                checked={privacySettings.shareOrderHistory}
                onChange={(e) => handlePrivacyChange('shareOrderHistory', e.target.checked)}
              />
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div>
          <h3 className="font-medium text-foreground mb-4 flex items-center">
            <Icon name="Database" size={18} className="mr-2 text-accent" />
            Data Management
          </h3>
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Export Your Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Download a copy of your profile, orders, and preferences
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDataExport}
                  iconName="Download"
                  iconPosition="left"
                >
                  Export
                </Button>
              </div>
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Clear Order History</h4>
                  <p className="text-sm text-muted-foreground">
                    Remove all past orders from your account (cannot be undone)
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Trash2"
                  iconPosition="left"
                >
                  Clear History
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Account Deletion */}
        <div>
          <h3 className="font-medium text-foreground mb-4 flex items-center">
            <Icon name="AlertTriangle" size={18} className="mr-2 text-error" />
            Danger Zone
          </h3>
          <div className="border border-error/20 bg-error/5 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">Delete Account</h4>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                iconName="Trash2"
                iconPosition="left"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg border border-border p-6 max-w-md w-full">
              <div className="flex items-center space-x-3 mb-4">
                <Icon name="AlertTriangle" size={24} className="text-error" />
                <h3 className="text-lg font-semibold text-foreground">Delete Account</h3>
              </div>
              
              <p className="text-muted-foreground mb-6">
                Are you sure you want to delete your account? This action cannot be undone and will:
              </p>
              
              <ul className="text-sm text-muted-foreground mb-6 space-y-1">
                <li>• Remove all your personal information</li>
                <li>• Delete your order history</li>
                <li>• Cancel any active orders</li>
                <li>• Remove all saved addresses and payment methods</li>
              </ul>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleAccountDeletion}
                  className="flex-1"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSettingsSection;