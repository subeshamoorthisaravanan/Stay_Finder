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