import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';


const DeliveryTimeSlots = ({ selectedSlot, onSlotSelect, chefAvailability }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);

  // Generate next 7 days
  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const formatDate = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  // Generate time slots based on selected date and chef availability
  useEffect(() => {
    const generateTimeSlots = () => {
      const slots = [];
      const now = new Date();
      const isToday = selectedDate.toDateString() === now.toDateString();
      
      // Mock time slots (in real app, this would come from chef availability)
      const baseSlots = [
        { time: '11:30 AM', label: 'Lunch' },
        { time: '12:00 PM', label: 'Lunch' },
        { time: '12:30 PM', label: 'Lunch' },
        { time: '1:00 PM', label: 'Lunch' },
        { time: '1:30 PM', label: 'Lunch' },
        { time: '6:00 PM', label: 'Dinner' },
        { time: '6:30 PM', label: 'Dinner' },
        { time: '7:00 PM', label: 'Dinner' },
        { time: '7:30 PM', label: 'Dinner' },
        { time: '8:00 PM', label: 'Dinner' }
      ];

      baseSlots.forEach((slot, index) => {
        const [time, period] = slot.time.split(' ');
        const [hours, minutes] = time.split(':');
        let hour24 = parseInt(hours);
        
        if (period === 'PM' && hour24 !== 12) hour24 += 12;
        if (period === 'AM' && hour24 === 12) hour24 = 0;

        const slotDate = new Date(selectedDate);
        slotDate.setHours(hour24, parseInt(minutes), 0, 0);

        // Skip past time slots for today
        if (isToday && slotDate <= now) {
          return;
        }

        // Mock availability (some slots might be unavailable)
        const isAvailable = Math.random() > 0.3; // 70% availability
        const estimatedDelivery = new Date(slotDate);
        estimatedDelivery.setMinutes(estimatedDelivery.getMinutes() + 45); // 45 min prep + delivery

        slots.push({
          id: `${selectedDate.toDateString()}-${slot.time}`,
          time: slot.time,
          label: slot.label,
          date: selectedDate,
          estimatedDelivery: estimatedDelivery.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
          }),
          isAvailable,
          price: slot.label === 'Dinner' ? 2.99 : 1.99 // Different delivery fees
        });
      });

      setAvailableSlots(slots);
    };

    generateTimeSlots();
  }, [selectedDate]);

  const days = getNext7Days();

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
        <Icon name="Clock" size={20} />
        Delivery Time
      </h3>

      {/* Date Selection */}
      <div className="space-y-3">
        <h4 className="font-medium text-foreground">Select Date</h4>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {days.map((date, index) => (
            <button
              key={index}
              onClick={() => setSelectedDate(date)}
              className={`flex-shrink-0 px-4 py-3 rounded-lg border text-center min-w-[80px] transition-colors ${
                selectedDate.toDateString() === date.toDateString()
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/50'
              }`}
            >
              <div className="text-sm font-medium">
                {formatDate(date)}
              </div>
              <div className="text-xs opacity-80">
                {date.toLocaleDateString('en-US', { day: 'numeric' })}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      <div className="space-y-3">
        <h4 className="font-medium text-foreground">Available Time Slots</h4>
        
        {availableSlots.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Clock" size={48} className="mx-auto mb-2 opacity-50" />
            <p>No delivery slots available for this date</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => slot.isAvailable && onSlotSelect(slot)}
                disabled={!slot.isAvailable}
                className={`p-4 rounded-lg border text-left transition-all ${
                  selectedSlot?.id === slot.id
                    ? 'border-primary bg-primary/5'
                    : slot.isAvailable
                    ? 'border-border bg-card hover:border-primary/50' :'border-border bg-muted/50 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon 
                      name={slot.label === 'Lunch' ? 'Sun' : 'Moon'} 
                      size={16} 
                      className={slot.isAvailable ? 'text-primary' : 'text-muted-foreground'} 
                    />
                    <span className="font-medium text-foreground">
                      {slot.time}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    +${slot.price}
                  </span>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>{slot.label} delivery</p>
                  <p className="text-xs">
                    Est. arrival: {slot.estimatedDelivery}
                  </p>
                </div>

                {!slot.isAvailable && (
                  <div className="mt-2 text-xs text-error">
                    Not available
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ASAP Option */}
      <div className="border-t border-border pt-4">
        <button
          onClick={() => onSlotSelect({
            id: 'asap',
            time: 'ASAP',
            label: 'Express',
            date: new Date(),
            estimatedDelivery: new Date(Date.now() + 30 * 60000).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit'
            }),
            isAvailable: true,
            price: 4.99
          })}
          className={`w-full p-4 rounded-lg border text-left transition-all ${
            selectedSlot?.id === 'asap' ?'border-primary bg-primary/5' :'border-border bg-card hover:border-primary/50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Icon name="Zap" size={16} className="text-warning" />
              <span className="font-medium text-foreground">ASAP Delivery</span>
            </div>
            <span className="text-xs text-muted-foreground">+₹4.99</span>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Express delivery</p>
            <p className="text-xs">Est. arrival: 25-35 minutes</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default DeliveryTimeSlots;