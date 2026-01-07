// Booking Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize booking page
    initBookingPage();
    
    // Setup event listeners
    setupBookingListeners();
    
    // Load booking data from URL or localStorage
    loadBookingData();
});

// Initialize Booking Page
function initBookingPage() {
    // Show skeleton loader for prices
    showContentLoader('price-breakdown', 'Calculating prices...');
    
    // Set default dates
    const today = new Date();
    const checkin = new Date(today);
    checkin.setDate(checkin.getDate() + 1);
    
    const checkout = new Date(checkin);
    checkout.setDate(checkout.getDate() + 5);
    
    // Format and display dates
    document.getElementById('summaryCheckin').textContent = formatDate(checkin);
    document.getElementById('summaryCheckout').textContent = formatDate(checkout);
    
    // Calculate and display nights
    const nights = calculateNights(checkin, checkout);
    document.querySelector('.summary-dates .date-display:last-child').textContent = `${nights} nights`;
    
    // Calculate and update prices after delay
    setTimeout(() => {
        updatePrices();
        // Hide loader
        const loader = document.querySelector('#price-breakdown .content-loader');
        if (loader) loader.remove();
    }, 1000);
    
    // Add animation to booking summary
    const summaryCard = document.querySelector('.booking-summary-card');
    if (summaryCard) {
        summaryCard.classList.add('animate-slide-in');
    }
}

// Load Booking Data
function loadBookingData() {
    // Try to get hotel ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const hotelId = urlParams.get('hotelId');
    
    if (hotelId) {
        // Load hotel data
        const hotel = getHotelData(hotelId);
        if (hotel) {
            updateHotelDisplay(hotel);
        }
    }
    
    // Load guest data from localStorage if available
    const savedGuests = localStorage.getItem('bookingGuests');
    if (savedGuests) {
        const guests = JSON.parse(savedGuests);
        document.getElementById('firstName').value = guests.firstName || '';
        document.getElementById('lastName').value = guests.lastName || '';
        document.getElementById('guestEmail').value = guests.email || '';
        document.getElementById('guestPhone').value = guests.phone || '';
    }
}

// Get Hotel Data
function getHotelData(hotelId) {
    const hotels = {
        '1': {
            name: 'Grand Luxury Hotel & Spa',
            location: 'Kuala Lumpur, Malaysia',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
            rooms: [
                { id: 'deluxe', name: 'Deluxe King Room', price: 289, amenities: ['Free WiFi', 'Smart TV', 'Coffee Maker', 'Air Conditioning'] },
                { id: 'premium', name: 'Premium Suite', price: 389, amenities: ['Free WiFi', 'Jacuzzi', 'Mini Bar', 'Butler Service'] },
                { id: 'family', name: 'Family Room', price: 329, amenities: ['Free WiFi', 'Kids Amenities', 'Game Console', 'Kitchenette'] }
            ]
        },
        '2': {
            name: 'Beachfront Resort & Villas',
            location: 'Bali, Indonesia',
            image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop',
            rooms: [
                { id: 'deluxe', name: 'Ocean View Room', price: 199, amenities: ['Beach Access', 'Free Breakfast', 'Balcony', 'Mini Bar'] },
                { id: 'villa', name: 'Private Villa', price: 499, amenities: ['Private Pool', 'Butler Service', 'Kitchen', 'Garden'] }
            ]
        }
    };
    
    return hotels[hotelId] || hotels['1']; // Default to first hotel
}

// Update Hotel Display
function updateHotelDisplay(hotel) {
    document.getElementById('hotelName').textContent = hotel.name;
    document.getElementById('hotelLocation').textContent = hotel.location;
    document.querySelector('.hotel-image').src = hotel.image;
    
    // Update room options if different hotel
    // Note: In a real app, you'd dynamically generate room options
}

