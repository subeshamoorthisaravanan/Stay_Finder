// Update the hotels data with Indian prices (in rupees)
const hotels = [
    {
        id: 1,
        name: "Grand Luxury Hotel & Spa",
        location: "Mumbai, Maharashtra",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop",
        rating: 4.8,
        reviews: 1247,
        price: 28999,
        oldPrice: 38999,
        discount: 25,
        amenities: ["Free WiFi", "Swimming Pool", "Spa", "Free Parking", "Breakfast Included"],
        description: "Experience luxury at its finest in the heart of Mumbai."
    },
    {
        id: 2,
        name: "Beachfront Resort & Villas",
        location: "Goa, India",
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&auto=format&fit=crop",
        rating: 4.6,
        reviews: 892,
        price: 19999,
        oldPrice: 25999,
        discount: 23,
        amenities: ["Beach Access", "Free Breakfast", "Airport Shuttle", "Bar"],
        description: "Wake up to ocean views in our luxury beachfront resort."
    },
    {
        id: 3,
        name: "City Center Business Hotel",
        location: "Delhi, India",
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&auto=format&fit=crop",
        rating: 4.4,
        reviews: 567,
        price: 15999,
        oldPrice: 19999,
        discount: 20,
        amenities: ["Business Center", "Gym", "Restaurant", "Concierge"],
        description: "Perfect for business travelers in downtown Delhi."
    },
    {
        id: 4,
        name: "Mountain View Lodge",
        location: "Shimla, Himachal Pradesh",
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop",
        rating: 4.9,
        reviews: 432,
        price: 12999,
        oldPrice: 17999,
        discount: 28,
        amenities: ["Mountain View", "Fireplace", "Hiking", "Free WiFi"],
        description: "Escape to nature in our cozy mountain lodge."
    },
    {
        id: 5,
        name: "Heritage Palace Hotel",
        location: "Jaipur, Rajasthan",
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop",
        rating: 4.7,
        reviews: 689,
        price: 14999,
        oldPrice: 21999,
        discount: 32,
        amenities: ["Royal Suites", "Traditional Cuisine", "Cultural Shows", "Spa"],
        description: "Experience royal hospitality in this heritage palace."
    },
    {
        id: 6,
        name: "Kerala Backwaters Resort",
        location: "Alleppey, Kerala",
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&auto=format&fit=crop",
        rating: 4.9,
        reviews: 543,
        price: 17999,
        oldPrice: 24999,
        discount: 28,
        amenities: ["Houseboat Stay", "Ayurvedic Spa", "Kerala Food", "Yoga"],
        description: "Stay in traditional houseboats amidst serene backwaters."
    }
];

// Update featured deals with Indian prices
const featuredDeals = [
    {
        id: 1,
        name: "Luxury Hotel & Spa",
        location: "Mumbai",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop",
        price: 19999,
        oldPrice: 28999,
        discount: 30
    },
    {
        id: 2,
        name: "Beachfront Resort",
        location: "Goa",
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&auto=format&fit=crop",
        price: 18999,
        oldPrice: 25999,
        discount: 25
    },
    {
        id: 3,
        name: "City Center Hotel",
        location: "Delhi",
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&auto=format&fit=crop",
        price: 15999,
        oldPrice: 19999,
        discount: 20
    }
];

// DOM Elements
let guestDropdown;
let adultsCount = 2;
let childrenCount = 0;
let roomsCount = 1;

// Initialize when DOM is loaded
// document.addEventListener('DOMContentLoaded', function() {
    // Initialize date pickers
    initDatePickers();
    
    // Initialize guest selector
    initGuestSelector();
    
    // Load featured hotels
    loadFeaturedHotels();
    
    // Setup event listeners
    setupEventListeners();
//});

// Initialize Date Pickers
function initDatePickers() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    
    if (checkinInput && checkoutInput) {
        flatpickr(checkinInput, {
            minDate: "today",
            dateFormat: "Y-m-d",
            defaultDate: today
        });
        
        flatpickr(checkoutInput, {
            minDate: tomorrow,
            dateFormat: "Y-m-d",
            defaultDate: tomorrow
        });
    }
}

// Initialize Guest Selector
function initGuestSelector() {
    guestDropdown = document.getElementById('guestDropdown');
    const guestSelector = document.getElementById('guestSelector');
    
    if (guestSelector && guestDropdown) {
        // Toggle dropdown
        guestSelector.addEventListener('click', function(e) {
            e.stopPropagation();
            guestDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            guestDropdown.classList.remove('show');
        });
        
        // Counter buttons
        document.querySelectorAll('.counter-btn').forEach(button => {
            button.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                const type = this.getAttribute('data-type');
                updateGuestCount(type, action);
            });
        });
        
        // Apply button
        const applyBtn = document.getElementById('applyGuests');
        if (applyBtn) {
            applyBtn.addEventListener('click', function() {
                updateGuestDisplay();
                guestDropdown.classList.remove('show');
            });
        }
    }
}

