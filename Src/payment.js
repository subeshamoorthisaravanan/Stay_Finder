// Payment Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize payment page
    initPaymentPage();
    
    // Load booking data
    loadBookingData();
    
    // Setup event listeners
    setupPaymentListeners();
});

// Initialize Payment Page
function initPaymentPage() {
    // Set default dates (tomorrow to 5 days from tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const checkoutDate = new Date(tomorrow);
    checkoutDate.setDate(checkoutDate.getDate() + 5);
    
    // Format dates
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };
    
    // Set default values
    document.getElementById('summaryCheckin').textContent = formatDate(tomorrow);
    document.getElementById('summaryCheckout').textContent = formatDate(checkoutDate);
    document.getElementById('summaryNights').textContent = '5 nights';
    
    // Load from localStorage if available
    const savedBooking = localStorage.getItem('bookingData');
    if (savedBooking) {
        const booking = JSON.parse(savedBooking);
        updateBookingSummary(booking);
    }
}

// Load Booking Data
function loadBookingData() {
    // Try to get from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const hotelId = urlParams.get('hotelId');
    
    if (hotelId) {
        // Load hotel data
        const hotel = getHotelById(parseInt(hotelId));
        if (hotel) {
            updateHotelSummary(hotel);
        }
    }
}

// Get Hotel by ID
function getHotelById(id) {
    const hotels = [
        {
            id: 1,
            name: "Grand Luxury Hotel & Spa",
            location: "Kuala Lumpur, Malaysia",
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop",
            price: 289,
            discount: 25
        },
        {
            id: 2,
            name: "Beachfront Resort & Villas",
            location: "Bali, Indonesia",
            image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&auto=format&fit=crop",
            price: 199,
            discount: 23
        },
        {
            id: 3,
            name: "City Center Business Hotel",
            location: "Singapore",
            image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&auto=format&fit=crop",
            price: 159,
            discount: 20
        }
    ];
    
    return hotels.find(hotel => hotel.id === id);
}

// Update Hotel Summary
function updateHotelSummary(hotel) {
    document.getElementById('summaryHotelImage').src = hotel.image;
    document.getElementById('summaryHotelName').textContent = hotel.name;
    document.getElementById('summaryHotelLocation').textContent = hotel.location;
    
    // Calculate prices
    const nights = 5; // Default 5 nights
    const roomPrice = hotel.price * nights;
    const taxes = roomPrice * 0.15; // 15% tax
    const serviceCharge = 50;
    const discountAmount = (roomPrice * hotel.discount) / 100;
    const total = roomPrice + taxes + serviceCharge - discountAmount;
    
    // Update price display
    document.getElementById('roomPrice').textContent = `$${roomPrice.toFixed(2)}`;
    document.getElementById('taxes').textContent = `$${taxes.toFixed(2)}`;
    document.getElementById('serviceCharge').textContent = `$${serviceCharge.toFixed(2)}`;
    document.getElementById('discountAmount').textContent = `$${discountAmount.toFixed(2)}`;
    document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;
    document.getElementById('finalAmount').textContent = total.toFixed(2);
}

// Update Booking Summary
function updateBookingSummary(booking) {
    // Update booking details
    document.getElementById('summaryCheckin').textContent = booking.checkin;
    document.getElementById('summaryCheckout').textContent = booking.checkout;
    document.getElementById('summaryNights').textContent = `${booking.nights} nights`;
    document.getElementById('summaryGuests').textContent = 
        `${booking.guests.adults} adults, ${booking.guests.children} children`;
    document.getElementById('summaryRoom').textContent = booking.roomType;
    
    // Update hotel info if available
    if (booking.hotel) {
        document.getElementById('summaryHotelImage').src = booking.hotel.image;
        document.getElementById('summaryHotelName').textContent = booking.hotel.name;
        document.getElementById('summaryHotelLocation').textContent = booking.hotel.location;
    }
    
    // Update prices
    document.getElementById('roomPrice').textContent = `$${booking.prices.room.toFixed(2)}`;
    document.getElementById('taxes').textContent = `$${booking.prices.taxes.toFixed(2)}`;
    document.getElementById('serviceCharge').textContent = `$${booking.prices.service.toFixed(2)}`;
    document.getElementById('discountAmount').textContent = `$${booking.prices.discount.toFixed(2)}`;
    document.getElementById('totalAmount').textContent = `$${booking.prices.total.toFixed(2)}`;
    document.getElementById('finalAmount').textContent = booking.prices.total.toFixed(2);
}

