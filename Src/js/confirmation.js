// Confirmation Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize confirmation page
    initConfirmationPage();
    
    // Load booking confirmation data
    loadConfirmationData();
    
    // Setup event listeners
    setupConfirmationListeners();
});

// Initialize Confirmation Page
function initConfirmationPage() {
    // Add animation to elements
    const animatedElements = document.querySelectorAll('.confirmation-card > *');
    animatedElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        element.classList.add('animate-fade-in');
    });
}

// Load Confirmation Data
function loadConfirmationData() {
    try {
        // Try to get booking ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const bookingId = urlParams.get('id');
        
        // Get booking data from localStorage or use demo data
        let bookingData = localStorage.getItem('bookingConfirmation');
        
        if (bookingData) {
            bookingData = JSON.parse(bookingData);
            
            // Generate a booking ID if not provided
            if (!bookingId) {
                const generatedId = 'SF-' + Date.now().toString().slice(-10);
                window.history.replaceState({}, '', `?id=${generatedId}`);
                bookingData.id = generatedId;
            } else {
                bookingData.id = bookingId;
            }
        } else {
            // Use demo data if no booking data found
            bookingData = getDemoBookingData(bookingId);
        }
        
        // Update UI with booking data
        updateConfirmationUI(bookingData);
        
    } catch (error) {
        console.error('Error loading confirmation data:', error);
        // Fallback to demo data
        updateConfirmationUI(getDemoBookingData());
    }
}

// Get Demo Booking Data (for testing)
function getDemoBookingData(bookingId = null) {
    const today = new Date();
    const checkin = new Date(today);
    checkin.setDate(checkin.getDate() + 5);
    
    const checkout = new Date(checkin);
    checkout.setDate(checkout.getDate() + 5);
    
    return {
        id: bookingId || 'SF-' + Date.now().toString().slice(-10),
        bookingDate: today.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }),
        hotel: {
            name: 'Taj Mahal Palace, Mumbai',
            location: 'Mumbai, Maharashtra',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop',
            rating: 4.8,
            reviews: 1247
        },
        dates: {
            checkin: checkin.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }),
            checkout: checkout.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }),
            nights: 5
        },
        guest: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+91 9876543210',
            count: '2 adults, 0 children',
            room: 'Deluxe King Room'
        },
        price: {
            room: 144995,
            taxes: 26099,
            service: 2000,
            discount: 36249,
            total: 136845
        },
        payment: {
            method: 'Credit Card',
            transactionId: 'TXN' + Date.now().toString().slice(-10),
            status: 'Paid',
            date: today.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
        }
    };
}

// Update Confirmation UI
function updateConfirmationUI(bookingData) {
    // Update booking header
    document.getElementById('bookingId').textContent = bookingData.id;
    document.getElementById('bookingDate').textContent = bookingData.bookingDate;
    document.getElementById('footerBookingId').textContent = bookingData.id;
    
    // Update hotel details
    document.getElementById('confirmationHotelName').textContent = bookingData.hotel.name;
    document.getElementById('confirmationHotelLocation').textContent = bookingData.hotel.location;
    document.getElementById('confirmationHotelImage').src = bookingData.hotel.image;
    
    // Update dates
    document.getElementById('checkinDate').textContent = bookingData.dates.checkin;
    document.getElementById('checkoutDate').textContent = bookingData.dates.checkout;
    document.getElementById('stayDuration').textContent = `${bookingData.dates.nights} nights`;
    document.getElementById('nightsCount').textContent = `${bookingData.dates.nights} nights stay`;
    
    // Update guest info
    document.getElementById('guestName').textContent = bookingData.guest.name;
    document.getElementById('guestEmail').textContent = bookingData.guest.email;
    document.getElementById('guestPhone').textContent = bookingData.guest.phone;
    document.getElementById('guestCount').textContent = bookingData.guest.count;
    document.getElementById('roomType').textContent = bookingData.guest.room;
    
    // Update price breakdown
    document.getElementById('roomCharges').textContent = formatRupees(bookingData.price.room);
    document.getElementById('taxesAmount').textContent = formatRupees(bookingData.price.taxes);
    document.getElementById('serviceCharge').textContent = formatRupees(bookingData.price.service);
    document.getElementById('discountAmount').textContent = formatRupees(bookingData.price.discount);
    document.getElementById('totalAmount').textContent = formatRupees(bookingData.price.total);
    
    // Update payment info
    document.getElementById('paymentMethod').textContent = bookingData.payment.method;
    document.getElementById('transactionId').textContent = bookingData.payment.transactionId;
    document.getElementById('paymentDate').textContent = bookingData.payment.date;
    
    // Save to localStorage for persistence
    localStorage.setItem('bookingConfirmation', JSON.stringify(bookingData));
    
    // Add to booking history
    addToBookingHistory(bookingData);
}