// Update Guest Count
function updateGuestCount(type, action) {
    if (type === 'adults') {
        if (action === 'increase' && adultsCount < 10) {
            adultsCount++;
        } else if (action === 'decrease' && adultsCount > 1) {
            adultsCount--;
        }
        document.getElementById('adultsCount').textContent = adultsCount;
    } else if (type === 'children') {
        if (action === 'increase' && childrenCount < 5) {
            childrenCount++;
        } else if (action === 'decrease' && childrenCount > 0) {
            childrenCount--;
        }
        document.getElementById('childrenCount').textContent = childrenCount;
    } else if (type === 'rooms') {
        if (action === 'increase' && roomsCount < 5) {
            roomsCount++;
        } else if (action === 'decrease' && roomsCount > 1) {
            roomsCount--;
        }
        document.getElementById('roomsCount').textContent = roomsCount;
    }
}

// Update Guest Display
function updateGuestDisplay() {
    const guestInput = document.querySelector('#guestSelector .search-input');
    if (guestInput) {
        guestInput.value = `${adultsCount} adult${adultsCount !== 1 ? 's' : ''}, ${childrenCount} child${childrenCount !== 1 ? 'ren' : ''}, ${roomsCount} room${roomsCount !== 1 ? 's' : ''}`;
    }
}

// Load Featured Hotels
function loadFeaturedHotels() {
    const hotelsGrid = document.getElementById('featuredHotels');
    
    if (!hotelsGrid) return;
    
    hotelsGrid.innerHTML = '';
    
    hotels.forEach(hotel => {
        const hotelCard = createHotelCard(hotel);
        hotelsGrid.appendChild(hotelCard);
    });
}

// Create Hotel Card with Indian Rupees
function createHotelCard(hotel) {
    const card = document.createElement('div');
    card.className = 'hotel-card';
    card.innerHTML = `
        <img src="${hotel.image}" alt="${hotel.name}" class="hotel-image">
        <div class="hotel-info">
            <h3 class="hotel-name">${hotel.name}</h3>
            <div class="hotel-location">
                <i class="fas fa-map-marker-alt"></i>
                ${hotel.location}
            </div>
            <div class="hotel-rating">
                <span class="rating-badge">${hotel.rating}</span>
                <span class="rating-text">Excellent (${hotel.reviews.toLocaleString()} reviews)</span>
            </div>
            <div class="hotel-price">
                <div>
                    ${hotel.oldPrice ?
                        `<span class="old-price">${formatRupees(hotel.oldPrice)}</span>` :
                        ''
                    }
                    <div class="price">${formatRupees(hotel.price)} <span>/ night</span></div>
                </div>
                ${hotel.discount ?
                    `<span class="discount">${hotel.discount}% OFF</span>` :
                    ''
                }
            </div>
            <button class="book-btn" onclick="viewHotel(${hotel.id})">
                View Details
            </button>
        </div>
    `;

    return card;
}

// Format price in Indian Rupees
function formatRupees(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Update the existing formatPrice function to also handle rupees
function formatPrice(price, currency = 'INR') {
    if (currency === 'INR') {
        return formatRupees(price);
    } else {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    }
}

// View Hotel Details
function viewHotel(hotelId) {
    // Store selected hotel in localStorage
    const hotel = hotels.find(h => h.id === hotelId);
    if (hotel) {
        localStorage.setItem('selectedHotel', JSON.stringify(hotel));
        window.location.href = `hotel-details.html?id=${hotelId}`;
    }
}

// Search a city from the "Popular Indian Cities" cards
function searchCity(city) {
    const destinationInput = document.getElementById('destination');
    if (destinationInput) destinationInput.value = city;

    const searchData = {
        destination: city,
        checkin: document.getElementById('checkin')?.value || '',
        checkout: document.getElementById('checkout')?.value || '',
        guests: {
            adults: adultsCount,
            children: childrenCount,
            rooms: roomsCount
        }
    };
    localStorage.setItem('searchData', JSON.stringify(searchData));
    window.location.href = `search.html?destination=${encodeURIComponent(city)}`;
}

// Setup Event Listeners
function setupEventListeners() {
    // Search form submission
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const destination = document.getElementById('destination').value;
            const checkin = document.getElementById('checkin').value;
            const checkout = document.getElementById('checkout').value;
            
            if (!destination || !checkin || !checkout) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Store search data in localStorage
            const searchData = {
                destination,
                checkin,
                checkout,
                guests: {
                    adults: adultsCount,
                    children: childrenCount,
                    rooms: roomsCount
                }
            };
            
            localStorage.setItem('searchData', JSON.stringify(searchData));
            
            // Redirect to search results
            window.location.href = 'search.html';
        });
    }
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            const userActions = document.querySelector('.user-actions');
            const mainNav = document.querySelector('.main-nav');
            
            userActions.style.display = userActions.style.display === 'flex' ? 'none' : 'flex';
            mainNav.style.display = mainNav.style.display === 'flex' ? 'none' : 'flex';
        });
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            alert(`Thank you for subscribing with ${email}! You'll receive our best deals soon.`);
            this.reset();
        });
    }
}

// Utility Functions


function calculateDaysBetween(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const difference = end.getTime() - start.getTime();
    return Math.ceil(difference / (1000 * 3600 * 24));
}

// Add these functions to your existing script.js file

// ========== LOADER FUNCTIONS ==========

// Show Main Loader
function showMainLoader() {
    const loaderHTML = `
        <div class="loader-overlay" id="mainLoader">
            <div class="logo-loader">
                <div class="logo">
                    <span>S</span><span>tay</span> <span>F</span><span>inder</span>
                </div>
                <div class="loading-text">Finding your perfect stay...</div>
                <div class="dots">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', loaderHTML);
}

// Hide Main Loader
function hideMainLoader() {
    const loader = document.getElementById('mainLoader');
    if (loader) {
        loader.classList.add('fade-out');
        setTimeout(() => {
            loader.remove();
        }, 300);
    }
}

// Show Skeleton Loader for Hotels
function showHotelSkeletons(count = 4) {
    const hotelsGrid = document.getElementById('featuredHotels');
    if (!hotelsGrid) return;
    
    hotelsGrid.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'hotel-card-skeleton animate-fade-in';
        skeleton.innerHTML = `
            <div class="skeleton skeleton-image"></div>
            <div class="skeleton-content">
                <div class="skeleton skeleton-text medium"></div>
                <div class="skeleton skeleton-text short"></div>
                <div class="skeleton skeleton-text" style="width: 40%;"></div>
                <div style="margin-top: 20px; display: flex; justify-content: space-between;">
                    <div class="skeleton skeleton-text" style="width: 30%;"></div>
                    <div class="skeleton skeleton-text" style="width: 20%;"></div>
                </div>
            </div>
        `;
        hotelsGrid.appendChild(skeleton);
    }
}

// Show Content Loader
function showContentLoader(containerId, message = 'Loading...') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const loaderHTML = `
        <div class="content-loader">
            <div class="loader-spinner"></div>
            <p>${message}</p>
        </div>
    `;
    
    container.innerHTML = loaderHTML;
}

// Show Button Loader
function showButtonLoader(button, text = 'Processing...') {
    if (!button) return;
    
    const originalHTML = button.innerHTML;
    button.innerHTML = `
        <span class="btn-loader">
            <div class="spinner"></div>
            ${text}
        </span>
    `;
    button.disabled = true;
    
    // Return function to restore button
    return function() {
        button.innerHTML = originalHTML;
        button.disabled = false;
    };
}

// Show Search Loader
function showSearchLoader(inputElement) {
    if (!inputElement) return;
    
    // Remove existing loader
    const existingLoader = inputElement.parentNode.querySelector('.search-loader');
    if (existingLoader) existingLoader.remove();
    
    // Add new loader
    const loader = document.createElement('div');
    loader.className = 'search-loader';
    loader.innerHTML = '<div class="spinner"></div>';
    inputElement.parentNode.appendChild(loader);
    
    // Return function to hide loader
    return function() {
        loader.remove();
    };
}

// Show Notification Loader
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = 'notification-loader';
    
    let icon = 'fas fa-info-circle';
    let color = '#0071c2';
    
    switch(type) {
        case 'success':
            icon = 'fas fa-check-circle';
            color = '#00c853';
            break;
        case 'error':
            icon = 'fas fa-exclamation-circle';
            color = '#ff5a5f';
            break;
        case 'warning':
            icon = 'fas fa-exclamation-triangle';
            color = '#ff9800';
            break;
        case 'loading':
            icon = 'fas fa-spinner fa-spin';
            color = '#0071c2';
            break;
    }
    
    notification.innerHTML = `
        <i class="${icon}" style="color: ${color};"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto hide if not loading type
    if (type !== 'loading') {
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    }
    
    // Return hide function
    return function() {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    };
}

