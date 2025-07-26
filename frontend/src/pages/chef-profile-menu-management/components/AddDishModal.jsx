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
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDietaryTagChange = (tag, checked) => {
    setFormData(prev => ({
      ...prev,
      dietaryTags: checked
        ? [...prev.dietaryTags, tag]
        : prev.dietaryTags.filter(t => t !== tag)
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setImagePreview(imageUrl);
        setFormData(prev => ({
          ...prev,
          image: imageUrl
        }));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const dishData = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      prepTime: parseInt(formData.prepTime),
      serves: parseInt(formData.serves),
      quantity: parseInt(formData.quantity),
      ingredients: formData.ingredients.split(',').map(item => item.trim()).filter(Boolean),
      id: editingDish?.id || Date.now(),
      rating: editingDish?.rating || 0,
      reviews: editingDish?.reviews || 0,
      orders: editingDish?.orders || 0,
      isNew: !editingDish
    };

    await onSave(dishData);
    setIsSaving(false);
    onClose();
    
    // Reset form
    setFormData({
      name: '', description: '', price: '', originalPrice: '', prepTime: '',
      serves: '', quantity: '', ingredients: '', category: '', dietaryTags: [],
      isAvailable: true, image: ''
    });
    setImagePreview('');
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
              Dish Image
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setFormData(prev => ({ ...prev, image: '' }));
                    }}
                    className="absolute top-2 right-2 bg-error text-error-foreground p-1 rounded-full"
                  >
                    <Icon name="X" size={16} />
                  </button>
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
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Dish Name"
              type="text"
              placeholder="Enter dish name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
            <Select
              label="Category"
              options={categoryOptions}
              value={formData.category}
              onChange={(value) => handleInputChange('category', value)}
              placeholder="Select category"
              required
            />
          </div>

          <Input
            label="Description"
            type="text"
            placeholder="Describe your dish..."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            required
          />

          <Input
            label="Ingredients"
            type="text"
            placeholder="List ingredients separated by commas"
            value={formData.ingredients}
            onChange={(e) => handleInputChange('ingredients', e.target.value)}
            description="Separate each ingredient with a comma"
            required
          />

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Price (₹)"
              type="number"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              min="0"
              step="0.01"
              required
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
            />
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Prep Time (minutes)"
              type="number"
              placeholder="30"
              value={formData.prepTime}
              onChange={(e) => handleInputChange('prepTime', e.target.value)}
              min="1"
              required
            />
            <Input
              label="Serves"
              type="number"
              placeholder="2"
              value={formData.serves}
              onChange={(e) => handleInputChange('serves', e.target.value)}
              min="1"
              required
            />
            <Input
              label="Available Quantity"
              type="number"
              placeholder="10"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              min="0"
              required
            />
          </div>

          {/* Dietary Tags */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Dietary Tags
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {dietaryOptions.map((tag) => (
                <Checkbox
                  key={tag}
                  label={tag}
                  checked={formData.dietaryTags.includes(tag)}
                  onChange={(e) => handleDietaryTagChange(tag, e.target.checked)}
                />
              ))}
            </div>
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
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSaving}
              className="flex-1"
            >
              {editingDish ? 'Update Dish' : 'Add Dish'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDishModal;