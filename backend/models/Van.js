const mongoose = require('mongoose');

const vanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Sprinter', 'Transit', 'Metris', 'Other']
  },
  year: {
    type: Number,
    required: true
  },
  seating: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  features: [{
    type: String
  }],
  thumbnailImage: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  pricing: {
    hourlyRate: {
      type: Number,
      required: true
    },
    dailyRate: {
      type: Number,
      required: true
    },
    weeklyRate: {
      type: Number
    },
    deposit: {
      type: Number,
      required: true,
      default: 500
    },
    insuranceFee: {
      type: Number,
      required: true,
      default: 75
    },
    destinationFee: {
      type: Number,
      default: 0
    },
    minimumHours: {
      type: Number,
      default: 4
    }
  },
  availability: {
    type: Boolean,
    default: true
  },
  bookedDates: [{
    startDate: Date,
    endDate: Date,
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Method to check if van is available for given dates
vanSchema.methods.isAvailableForDates = function(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  for (const booked of this.bookedDates) {
    const bookedStart = new Date(booked.startDate);
    const bookedEnd = new Date(booked.endDate);

    // Check for overlap
    if (start < bookedEnd && end > bookedStart) {
      return false;
    }
  }
  return true;
};

// Method to calculate rental price
vanSchema.methods.calculatePrice = function(startDate, endDate, includeDestinationFee = false) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const hours = Math.ceil((end - start) / (1000 * 60 * 60));
  const days = Math.ceil(hours / 24);

  let rentalFee = 0;

  if (days >= 7 && this.pricing.weeklyRate) {
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    rentalFee = (weeks * this.pricing.weeklyRate) + (remainingDays * this.pricing.dailyRate);
  } else if (hours >= 24) {
    rentalFee = days * this.pricing.dailyRate;
  } else {
    rentalFee = Math.max(hours, this.pricing.minimumHours) * this.pricing.hourlyRate;
  }

  const destinationFee = includeDestinationFee ? this.pricing.destinationFee : 0;
  const subtotal = rentalFee + destinationFee + this.pricing.insuranceFee;
  const total = subtotal + this.pricing.deposit;

  return {
    rentalFee,
    deposit: this.pricing.deposit,
    insuranceFee: this.pricing.insuranceFee,
    destinationFee,
    subtotal,
    total,
    hours,
    days
  };
};

module.exports = mongoose.model('Van', vanSchema);