// Simulate API Delay
function simulateAPIDelay(duration = 1000) {
    return new Promise(resolve => {
        setTimeout(resolve, duration);
    });
}

// Load Hotels with Skeleton
async function loadHotelsWithSkeleton() {
    const hotelsGrid = document.getElementById('featuredHotels');
    if (!hotelsGrid) return;
    
    // Show skeletons
    showHotelSkeletons();
    
    try {
        // Simulate API call delay
        await simulateAPIDelay(1500);
        
        // Clear skeletons
        hotelsGrid.innerHTML = '';
        
        // Load actual hotels
        loadFeaturedHotels();
        
    } catch (error) {
        hotelsGrid.innerHTML = `
            <div class="error-message" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #ff9800; margin-bottom: 20px;"></i>
                <h3>Failed to load hotels</h3>
                <p>Please try again later</p>
                <button onclick="loadHotelsWithSkeleton()" class="book-btn" style="margin-top: 20px;">
                    <i class="fas fa-redo"></i> Retry
                </button>
            </div>
        `;
    }
}

// Animate Elements on Scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Page Transition
function navigateWithLoader(url, event = null) {
    if (event) event.preventDefault();
    
    showNotification('Loading...', 'loading');
    
    // Show content loader on main content
    const mainContent = document.querySelector('main') || document.body;
    const originalContent = mainContent.innerHTML;
    
    mainContent.innerHTML = `
        <div class="content-loader">
            <div class="logo-loader">
                <div class="logo">
                    <span>S</span><span>tay</span> <span>F</span><span>inder</span>
                </div>
                <div class="loading-text">Preparing your experience...</div>
                <div class="dots">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            </div>
        </div>
    `;
    
    // Simulate loading time
    setTimeout(() => {
        if (url) {
            window.location.href = url;
        } else {
            mainContent.innerHTML = originalContent;
        }
    }, 1000);
}

// Form Submission with Loader
function submitFormWithLoader(formId, callback) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const restoreButton = showButtonLoader(submitBtn, 'Processing...');
        
        try {
            // Simulate API call
            await simulateAPIDelay(2000);
            
            // Call callback function
            if (callback) {
                callback();
            }
            
            // Show success notification
            showNotification('Form submitted successfully!', 'success');
            
        } catch (error) {
            showNotification('An error occurred. Please try again.', 'error');
        } finally {
            restoreButton();
        }
    });
}

// Initialize Loaders
function initializeLoaders() {
    // Show main loader on page load
    showMainLoader();
    
    // Hide main loader when page is loaded
    window.addEventListener('load', () => {
        setTimeout(hideMainLoader, 1000);
    });
    
    // Initialize hotel loading
    if (document.getElementById('featuredHotels')) {
        setTimeout(() => {
            loadHotelsWithSkeleton();
        }, 500);
    }
    
    // Initialize search form loader
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        submitFormWithLoader('searchForm', function() {
            // Simulate search and redirect
            setTimeout(() => {
                window.location.href = 'search.html';
            }, 500);
        });
    }
    
    // Initialize booking form loader
    const bookingForm = document.getElementById('guestForm');
    if (bookingForm) {
        submitFormWithLoader('guestForm', function() {
            showNotification('Booking information saved!', 'success');
        });
    }
    
    // Initialize scroll animations
    animateOnScroll();
}

// Update the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize date pickers
    initDatePickers();
    
    // Initialize guest selector
    initGuestSelector();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize loaders
    initializeLoaders();
    
    // Add animation classes to elements
    addAnimationClasses();
});

// Add Animation Classes to Elements
function addAnimationClasses() {
    // Add animation classes to hero elements
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const searchContainer = document.querySelector('.search-container');
    
    if (heroTitle) heroTitle.classList.add('animate-fade-in');
    if (heroSubtitle) heroSubtitle.classList.add('animate-fade-in');
    if (searchContainer) searchContainer.classList.add('animate-slide-in');
    
    // Add animation to trust badges
    const trustBadges = document.querySelectorAll('.badge-item');
    trustBadges.forEach((badge, index) => {
        badge.classList.add('animate-on-scroll');
        badge.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add animation to hotel cards
    const hotelCards = document.querySelectorAll('.hotel-card');
    hotelCards.forEach((card, index) => {
        card.classList.add('animate-on-scroll');
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add animation to deal cards
    const dealCards = document.querySelectorAll('.deal-card');
    dealCards.forEach((card, index) => {
        card.classList.add('animate-on-scroll');
        card.style.animationDelay = `${index * 0.1}s`;
    });
}