// Format Date
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Calculate Nights
function calculateNights(checkin, checkout) {
    const timeDiff = checkout.getTime() - checkin.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

// Setup Event Listeners
function setupBookingListeners() {
    // Room selection
    document.querySelectorAll('.room-option').forEach(room => {
        room.addEventListener('click', function() {
            selectRoom(this);
        });
    });
    
    // Edit guests button
    const editGuestsBtn = document.getElementById('editGuestsBtn');
    if (editGuestsBtn) {
        editGuestsBtn.addEventListener('click', openGuestModal);
    }
    
    // Guest modal
    const guestModal = document.getElementById('guestModal');
    if (guestModal) {
        const modalClose = guestModal.querySelector('.modal-close');
        const btnCancel = guestModal.querySelector('.btn-cancel');
        const btnApply = guestModal.querySelector('.btn-apply');
        
        if (modalClose) {
            modalClose.addEventListener('click', closeGuestModal);
        }
        
        if (btnCancel) {
            btnCancel.addEventListener('click', closeGuestModal);
        }
        
        if (btnApply) {
            btnApply.addEventListener('click', function() {
                const restoreBtn = showButtonLoader(this, 'Applying...');
                setTimeout(() => {
                    applyGuestChanges();
                    restoreBtn();
                }, 500);
            });
        }
        
        // Counter buttons in modal
        guestModal.querySelectorAll('.counter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                this.classList.add('animate-bounce');
                setTimeout(() => {
                    this.classList.remove('animate-bounce');
                }, 300);
                
                const type = this.getAttribute('data-type');
                const action = this.getAttribute('data-action');
                updateGuestCounter(type, action);
            });
        });
    }
    
    // Continue to payment button - FIXED VERSION
    const continueBtn = document.getElementById('continueToPayment');
    if (continueBtn) {
        continueBtn.addEventListener('click', function(e) {
            e.preventDefault();
            proceedToPayment();
        });
    }
    
    // Form validation
    const guestForm = document.getElementById('guestForm');
    if (guestForm) {
        guestForm.addEventListener('input', function() {
            validateForm();
            // Add validation animation
            const inputs = this.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                if (input.value) {
                    input.classList.add('valid');
                } else {
                    input.classList.remove('valid');
                }
            });
        });
    }
}

// Select Room with Animation
function selectRoom(roomElement) {
    // Add click animation
    roomElement.classList.add('animate-bounce');
    setTimeout(() => {
        roomElement.classList.remove('animate-bounce');
    }, 500);
    
    // Remove selected class from all rooms
    document.querySelectorAll('.room-option').forEach(room => {
        room.classList.remove('selected');
        const btn = room.querySelector('.select-room-btn');
        btn.textContent = 'Select Room';
        btn.classList.remove('selected');
        btn.innerHTML = 'Select Room';
    });
    
    // Add selected class to clicked room
    roomElement.classList.add('selected');
    const selectBtn = roomElement.querySelector('.select-room-btn');
    selectBtn.textContent = 'Selected';
    selectBtn.classList.add('selected');
    selectBtn.innerHTML = 'Selected <i class="fas fa-check"></i>';
    
    // Update booking summary with animation
    const roomName = roomElement.querySelector('h3').textContent;
    const roomPrice = roomElement.querySelector('.price').textContent;
    
    const roomNameElement = document.getElementById('selectedRoomName');
    const roomPriceElement = document.querySelector('.room-price');
    
    roomNameElement.classList.add('animate-fade-in');
    roomPriceElement.classList.add('animate-fade-in');
    
    setTimeout(() => {
        roomNameElement.textContent = roomName;
        roomPriceElement.textContent = `$${roomPrice}/night`;
        
        setTimeout(() => {
            roomNameElement.classList.remove('animate-fade-in');
            roomPriceElement.classList.remove('animate-fade-in');
        }, 500);
    }, 250);
    
    // Update prices
    updatePrices();
}

// Open Guest Modal with Animation
function openGuestModal() {
    const modal = document.getElementById('guestModal');
    const currentGuests = document.getElementById('guestCount').textContent;
    
    // Parse current guest count
    const match = currentGuests.match(/(\d+) adults?, (\d+) children?/);
    if (match) {
        document.getElementById('modalAdults').textContent = match[1];
        document.getElementById('modalChildren').textContent = match[2];
    }
    
    modal.style.display = 'flex';
    if (modal.querySelector('.modal-content')) {
        modal.querySelector('.modal-content').classList.add('animate-fade-in');
    }
}

// Close Guest Modal
function closeGuestModal() {
    document.getElementById('guestModal').style.display = 'none';
}