// Format Rupees
function formatRupees(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Add to Booking History
function addToBookingHistory(bookingData) {
    try {
        let bookingHistory = localStorage.getItem('bookingHistory');
        
        if (bookingHistory) {
            bookingHistory = JSON.parse(bookingHistory);
        } else {
            bookingHistory = [];
        }
        
        // Check if booking already exists in history
        const existingIndex = bookingHistory.findIndex(booking => booking.id === bookingData.id);
        
        if (existingIndex === -1) {
            // Add new booking
            bookingHistory.unshift({
                id: bookingData.id,
                hotelName: bookingData.hotel.name,
                checkin: bookingData.dates.checkin,
                checkout: bookingData.dates.checkout,
                total: bookingData.price.total,
                status: 'Confirmed',
                date: new Date().toISOString()
            });
            
            // Keep only last 10 bookings
            if (bookingHistory.length > 10) {
                bookingHistory = bookingHistory.slice(0, 10);
            }
            
            localStorage.setItem('bookingHistory', JSON.stringify(bookingHistory));
        }
        
    } catch (error) {
        console.error('Error saving to booking history:', error);
    }
}

// Setup Event Listeners
function setupConfirmationListeners() {
    // Share button events
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const type = this.classList[1]; // whatsapp, email, copy
            
            switch(type) {
                case 'whatsapp':
                    shareViaWhatsApp();
                    break;
                case 'email':
                    shareViaEmail();
                    break;
                case 'copy':
                    copyBookingLink();
                    break;
            }
        });
    });
    
    // Print button
    const printBtn = document.querySelector('.btn-primary');
    if (printBtn) {
        printBtn.addEventListener('click', printConfirmation);
    }
    
    // Download PDF button
    const downloadBtn = document.querySelector('.btn-secondary');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadConfirmationPDF);
    }
}

// Share via WhatsApp
function shareViaWhatsApp() {
    const bookingId = document.getElementById('bookingId').textContent;
    const hotelName = document.getElementById('confirmationHotelName').textContent;
    const checkin = document.getElementById('checkinDate').textContent;
    const total = document.getElementById('totalAmount').textContent;
    
    const message = `🎉 My Stay Finder Booking Confirmed!\n\n` +
                   `Booking ID: ${bookingId}\n` +
                   `Hotel: ${hotelName}\n` +
                   `Check-in: ${checkin}\n` +
                   `Total: ${total}\n\n` +
                   `View details: ${window.location.href}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Share via Email
function shareViaEmail() {
    const bookingId = document.getElementById('bookingId').textContent;
    const hotelName = document.getElementById('confirmationHotelName').textContent;
    const guestName = document.getElementById('guestName').textContent;
    const checkin = document.getElementById('checkinDate').textContent;
    const checkout = document.getElementById('checkoutDate').textContent;
    const total = document.getElementById('totalAmount').textContent;
    
    const subject = `Stay Finder Booking Confirmation: ${bookingId}`;
    const body = `Dear ${guestName},\n\n` +
                `Your booking has been confirmed!\n\n` +
                `Booking Details:\n` +
                `Booking ID: ${bookingId}\n` +
                `Hotel: ${hotelName}\n` +
                `Check-in: ${checkin}\n` +
                `Check-out: ${checkout}\n` +
                `Total Amount: ${total}\n\n` +
                `You can view your booking details here:\n` +
                `${window.location.href}\n\n` +
                `Best regards,\nStay Finder Team`;
    
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
}

// Copy Booking Link
function copyBookingLink() {
    const bookingLink = window.location.href;
    
    navigator.clipboard.writeText(bookingLink).then(() => {
        showToast('Booking link copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast('Failed to copy link. Please try again.');
    });
}

// Download Confirmation PDF
function downloadConfirmationPDF() {
    showToast('Generating PDF... Please wait.');
    
    // In a real implementation, this would generate a PDF
    setTimeout(() => {
        const bookingId = document.getElementById('bookingId').textContent;
        const fileName = `StayFinder_Booking_${bookingId}.pdf`;
        
        // Create a temporary link to trigger download
        const link = document.createElement('a');
        link.href = '#';
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('PDF downloaded successfully!');
    }, 2000);
}

// Print Confirmation
function printConfirmation() {
    showToast('Opening print preview...');
    
    setTimeout(() => {
        window.print();
    }, 500);
}

// Show Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize when page loads
window.addEventListener('load', function() {
    // Hide loader with animation
    const loader = document.getElementById('mainLoader');
    setTimeout(() => {
        if (loader) {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    }, 1000);
    
    // Add confetti animation on successful load
    setTimeout(() => {
        createConfetti();
    }, 1500);
});

function printConfirmation() {
    showToast('Opening print preview...');
    setTimeout(() => window.print(), 500);
}

function downloadConfirmationPDF() {
    showToast('Generating PDF... Please wait.');
    setTimeout(() => {
        const bookingId = document.getElementById('bookingId').textContent;
        const fileName = `StayFinder_Booking_${bookingId}.pdf`;
        
        // Create a temporary link to trigger download
        const link = document.createElement('a');
        link.href = '#';
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('PDF downloaded successfully!');
    }, 2000);
}

// Share via WhatsApp
function shareViaWhatsApp() {
    const bookingId = document.getElementById('bookingId').textContent;
    const hotelName = document.getElementById('confirmationHotelName').textContent;
    const checkin = document.getElementById('checkinDate').textContent;
    const total = document.getElementById('totalAmount').textContent;
    
    const message = `🎉 My Stay Finder Booking Confirmed!\n\n` +
                   `Booking ID: ${bookingId}\n` +
                   `Hotel: ${hotelName}\n` +
                   `Check-in: ${checkin}\n` +
                   `Total: ${total}\n\n` +
                   `View details: ${window.location.href}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Share via Email
function shareViaEmail() {
    const bookingId = document.getElementById('bookingId').textContent;
    const hotelName = document.getElementById('confirmationHotelName').textContent;
    const guestName = document.getElementById('guestName').textContent;
    const checkin = document.getElementById('checkinDate').textContent;
    const checkout = document.getElementById('checkoutDate').textContent;
    const total = document.getElementById('totalAmount').textContent;
    
    const subject = `Stay Finder Booking Confirmation: ${bookingId}`;
    const body = `Dear ${guestName},\n\n` +
                `Your booking has been confirmed!\n\n` +
                `Booking Details:\n` +
                `Booking ID: ${bookingId}\n` +
                `Hotel: ${hotelName}\n` +
                `Check-in: ${checkin}\n` +
                `Check-out: ${checkout}\n` +
                `Total Amount: ${total}\n\n` +
                `You can view your booking details here:\n` +
                `${window.location.href}\n\n` +
                `Best regards,\nStay Finder Team`;
    
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
}

// Copy Booking Link
function copyBookingLink() {
    const bookingLink = window.location.href;
    
    navigator.clipboard.writeText(bookingLink).then(() => {
        showToast('Booking link copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast('Failed to copy link. Please try again.');
    });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Usage examples:
showToast('Booking confirmed successfully!');
showToast('PDF downloaded!');
showToast('Link copied to clipboard!');

function createConfetti() {
    const colors = ['#ff5a5f', '#0071c2', '#00c853', '#ff9800', '#9c27b0'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
            position: fixed;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -20px;
            left: ${Math.random() * 100}%;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            opacity: 0;
            z-index: 1000;
            pointer-events: none;
        `;
        
        document.body.appendChild(confetti);
        
        // Animate confetti
        const animation = confetti.animate([
            {
                opacity: 0,
                transform: 'translateY(0) rotate(0deg)'
            },
            {
                opacity: 1,
                transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 720}deg)`
            }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
        });
        
        // Remove confetti after animation
        animation.onfinish = () => {
            confetti.remove();
        };
    }
}

// Trigger confetti on page load
setTimeout(() => {
    createConfetti();
}, 1500);

// Create Confetti Animation
function createConfetti() {
    const colors = ['#ff5a5f', '#0071c2', '#00c853', '#ff9800', '#9c27b0'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
            position: fixed;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -20px;
            left: ${Math.random() * 100}%;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            opacity: 0;
            z-index: 1000;
            pointer-events: none;
        `;
        
        document.body.appendChild(confetti);
        
        // Animate confetti
        const animation = confetti.animate([
            {
                opacity: 0,
                transform: 'translateY(0) rotate(0deg)'
            },
            {
                opacity: 1,
                transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 720}deg)`
            }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
        });
        
        // Remove confetti after animation
        animation.onfinish = () => {
            confetti.remove();
        };
    }
}