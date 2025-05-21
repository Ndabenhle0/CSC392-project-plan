document.addEventListener('DOMContentLoaded', function() {
    // Transport data with routes, schedules, and pricing
    const transportData = {
        routes: {
            'mbabane-manzini': {
                name: 'Mbabane → Manzini',
                distance: '45 km',
                duration: '45 min',
                schedule: ['06:30', '08:30', '10:45', '13:15', '16:00', '18:30'],
                fares: {
                    standard: 25,
                    premium: 40,
                    monthly: 450
                }
            },
            'manzini-mbabane': {
                name: 'Manzini → Mbabane',
                distance: '45 km',
                duration: '45 min',
                schedule: ['07:00', '09:00', '11:15', '13:45', '16:30', '19:00'],
                fares: {
                    standard: 25,
                    premium: 40,
                    monthly: 450
                }
            },
            'mbabane-big-bend': {
                name: 'Mbabane → Big Bend',
                distance: '120 km',
                duration: '2h 15min',
                schedule: ['06:00', '08:00', '10:30', '13:00', '15:30', '17:30'],
                fares: {
                    standard: 45,
                    premium: 65,
                    monthly: 800
                }
            },
            'manzini-siteki': {
                name: 'Manzini → Siteki',
                distance: '90 km',
                duration: '2h',
                schedule: ['07:30', '10:00', '12:30', '15:00', '17:30'],
                fares: {
                    standard: 35,
                    premium: 50,
                    monthly: 600
                }
            }
        },
        buses: {
            'ESW-101': {
                type: '32-seater',
                amenities: ['AC', 'WiFi', 'Charging ports'],
                route: 'mbabane-manzini'
            },
            'ESW-201': {
                type: '25-seater',
                amenities: ['AC', 'Restroom'],
                route: 'mbabane-big-bend'
            }
        }
    };

    // Initialize seat selection with enhanced data
    const seatsGrid = document.querySelector('.seats-grid');
    let selectedSeats = [];
    let currentBusLayout = {};
    
    // Generate bus layout with realistic seat availability
    function generateBusLayout() {
        const layout = {
            standard: {},
            premium: {}
        };
        
        // Standard seats (4 rows, 4 seats each)
        for (let row = 0; row < 4; row++) {
            const rowLetter = String.fromCharCode(65 + row);
            for (let seatNum = 1; seatNum <= 4; seatNum++) {
                const seatId = `${rowLetter}${seatNum}`;
                layout.standard[seatId] = {
                    id: seatId,
                    type: 'standard',
                    available: Math.random() > 0.3, // 70% chance of being available
                    premium: false
                };
            }
        }
        
        // Premium seats (2 rows, 2 seats each)
        for (let row = 0; row < 2; row++) {
            const rowLetter = String.fromCharCode(65 + row);
            for (let seatNum = 5; seatNum <= 6; seatNum++) {
                const seatId = `${rowLetter}${seatNum}`;
                layout.premium[seatId] = {
                    id: seatId,
                    type: 'premium',
                    available: Math.random() > 0.2, // 80% chance of being available
                    premium: true
                };
            }
        }
        
        return layout;
    }

    // Generate seats based on current layout
    function generateSeats() {
        seatsGrid.innerHTML = '';
        currentBusLayout = generateBusLayout();
        
        // Create standard seats
        for (let row = 0; row < 4; row++) {
            const rowLetter = String.fromCharCode(65 + row);
            for (let seatNum = 1; seatNum <= 4; seatNum++) {
                const seatId = `${rowLetter}${seatNum}`;
                const seat = document.createElement('div');
                seat.className = 'seat';
                seat.textContent = seatId;
                seat.dataset.seatId = seatId;
                
                const seatData = currentBusLayout.standard[seatId];
                if (seatData.available) {
                    seat.classList.add('available');
                } else {
                    seat.classList.add('booked');
                }
                
                seatsGrid.appendChild(seat);
            }
        }
        
        // Create premium seats section
        const premiumRow = document.createElement('div');
        premiumRow.className = 'premium-row';
        premiumRow.style.gridColumn = '1 / -1';
        premiumRow.style.textAlign = 'center';
        premiumRow.style.margin = '20px 0';
        premiumRow.textContent = 'Premium Seats (Extra Legroom)';
        seatsGrid.appendChild(premiumRow);
        
        const premiumSeatsContainer = document.createElement('div');
        premiumSeatsContainer.style.display = 'flex';
        premiumSeatsContainer.style.justifyContent = 'center';
        premiumSeatsContainer.style.gap = '15px';
        
        for (let row = 0; row < 2; row++) {
            const rowLetter = String.fromCharCode(65 + row);
            for (let seatNum = 5; seatNum <= 6; seatNum++) {
                const seatId = `${rowLetter}${seatNum}`;
                const seat = document.createElement('div');
                seat.className = 'seat premium';
                seat.textContent = seatId;
                seat.dataset.seatId = seatId;
                
                const seatData = currentBusLayout.premium[seatId];
                if (seatData.available) {
                    seat.classList.add('available');
                } else {
                    seat.classList.add('booked');
                }
                
                premiumSeatsContainer.appendChild(seat);
            }
        }
        
        seatsGrid.appendChild(premiumSeatsContainer);
    }
    
    // Handle seat selection with enhanced logic
    function handleSeatSelection() {
        seatsGrid.addEventListener('click', function(e) {
            const seatElement = e.target.closest('.seat');
            if (!seatElement || !seatElement.classList.contains('available')) return;
            
            const seatId = seatElement.dataset.seatId;
            const isPremium = seatElement.classList.contains('premium');
            const selectedTicketType = document.querySelector('.ticket-card.featured h3')?.textContent.toLowerCase();
            
            // Validate seat type matches ticket type
            if ((isPremium && selectedTicketType !== 'premium') || 
                (!isPremium && selectedTicketType === 'premium')) {
                alert('Please select the appropriate ticket type for this seat.');
                return;
            }
            
            if (seatElement.classList.contains('selected')) {
                // Deselect seat
                seatElement.classList.remove('selected');
                selectedSeats = selectedSeats.filter(id => id !== seatId);
            } else {
                // Check passenger limit
                const passengers = parseInt(document.getElementById('passengers').value);
                if (selectedSeats.length >= passengers) {
                    alert(`You can only select ${passengers} seat(s) for ${passengers} passenger(s).`);
                    return;
                }
                
                // Select seat
                seatElement.classList.add('selected');
                selectedSeats.push(seatId);
            }
            
            updateBookingSummary();
        });
    }
    
    // Update booking summary with all details
    function updateBookingSummary() {
        const routeSelect = document.getElementById('route');
        const routeId = routeSelect.value;
        const routeData = transportData.routes[routeId];
        
        // Update selected seats display
        document.querySelector('.seats-detail').textContent = 
            selectedSeats.length ? selectedSeats.join(', ') : 'None selected';
        
        // Calculate total price
        if (routeData && selectedSeats.length) {
            const selectedTicketType = document.querySelector('.ticket-card.featured h3')?.textContent.toLowerCase();
            const pricePerTicket = routeData.fares[selectedTicketType] || routeData.fares.standard;
            const total = selectedSeats.length * pricePerTicket;
            
            document.querySelector('.total-amount').textContent = `SZL ${total.toFixed(2)}`;
            
            // Update passenger details
            document.querySelector('.passengers-detail').textContent = 
                `${selectedSeats.length} (${selectedTicketType.charAt(0).toUpperCase() + selectedTicketType.slice(1)})`;
        }
    }
    
    // Handle ticket type selection with price updates
    function handleTicketTypeSelection() {
        document.querySelectorAll('.ticket-card button').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Update featured card
                document.querySelectorAll('.ticket-card').forEach(card => {
                    card.classList.remove('featured');
                });
                this.closest('.ticket-card').classList.add('featured');
                
                // Update prices in ticket cards based on selected route
                const routeId = document.getElementById('route').value;
                if (routeId && transportData.routes[routeId]) {
                    const fares = transportData.routes[routeId].fares;
                    
                    document.querySelectorAll('.ticket-card').forEach(card => {
                        const type = card.querySelector('h3').textContent.toLowerCase();
                        if (fares[type]) {
                            card.querySelector('.price').textContent = `SZL ${fares[type].toFixed(2)}`;
                        }
                    });
                }
                
                // Clear selected seats if they don't match new ticket type
                const selectedType = this.closest('.ticket-card').querySelector('h3').textContent.toLowerCase();
                if (selectedSeats.length) {
                    const hasMismatch = selectedSeats.some(seatId => {
                        const seatElement = document.querySelector(`.seat[data-seat-id="${seatId}"]`);
                        return (selectedType === 'premium') !== seatElement.classList.contains('premium');
                    });
                    
                    if (hasMismatch) {
                        if (confirm('Changing ticket type will clear your seat selection. Continue?')) {
                            clearSeatSelection();
                        } else {
                            // Revert to previous selection
                            const prevFeatured = document.querySelector('.ticket-card.featured');
                            setTimeout(() => prevFeatured?.classList.add('featured'), 0);
                            return;
                        }
                    }
                }
                
                updateBookingSummary();
            });
        });
    }
    
    // Clear all selected seats
    function clearSeatSelection() {
        document.querySelectorAll('.seat.selected').forEach(seat => {
            seat.classList.remove('selected');
        });
        selectedSeats = [];
        updateBookingSummary();
    }
    
    // Handle payment tabs
    function handlePaymentTabs() {
        const tabs = document.querySelectorAll('.payment-tab');
        const contents = document.querySelectorAll('.payment-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Show corresponding content
                contents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === tabId) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }
    
    // Initialize route selector with schedules
    function initRouteSelector() {
        const routeSelect = document.getElementById('route');
        
        // Clear existing options
        routeSelect.innerHTML = '<option value="">-- Choose Route --</option>';
        
        // Add route options
        Object.entries(transportData.routes).forEach(([id, route]) => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = route.name;
            routeSelect.appendChild(option);
        });
        
        // Update ticket prices when route changes
        routeSelect.addEventListener('change', function() {
            const routeId = this.value;
            if (routeId && transportData.routes[routeId]) {
                const fares = transportData.routes[routeId].fares;
                
                document.querySelectorAll('.ticket-card').forEach(card => {
                    const type = card.querySelector('h3').textContent.toLowerCase();
                    if (fares[type]) {
                        card.querySelector('.price').textContent = `SZL ${fares[type].toFixed(2)}`;
                    }
                });
            }
            
            // Clear previous selections
            clearSeatSelection();
        });
    }
    
    // Handle form submissions with validation
    function handleFormSubmissions() {
        // Quick booking form
        document.querySelector('.booking-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const routeId = document.getElementById('route').value;
            const date = document.getElementById('departure-date').value;
            
            if (!routeId || !date) {
                showAlert('Please select a route and departure date.', 'error');
                return;
            }
            
            // Update summary with selected values
            const routeData = transportData.routes[routeId];
            document.querySelector('.route-detail').textContent = routeData.name;
            
            const dateObj = new Date(date);
            document.querySelector('.date-detail').textContent = dateObj.toLocaleDateString('en-US', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
            
            // Select a random schedule time
            const randomTime = routeData.schedule[Math.floor(Math.random() * routeData.schedule.length)];
            document.querySelector('.time-detail').textContent = randomTime;
            
            // Generate new seat layout for this booking
            generateSeats();
            
            // Scroll to ticket types section
            document.querySelector('.ticket-types').scrollIntoView({
                behavior: 'smooth'
            });
            
            showAlert('Available buses loaded. Please select your ticket type.', 'success');
        });
        
        // Payment forms
        document.querySelectorAll('.payment-form').forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validate required fields
                if (!selectedSeats.length) {
                    showAlert('Please select at least one seat.', 'error');
                    return;
                }
                
                // Process payment (simulated)
                simulatePaymentProcessing()
                    .then(() => {
                        // Generate ticket
                        generateETicket();
                        showAlert('Payment successful! Your ticket has been booked.', 'success');
                        
                        // Scroll to QR ticket section
                        document.querySelector('.qr-ticket-section').scrollIntoView({
                            behavior: 'smooth'
                        });
                    })
                    .catch(error => {
                        showAlert('Payment failed: ' + error, 'error');
                    });
            });
        });
    }
    
    // Simulate payment processing
    function simulatePaymentProcessing() {
        return new Promise((resolve, reject) => {
            // 10% chance of failure for demo purposes
            if (Math.random() < 0.1) {
                setTimeout(() => reject('Network error. Please try again.'), 1500);
            } else {
                setTimeout(resolve, 2000);
            }
        });
    }
    
    // Generate e-ticket with all details
    function generateETicket() {
        const routeId = document.getElementById('route').value;
        const routeData = transportData.routes[routeId];
        const date = document.getElementById('departure-date').value;
        const dateObj = new Date(date);
        const time = document.querySelector('.time-detail').textContent;
        const ticketType = document.querySelector('.ticket-card.featured h3').textContent;
        
        // Generate random bus number
        const busNumbers = Object.keys(transportData.buses);
        const randomBus = busNumbers[Math.floor(Math.random() * busNumbers.length)];
        
        // Generate random ticket number
        const ticketNumber = 'ESW' + new Date().getFullYear() + 
                            (new Date().getMonth() + 1).toString().padStart(2, '0') + 
                            new Date().getDate().toString().padStart(2, '0') + 
                            Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        
        // Update ticket details
        document.querySelector('.ticket-number').textContent = `Ticket #: ${ticketNumber}`;
        document.querySelector('.detail-value:nth-child(1)').textContent = routeData.name;
        document.querySelector('.detail-value:nth-child(2)').textContent = 
            dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
        document.querySelector('.detail-value:nth-child(3)').textContent = time;
        document.querySelector('.detail-value:nth-child(4)').textContent = 
            `${selectedSeats.length} ${selectedSeats.length === 1 ? 'Passenger' : 'Passengers'} (${ticketType})`;
        document.querySelector('.detail-value:nth-child(5)').textContent = selectedSeats.join(', ');
        document.querySelector('.detail-value:nth-child(6)').textContent = randomBus;
        
        // Update total amount
        const pricePerTicket = routeData.fares[ticketType.toLowerCase()] || routeData.fares.standard;
        const total = selectedSeats.length * pricePerTicket;
        document.querySelector('.qr-ticket .total-amount').textContent = `Total: SZL ${total.toFixed(2)}`;
        
        // Generate QR code (simulated)
        const qrCodeImg = document.querySelector('.qr-code img');
        qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ticketNumber)}`;
    }
    
    // Show alert message
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.innerHTML = `
            <span>${message}</span>
            <button class="close-alert">&times;</button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
        
        // Close button
        alertDiv.querySelector('.close-alert').addEventListener('click', () => {
            alertDiv.remove();
        });
    }
    
    // Initialize all functions
    initRouteSelector();
    generateSeats();
    handleSeatSelection();
    handleTicketTypeSelection();
    handlePaymentTabs();
    handleFormSubmissions();
    
    // Set minimum date for departure date picker (today)
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('departure-date').setAttribute('min', today);
    
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('departure-date').valueAsDate = tomorrow;
});