// Setup Payment Listeners
function setupPaymentListeners() {
    // Payment method selection
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            document.querySelectorAll('.payment-option').forEach(opt => {
                opt.classList.remove('active');
            });
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Show/hide forms based on selection
            const method = this.getAttribute('data-method');
            togglePaymentForm(method);
        });
    });
    
    // Credit card input formatting
    const cardNumberInput = document.getElementById('cardNumber');
    const cardHolderInput = document.getElementById('cardHolder');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');
    
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            // Format card number with spaces
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})/g, '$1 ').trim();
            e.target.value = value.substring(0, 19);
            
            // Update preview
            document.getElementById('previewCardNumber').textContent = 
                value || '•••• •••• •••• ••••';
        });
    }
    
    if (cardHolderInput) {
        cardHolderInput.addEventListener('input', function(e) {
            document.getElementById('previewCardHolder').textContent = 
                e.target.value || 'YOUR NAME';
        });
    }
    
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function(e) {
            // Format as MM/YY
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value.substring(0, 5);
            
            document.getElementById('previewCardExpiry').textContent = 
                value || 'MM/YY';
        });
    }
    
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
        });
    }
    
    // Pay Now button
    const payNowBtn = document.getElementById('payNowBtn');
    if (payNowBtn) {
        payNowBtn.addEventListener('click', processPayment);
    }
    
    // Modal close button
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            document.getElementById('paymentModal').style.display = 'none';
        });
    }
}

// Toggle Payment Form
function togglePaymentForm(method) {
    const cardForm = document.getElementById('cardForm');
    
    if (method === 'card') {
        cardForm.style.display = 'block';
    } else {
        cardForm.style.display = 'none';
    }
}

// Process Payment
function processPayment() {
    // Validate forms
    if (!validateForms()) {
        return;
    }
    
    // Show processing modal
    const modal = document.getElementById('paymentModal');
    modal.style.display = 'flex';
    
    // Simulate payment processing
    simulatePaymentProcessing();
}

