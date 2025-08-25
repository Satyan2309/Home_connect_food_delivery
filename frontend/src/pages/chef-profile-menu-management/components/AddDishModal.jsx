import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AddDishModal = ({ isOpen, onClose, onSave, editingDish = null }) => {
  const [formData, setFormData] = useState({
    name: editingDish?.name || '',
    description: editingDish?.description || '',
    price: editingDish?.price || '',
    originalPrice: editingDish?.originalPrice || '',
    prepTime: editingDish?.prepTime || '',
    serves: editingDish?.serves || '',
    quantity: editingDish?.quantity || '',
    ingredients: editingDish?.ingredients?.join(', ') || '',
    category: editingDish?.category || '',
    dietaryTags: editingDish?.dietaryTags || [],
    isAvailable: editingDish?.isAvailable ?? true,
    image: editingDish?.image || ''
  });

  const [imagePreview, setImagePreview] = useState(editingDish?.image || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  const categoryOptions = [
    { value: 'appetizers', label: 'Appetizers' },
    { value: 'main-course', label: 'Main Course' },
    { value: 'desserts', label: 'Desserts' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'snacks', label: 'Snacks' },
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' }
  ];

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 
    'Nut-Free', 'Spicy', 'Low-Carb', 'Keto', 'Organic', 'Halal'
  ];

  const handleInputChange = (field, value) => {
    // Validate numeric inputs
    if (typeof value === 'string' && ['price', 'originalPrice', 'prepTime', 'serves', 'quantity'].includes(field)) {
      // Don't update with negative values for numeric fields
      if (value !== '' && parseFloat(value) < 0) {
        return;
      }
      
      // Ensure integers for prepTime, serves, quantity
      if (['prepTime', 'serves', 'quantity'].includes(field) && value !== '' && !Number.isInteger(parseFloat(value))) {
        value = Math.floor(parseFloat(value)).toString();
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDietaryTagChange = (tag, checked) => {
    setFormData(prev => {
      if (checked) {
        // Limit to maximum 5 dietary tags
        if (prev.dietaryTags.length >= 5) {
          alert('You can select up to 5 dietary tags');
          return prev;
        }
        return {
          ...prev,
          dietaryTags: [...prev.dietaryTags, tag]
        };
      } else {
        return {
          ...prev,
          dietaryTags: prev.dietaryTags.filter(t => t !== tag)
        };
      }
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.match('image.*')) {
        alert('Please select an image file (PNG, JPG, etc.)');
        return;
      }
      
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image file is too large. Please select a file under 10MB.');
        return;
      }
      
      setIsUploading(true);
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const imageUrl = e.target.result;
          setImagePreview(imageUrl);
          setFormData(prev => ({
            ...prev,
            image: imageUrl
          }));
        } catch (error) {
          console.error('Error processing image:', error);
          alert('Failed to process the image. Please try another one.');
        } finally {
          setIsUploading(false);
        }
      };
      
      reader.onerror = () => {
        alert('Failed to read the image file. Please try again.');
        setIsUploading(false);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.price || 
          !formData.prepTime || !formData.serves || !formData.quantity || 
          !formData.ingredients || !formData.category) {
        alert('Please fill in all required fields');
        setIsSaving(false);
        return;
      }

      // Validate image
      if (!formData.image) {
        alert('Please upload a dish image');
        setIsSaving(false);
        return;
      }

      const dishData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        prepTime: parseInt(formData.prepTime) || 0,
        serves: parseInt(formData.serves) || 1,
        quantity: parseInt(formData.quantity) || 0,
        ingredients: formData.ingredients.split(',').map(item => item.trim()).filter(Boolean),
        id: editingDish?.id || Date.now(),
        rating: editingDish?.rating || 0,
        reviews: editingDish?.reviews || 0,
        orders: editingDish?.orders || 0,
        isNew: !editingDish
      };

      await onSave(dishData);
      
      // Reset form
      setFormData({
        name: '', description: '', price: '', originalPrice: '', prepTime: '',
        serves: '', quantity: '', ingredients: '', category: '', dietaryTags: [],
        isAvailable: true, image: ''
      });
      setImagePreview('');
      
      onClose();
    } catch (error) {
      console.error('Error saving dish:', error);
      alert('Failed to save dish. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl border border-border shadow-warm-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {editingDish ? 'Edit Dish' : 'Add New Dish'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Dish Image <span className="text-error">*</span>
            </label>
            <div 
              className={`border-2 border-dashed ${!formData.image && 'hover:border-primary'} ${!formData.image ? 'border-border' : 'border-success'} rounded-lg p-6 text-center relative`}
              onClick={() => !isUploading && fileInputRef.current?.click()}
            >
              {isUploading ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                  <p className="text-muted-foreground">Uploading image...</p>
                </div>
              ) : imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Dish preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview('');
                      setFormData(prev => ({ ...prev, image: '' }));
                    }}
                    className="absolute top-2 right-2 bg-error text-error-foreground p-1 rounded-full hover:bg-error/80 transition-colors"
                    aria-label="Remove image"
                  >
                    <Icon name="X" size={16} />
                  </button>
                  <div className="absolute bottom-2 right-2 bg-success/80 text-success-foreground px-2 py-1 rounded-md text-xs">
                    <Icon name="Check" size={12} className="inline mr-1" /> Image uploaded
                  </div>
                </div>
              ) : (
                <div>
                  <Icon name="Upload" size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                aria-label="Upload dish image"
              />
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={<>Dish Name <span className="text-error">*</span></>}
              type="text"
              placeholder="Enter dish name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              error={formData.name === '' ? 'Dish name is required' : ''}
            />
            <Select
              label={<>Category <span className="text-error">*</span></>}
              options={categoryOptions}
              value={formData.category}
              onChange={(value) => handleInputChange('category', value)}
              placeholder="Select category"
              required
              error={formData.category === '' ? 'Category is required' : ''}
            />
          </div>

          <Input
            label={<>Description <span className="text-error">*</span></>}
            type="text"
            placeholder="Describe your dish..."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            required
            error={formData.description === '' ? 'Description is required' : ''}
          />

          <Input
            label={<>Ingredients <span className="text-error">*</span></>}
            type="text"
            placeholder="List ingredients separated by commas"
            value={formData.ingredients}
            onChange={(e) => handleInputChange('ingredients', e.target.value)}
            description="Example: Chicken, Rice, Vegetables, Olive Oil (separate with commas)"
            required
            error={formData.ingredients === '' ? 'Ingredients are required' : ''}
          />

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={<>Price (₹) <span className="text-error">*</span></>}
              type="number"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              min="0"
              step="0.01"
              required
              error={formData.price === '' ? 'Price is required' : parseFloat(formData.price) <= 0 ? 'Price must be greater than 0' : ''}
            />
            <Input
              label="Original Price (₹)"
              type="number"
              placeholder="0.00"
              value={formData.originalPrice}
              onChange={(e) => handleInputChange('originalPrice', e.target.value)}
              min="0"
              step="0.01"
              description="Optional - for showing discounts"
              error={formData.originalPrice !== '' && parseFloat(formData.originalPrice) < parseFloat(formData.price) ? 'Original price should be higher than current price' : ''}
            />
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label={<>Prep Time (minutes) <span className="text-error">*</span></>}
              type="number"
              placeholder="30"
              value={formData.prepTime}
              onChange={(e) => handleInputChange('prepTime', e.target.value)}
              min="1"
              required
              error={formData.prepTime === '' ? 'Prep time is required' : parseInt(formData.prepTime) < 1 ? 'Prep time must be at least 1 minute' : ''}
            />
            <Input
              label={<>Serves <span className="text-error">*</span></>}
              type="number"
              placeholder="2"
              value={formData.serves}
              onChange={(e) => handleInputChange('serves', e.target.value)}
              min="1"
              required
              error={formData.serves === '' ? 'Serves is required' : parseInt(formData.serves) < 1 ? 'Serves must be at least 1' : ''}
            />
            <Input
              label={<>Available Quantity <span className="text-error">*</span></>}
              type="number"
              placeholder="10"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              min="0"
              required
              error={formData.quantity === '' ? 'Available quantity is required' : ''}
            />
          </div>

          {/* Dietary Tags */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Dietary Tags <span className="text-xs text-muted-foreground">(Select up to 5)</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-2">
              {dietaryOptions.map((tag) => (
                <Checkbox
                  key={tag}
                  label={tag}
                  checked={formData.dietaryTags.includes(tag)}
                  onChange={(e) => handleDietaryTagChange(tag, e.target.checked)}
                />
              ))}
            </div>
            {formData.dietaryTags.length > 0 && (
              <div className="text-xs text-muted-foreground">
                Selected tags: {formData.dietaryTags.length}/5
              </div>
            )}
          </div>

          {/* Availability */}
          <Checkbox
            label="Available for orders"
            checked={formData.isAvailable}
            onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
          />

          {/* Actions */}
          <div className="flex space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSaving}
              disabled={isSaving}
              className="flex-1"
            >
              {editingDish ? 'Save Changes' : 'Add New Dish'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDishModal;