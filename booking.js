document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('bookingForm');
    const durationInput = document.getElementById('duration');
    const headsInput = document.getElementById('heads');
    const totalPriceDisplay = document.getElementById('totalPriceDisplay');
    const bookingSuccess = document.getElementById('bookingSuccess');
    const calendarBtn = document.getElementById('calendarBtn');
    const bookAnotherBtn = document.getElementById('bookAnotherBtn');

    // Cost per hour per head
    const COST_PER_HOUR = 100;
    // Owner WhatsApp number
    const OWNER_PHONE = '916369006808';

    function calculateTotal() {
        const duration = parseInt(durationInput.value) || 0;
        const heads = parseInt(headsInput.value) || 0;

        let total = duration * heads * COST_PER_HOUR;
        if (total < 0) total = 0;

        totalPriceDisplay.textContent = `Total: ₹${total}`;
        return total;
    }

    if (durationInput) durationInput.addEventListener('input', calculateTotal);
    if (headsInput) headsInput.addEventListener('input', calculateTotal);

    function createGoogleCalendarUrl(name, court, date, time, duration) {
        // Create JS Date objects
        const startDateTime = new Date(`${date}T${time}`);
        const endDateTime = new Date(startDateTime.getTime() + (duration * 60 * 60 * 1000));

        const formatDateTime = (dateObj) => {
            return dateObj.toISOString().replace(/-|:|\.\d\d\d/g, '');
        };

        const startDateStr = formatDateTime(startDateTime);
        const endDateStr = formatDateTime(endDateTime);

        const title = encodeURIComponent(`Badminton: ${court}`);
        const details = encodeURIComponent(`Booking for ${name} at Iron Paradise.`);
        const location = encodeURIComponent(`Iron Paradise, SKP Thottam, Sathy Rd`);

        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateStr}/${endDateStr}&details=${details}&location=${location}`;
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Gather form data
            const name = document.getElementById('userName').value;
            const phone = document.getElementById('userPhone').value;
            const court = document.getElementById('court').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const duration = document.getElementById('duration').value;
            const heads = document.getElementById('heads').value;
            const totalCost = calculateTotal();

            // Construct WhatsApp message to Customer
            const message = `Hello ${name}!\n\nThis is Iron Paradise. Your Badminton Court booking is confirmed!\n\n*Court:* ${court}\n*Date:* ${date}\n*Time:* ${time}\n*Duration:* ${duration} Hours\n*Players:* ${heads}\n*Total Cost:* ₹${totalCost}\n\nWe look forward to seeing you!`;
            const cleanPhone = phone.replace(/\D/g, '');
            const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

            // Generate Calendar URL
            const calendarUrl = createGoogleCalendarUrl(name, court, date, time, duration);
            calendarBtn.href = calendarUrl;

            // Open WhatsApp in new tab
            window.open(whatsappUrl, '_blank');

            // Show Success UI
            bookingForm.style.display = 'none';
            bookingSuccess.style.display = 'block';
        });
    }

    if (bookAnotherBtn) {
        bookAnotherBtn.addEventListener('click', () => {
            bookingSuccess.style.display = 'none';
            bookingForm.style.display = 'block';
            bookingForm.reset();
            calculateTotal();
        });
    }
});