// Update Guest Counter
function updateGuestCounter(type, action) {
    const counterElement = document.getElementById(`modal${type.charAt(0).toUpperCase() + type.slice(1)}`);
    let value = parseInt(counterElement.textContent);
    
    if (action === 'increase') {
        if (type === 'adults' && value < 10) value++;
        if (type === 'children' && value < 5) value++;
        if (type === 'rooms' && value < 5) value++;
    } else if (action === 'decrease') {
        if (type === 'adults' && value > 1) value--;
        if (type === 'children' && value > 0) value--;
        if (type === 'rooms' && value > 1) value--;
    }
    
    counterElement.textContent = value;
}

// Apply Guest Changes
function applyGuestChanges() {
    const adults = parseInt(document.getElementById('modalAdults').textContent);
    const children = parseInt(document.getElementById('modalChildren').textContent);
    const rooms = parseInt(document.getElementById('modalRooms').textContent);
    
    // Update display
    const guestText = `${adults} adult${adults !== 1 ? 's' : ''}, ${children} child${children !== 1 ? 'ren' : ''}`;
    document.getElementById('guestCount').textContent = guestText;
    
    // Close modal
    closeGuestModal();
    
    // Update prices (room count affects price)
    updatePrices();
}

// Update Prices
function updatePrices() {
    // Get selected room price
    const selectedRoom = document.querySelector('.room-option.selected');
    if (!selectedRoom) return;
    
    const priceText = selectedRoom.querySelector('.price').textContent;
    const roomPrice = parseInt(priceText.replace('$', ''));
    
    // Get number of nights
    const nightsText = document.querySelector('.summary-dates .date-display:last-child').textContent;
    const nights = parseInt(nightsText);
    
    // Get number of rooms
    const roomsText = document.getElementById('modalRooms').textContent;
    const rooms = parseInt(roomsText) || 1;
    
    // Calculate prices
    const roomTotal = roomPrice * nights * rooms;
    const taxes = roomTotal * 0.15; // 15% tax
    const serviceCharge = 50 * rooms;
    const discount = roomTotal * 0.25; // 25% discount
    const finalTotal = roomTotal + taxes + serviceCharge - discount;
    
    // Update display
    document.getElementById('roomTotal').textContent = `$${roomTotal.toFixed(2)}`;
    document.getElementById('taxesTotal').textContent = `$${taxes.toFixed(2)}`;
    document.getElementById('discountTotal').textContent = `$${discount.toFixed(2)}`;
    document.getElementById('finalTotal').textContent = `$${finalTotal.toFixed(2)}`;
}

// Validate Form
function validateForm() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('guestEmail').value;
    const phone = document.getElementById('guestPhone').value;
    const continueBtn = document.getElementById('continueToPayment');
    
    const isValid = firstName && lastName && validateEmail(email) && phone;
    
    if (continueBtn) {
        continueBtn.disabled = !isValid;
        continueBtn.style.opacity = isValid ? '1' : '0.7';
        continueBtn.style.cursor = isValid ? 'pointer' : 'not-allowed';
    }
    
    return isValid;
}

// Validate Email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Enhanced Proceed to Payment Function
function proceedToPayment() {
    // Show processing loader
    const continueBtn = document.getElementById('continueToPayment');
    const originalText = continueBtn.innerHTML;
    
    continueBtn.innerHTML = `
        <span class="btn-loader">
            <div class="spinner"></div>
            Processing...
        </span>
    `;
    continueBtn.disabled = true;
    
    // Validate all required fields
    if (!validateBookingForm()) {
        alert('Please fill in all required guest information');
        restoreContinueButton(continueBtn, originalText);
        return;
    }
    
    // Save booking data
    saveBookingData();
    
    // Simulate processing delay
    setTimeout(() => {
        // Navigate to payment page
        window.location.href = 'payment.html';
        
        // Restore button (though page will redirect)
        restoreContinueButton(continueBtn, originalText);
    }, 1500);
}

// Validate booking form (enhanced)
function validateBookingForm() {
    const firstName = document.getElementById('firstName')?.value.trim();
    const lastName = document.getElementById('lastName')?.value.trim();
    const email = document.getElementById('guestEmail')?.value.trim();
    const phone = document.getElementById('guestPhone')?.value.trim();
    
    // Basic validation
    if (!firstName || !lastName || !email || !phone) {
        alert('Please fill in all required fields (First Name, Last Name, Email, Phone)');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    // Phone validation
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
        alert('Please enter a valid phone number (at least 10 digits)');
        return false;
    }
    
    return true;
}