// Validate Forms
function validateForms() {
    // Get selected payment method
    const selectedMethod = document.querySelector('.payment-option.active');
    const method = selectedMethod ? selectedMethod.getAttribute('data-method') : 'card';
    
    if (method === 'card') {
        // Validate credit card form
        const cardNumber = document.getElementById('cardNumber').value;
        const cardHolder = document.getElementById('cardHolder').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        
        // Remove spaces from card number for validation
        const cleanCardNumber = cardNumber.replace(/\s/g, '');
        
        if (cleanCardNumber.length !== 16) {
            alert('Please enter a valid 16-digit card number');
            return false;
        }
        
        if (!cardHolder.trim()) {
            alert('Please enter card holder name');
            return false;
        }
        
        if (!expiryDate.match(/^\d{2}\/\d{2}$/)) {
            alert('Please enter valid expiry date (MM/YY)');
            return false;
        }
        
        if (cvv.length !== 3) {
            alert('Please enter valid 3-digit CVV');
            return false;
        }
        
        // Validate expiry date is not in the past
        const [month, year] = expiryDate.split('/');
        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
        const now = new Date();
        
        if (expiry < now) {
            alert('Card has expired');
            return false;
        }
    }
    
    // Validate billing form
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const postalCode = document.getElementById('postalCode').value;
    const country = document.getElementById('country').value;
    
    if (!fullName.trim()) {
        alert('Please enter your full name');
        return false;
    }
    
    if (!validateEmail(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    if (!phone.trim()) {
        alert('Please enter your phone number');
        return false;
    }
    
    if (!address.trim()) {
        alert('Please enter your street address');
        return false;
    }
    
    if (!city.trim()) {
        alert('Please enter your city');
        return false;
    }
    
    if (!postalCode.trim()) {
        alert('Please enter your postal code');
        return false;
    }
    
    if (!country) {
        alert('Please select your country');
        return false;
    }
    
    // Validate terms acceptance
    const terms = document.getElementById('terms');
    const cancellation = document.getElementById('cancellation');
    
    if (!terms.checked) {
        alert('Please accept the Terms & Conditions');
        return false;
    }
    
    if (!cancellation.checked) {
        alert('Please accept the cancellation policy');
        return false;
    }
    
    return true;
}

// Validate Email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Simulate Payment Processing
function simulatePaymentProcessing() {
    const processingMessage = document.getElementById('processingMessage');
    const paymentStatus = document.getElementById('paymentStatus');
    
    // Step 1: Validating card details
    setTimeout(() => {
        processingMessage.textContent = 'Card details validated successfully...';
        const step1 = paymentStatus.children[0];
        step1.innerHTML = '<i class="fas fa-check-circle"></i><span>Validating card details ✓</span>';
    }, 1500);
    
    // Step 2: Processing payment
    setTimeout(() => {
        processingMessage.textContent = 'Processing payment with bank...';
        const step2 = paymentStatus.children[1];
        step2.innerHTML = '<i class="fas fa-check-circle"></i><span>Processing payment ✓</span>';
    }, 3000);
    
    // Step 3: Confirming booking
    setTimeout(() => {
        processingMessage.textContent = 'Confirming your booking...';
        const step3 = paymentStatus.children[2];
        step3.innerHTML = '<i class="fas fa-check-circle"></i><span>Confirming booking ✓</span>';
    }, 4500);
    
    // Complete payment
    setTimeout(() => {
        processingMessage.textContent = 'Payment successful!';
        
        // Show success animation
        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = `
            <div class="success-animation">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Payment Successful!</h2>
            <p>Your booking has been confirmed.</p>
            <p>Booking ID: <strong>AG${Date.now().toString().slice(-8)}</strong></p>
            <p>A confirmation email has been sent to your inbox.</p>
            <button class="btn-continue" onclick="goToConfirmation()">
                View Booking Details
            </button>
        `;
    }, 6000);
}

// Generate Booking Confirmation
function generateBookingConfirmation() {
    const bookingId = 'AG' + Date.now().toString().slice(-8);
    const bookingDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const bookingData = {
        id: bookingId,
        date: bookingDate,
        hotel: {
            name: document.getElementById('summaryHotelName').textContent,
            location: document.getElementById('summaryHotelLocation').textContent,
            checkin: document.getElementById('summaryCheckin').textContent,
            checkout: document.getElementById('summaryCheckout').textContent
        },
        guests: document.getElementById('summaryGuests').textContent,
        total: document.getElementById('totalAmount').textContent,
        paymentMethod: document.querySelector('.payment-option.active span').textContent
    };
    
    // Save to localStorage
    localStorage.setItem('bookingConfirmation', JSON.stringify(bookingData));
    
    return bookingId;
}

// Go to Confirmation Page
function goToConfirmation() {
    const bookingId = generateBookingConfirmation();
    window.location.href = `confirmation.html?id=${bookingId}`;
}

// Format Card Number for Display
function formatCardNumberForDisplay(cardNumber) {
    const lastFour = cardNumber.replace(/\s/g, '').slice(-4);
    return `•••• •••• •••• ${lastFour}`;
}

// Save Payment Data (for demo purposes)
function savePaymentData() {
    const paymentData = {
        method: document.querySelector('.payment-option.active').getAttribute('data-method'),
        timestamp: new Date().toISOString(),
        amount: document.getElementById('finalAmount').textContent
    };
    
    localStorage.setItem('lastPayment', JSON.stringify(paymentData));
}

// Add these functions to your existing payment.js file

// Show Payment Processing Loader
function showPaymentProcessing() {
    const modal = document.getElementById('paymentModal');
    if (!modal) return;
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Processing Payment</h2>
                <button class="modal-close" id="modalClose">&times;</button>
            </div>
            
            <div class="modal-body">
                <div class="payment-loader">
                    <div class="progress-loader">
                        <div class="progress-bar"></div>
                    </div>
                    
                    <div class="content-loader" style="padding: 40px 0;">
                        <div class="loader-spinner"></div>
                        <p>Securing your payment...</p>
                    </div>
                    
                    <div class="payment-status" id="paymentStatus">
                        <div class="status-step">
                            <div class="step-icon">
                                <div class="spinner" style="width: 20px; height: 20px;"></div>
                            </div>
                            <div class="step-content">
                                <strong>Validating card details</strong>
                                <p>Checking card information...</p>
                            </div>
                        </div>
                        <div class="status-step">
                            <div class="step-icon">
                                <i class="far fa-circle"></i>
                            </div>
                            <div class="step-content">
                                <strong>Processing payment</strong>
                                <p>Contacting payment gateway...</p>
                            </div>
                        </div>
                        <div class="status-step">
                            <div class="step-icon">
                                <i class="far fa-circle"></i>
                            </div>
                            <div class="step-content">
                                <strong>Confirming booking</strong>
                                <p>Securing your reservation...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
    
    // Setup close button
    const closeBtn = document.getElementById('modalClose');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    // Start payment simulation
    simulatePaymentSteps();
}

// Simulate Payment Steps
function simulatePaymentSteps() {
    const statusSteps = document.querySelectorAll('.status-step');
    if (!statusSteps.length) return;
    
    // Step 1: Validating card details
    setTimeout(() => {
        updatePaymentStep(0, 'success', 'Card details validated');
    }, 1000);
    
    // Step 2: Processing payment
    setTimeout(() => {
        updatePaymentStep(1, 'processing', 'Processing with bank...');
        
        setTimeout(() => {
            updatePaymentStep(1, 'success', 'Payment authorized');
        }, 1500);
    }, 2500);
    
    // Step 3: Confirming booking
    setTimeout(() => {
        updatePaymentStep(2, 'processing', 'Confirming reservation...');
        
        setTimeout(() => {
            updatePaymentStep(2, 'success', 'Booking confirmed');
            showPaymentSuccess();
        }, 2000);
    }, 4500);
}

// Update Payment Step
function updatePaymentStep(stepIndex, status, message) {
    const statusSteps = document.querySelectorAll('.status-step');
    if (stepIndex >= statusSteps.length) return;
    
    const step = statusSteps[stepIndex];
    const stepIcon = step.querySelector('.step-icon');
    const stepContent = step.querySelector('.step-content p');
    
    // Clear previous content
    stepIcon.innerHTML = '';
    step.classList.remove('processing', 'success', 'error');
    
    // Update based on status
    switch(status) {
        case 'processing':
            step.classList.add('processing');
            stepIcon.innerHTML = '<div class="spinner"></div>';
            break;
        case 'success':
            step.classList.add('success');
            stepIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            step.classList.add('error');
            stepIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
            break;
    }
    
    // Update message
    if (stepContent && message) {
        stepContent.textContent = message;
    }
}

// Show Payment Success
function showPaymentSuccess() {
    const modalBody = document.querySelector('.modal-body');
    if (!modalBody) return;
    
    setTimeout(() => {
        modalBody.innerHTML = `
            <div class="payment-loader">
                <div class="checkmark">
                    <i class="fas fa-check"></i>
                </div>
                <h3>Payment Successful!</h3>
                <p>Your booking has been confirmed.</p>
                <p style="margin: 20px 0; font-size: 18px; color: #333;">
                    <strong>Booking ID:</strong> SF${Date.now().toString().slice(-8)}
                </p>
                <p>A confirmation email has been sent to your inbox.</p>
                
                <div style="margin-top: 30px; display: flex; gap: 15px; justify-content: center;">
                    <button class="btn-secondary" onclick="downloadReceipt()" style="padding: 12px 24px;">
                        <i class="fas fa-download"></i> Download Receipt
                    </button>
                    <button class="btn-primary" onclick="goToConfirmation()" style="padding: 12px 24px;">
                        <i class="fas fa-eye"></i> View Booking
                    </button>
                </div>
            </div>
        `;
    }, 1000);
}

// Update Process Payment Function
function processPayment() {
    // Validate forms first
    if (!validateForms()) {
        return;
    }
    
    // Show payment processing loader
    showPaymentProcessing();
    
    // Save payment data
    savePaymentData();
}

// Add CSS for Payment Status Steps
const paymentStatusCSS = `
    .status-step {
        display: flex;
        align-items: flex-start;
        gap: 15px;
        margin-bottom: 25px;
        padding-bottom: 25px;
        border-bottom: 1px solid #eee;
    }
    
    .status-step:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
    }
    
    .step-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }
    
    .status-step.processing .step-icon {
        background: #f5faff;
        border: 2px solid #0071c2;
    }
    
    .status-step.success .step-icon {
        background: #e8f5e9;
        border: 2px solid #00c853;
        color: #00c853;
    }
    
    .status-step.error .step-icon {
        background: #ffebee;
        border: 2px solid #ff5a5f;
        color: #ff5a5f;
    }
    
    .step-content {
        flex: 1;
    }
    
    .step-content strong {
        display: block;
        margin-bottom: 5px;
        color: #333;
    }
    
    .step-content p {
        color: #666;
        font-size: 14px;
        margin: 0;
    }
    
    .btn-primary, .btn-secondary {
        padding: 12px 24px;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s;
        border: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }
    
    .btn-primary {
        background: #0071c2;
        color: white;
    }
    
    .btn-primary:hover {
        background: #005a9e;
    }
    
    .btn-secondary {
        background: #f5f5f5;
        color: #333;
        border: 1px solid #ddd;
    }
    
    .btn-secondary:hover {
        background: #e0e0e0;
    }
`;

// Add CSS to document
const styleSheet = document.createElement('style');
styleSheet.textContent = paymentStatusCSS;
document.head.appendChild(styleSheet);

// Download Receipt Function
function downloadReceipt() {
    showNotification('Preparing receipt...', 'loading');
    
    setTimeout(() => {
        showNotification('Receipt downloaded successfully!', 'success');
        
        // In a real app, this would generate and download a PDF
        console.log('Receipt downloaded');
    }, 1500);
}