// Save booking data to localStorage
function saveBookingData() {
    try {
        const bookingData = {
            hotel: {
                name: document.getElementById('hotelName').textContent,
                location: document.getElementById('hotelLocation').textContent,
                image: document.querySelector('.hotel-image')?.src || ''
            },
            room: {
                name: document.getElementById('selectedRoomName').textContent,
                price: parseFloat(document.querySelector('.room-price')?.textContent.replace(/[^0-9.]/g, '') || '0')
            },
            dates: {
                checkin: document.getElementById('summaryCheckin').textContent,
                checkout: document.getElementById('summaryCheckout').textContent,
                nights: parseInt(document.querySelector('.summary-dates .date-display:last-child')?.textContent || '0')
            },
            guests: document.getElementById('guestCount').textContent,
            guestInfo: {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('guestEmail').value,
                phone: document.getElementById('guestPhone').value,
                specialRequests: document.getElementById('specialRequests')?.value || ''
            },
            price: {
                room: parseFloat(document.getElementById('roomTotal')?.textContent.replace(/[^0-9.]/g, '') || '0'),
                taxes: parseFloat(document.getElementById('taxesTotal')?.textContent.replace(/[^0-9.]/g, '') || '0'),
                discount: parseFloat(document.getElementById('discountTotal')?.textContent.replace(/[^0-9.]/g, '') || '0'),
                total: parseFloat(document.getElementById('finalTotal')?.textContent.replace(/[^0-9.]/g, '') || '0')
            },
            timestamp: new Date().toISOString(),
            bookingId: 'BK' + Date.now().toString().slice(-8)
        };
        
        // Save to localStorage
        localStorage.setItem('currentBooking', JSON.stringify(bookingData));
        localStorage.setItem('bookingData', JSON.stringify(bookingData));
        
        // Also save guest info separately
        localStorage.setItem('bookingGuests', JSON.stringify(bookingData.guestInfo));
        
        console.log('Booking data saved:', bookingData);
        
    } catch (error) {
        console.error('Error saving booking data:', error);
    }
}

// Restore continue button
function restoreContinueButton(button, originalHTML) {
    if (button) {
        button.innerHTML = originalHTML;
        button.disabled = false;
    }
}

function loadBookings() {
    let bookings = localStorage.getItem('bookingHistory');
    
    if (bookings) {
        bookings = JSON.parse(bookings);
    } else {
        // Use sample data for demo
        bookings = [
            {
                id: 'SF-7894561230',
                hotelName: 'Taj Mahal Palace, Mumbai',
                checkin: 'Dec 25, 2024',
                checkout: 'Dec 30, 2024',
                guests: '2 adults',
                room: 'Deluxe King Room',
                total: '₹1,36,845',
                status: 'confirmed',
                date: 'Dec 20, 2024',
                upcoming: true
            },
            // ... more bookings
        ];
        localStorage.setItem('bookingHistory', JSON.stringify(bookings));
    }
    
    displayBookings(bookings);
}

function cancelBooking(bookingId) {
    if (confirm(`Are you sure you want to cancel booking ${bookingId}?\n\nCancellation fees may apply.`)) {
        // Update booking status
        let bookings = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
        bookings = bookings.map(booking => {
            if (booking.id === bookingId) {
                return { ...booking, status: 'cancelled' };
            }
            return booking;
        });
        
        localStorage.setItem('bookingHistory', JSON.stringify(bookings));
        showToast('Booking cancelled successfully!');
        loadBookings();
    }
}

// Add CSS for Form Validation
const bookingCSS = `
    input.valid, textarea.valid {
        border-color: #00c853 !important;
        background-color: #f8fff8;
    }
    
    input.invalid, textarea.invalid {
        border-color: #ff5a5f !important;
        background-color: #fff5f5;
    }
    
    .counter-btn.animate-bounce {
        animation: bounce 0.3s ease-in-out;
    }
    
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
    
    .field-error {
        color: #ff5a5f;
        font-size: 12px;
        margin-top: 5px;
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Add CSS to document
const bookingStyleSheet = document.createElement('style');
bookingStyleSheet.textContent = bookingCSS;
document.head.appendChild(bookingStyleSheet);

// Initialize counter values
let adultsCount = 2;
let childrenCount = 0;
let roomsCount = 1;