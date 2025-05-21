document.addEventListener('DOMContentLoaded', function() {
    // Transport system data
    const transportData = {
        routes: {
            'mbabane-manzini': {
                name: 'Mbabane to Manzini',
                coordinates: [
                    [-26.3167, 31.1333], // Mbabane
                    [-26.4833, 31.3667], // Matsapha
                    [-26.5258, 31.3072]  // Manzini
                ],
                color: '#3498db',
                schedule: {
                    weekday: {
                        firstDeparture: '05:30',
                        lastDeparture: '20:00',
                        frequency: 'Every 20-30min',
                        journeyTime: '45min',
                        stops: ['Mbabane Bus Terminal', 'Matsapha Industrial', 'Manzini Station']
                    },
                    saturday: {
                        firstDeparture: '06:30',
                        lastDeparture: '19:00',
                        frequency: 'Every 30-45min',
                        journeyTime: '45min'
                    },
                    sunday: {
                        firstDeparture: '08:00',
                        lastDeparture: '18:00',
                        frequency: 'Hourly',
                        journeyTime: '45min'
                    }
                },
                fare: 'E25.00',
                vehicles: ['16-seater minibus', '32-seater bus'],
                amenities: ['AC', 'WiFi', 'Charging ports'],
                operator: 'Eswatini Express'
            },
            'manzini-big-bend': {
                name: 'Manzini to Big Bend',
                coordinates: [
                    [-26.5258, 31.3072], // Manzini
                    [-26.5667, 31.8833], // Siphofaneni
                    [-26.8167, 31.9333]  // Big Bend
                ],
                color: '#e74c3c',
                schedule: {
                    weekday: {
                        firstDeparture: '06:00',
                        lastDeparture: '18:00',
                        frequency: 'Every 2 hours',
                        journeyTime: '2h 15min',
                        stops: ['Manzini Station', 'Siphofaneni Junction', 'Big Bend Terminal']
                    },
                    saturday: {
                        firstDeparture: '07:00',
                        lastDeparture: '17:00',
                        frequency: 'Every 3 hours',
                        journeyTime: '2h 15min'
                    },
                    sunday: {
                        firstDeparture: '09:00',
                        lastDeparture: '15:00',
                        frequency: '3 daily trips',
                        journeyTime: '2h 15min'
                    }
                },
                fare: 'E45.00',
                vehicles: ['32-seater bus', '25-seater coaster'],
                amenities: ['AC', 'Restroom'],
                operator: 'Sugarland Shuttles'
            },
            'mbabane-siteki': {
                name: 'Mbabane to Siteki',
                coordinates: [
                    [-26.3167, 31.1333], // Mbabane
                    [-26.4500, 31.9500], // Siteki
                ],
                color: '#2ecc71',
                schedule: {
                    weekday: {
                        firstDeparture: '07:00',
                        lastDeparture: '17:00',
                        frequency: '5 daily trips',
                        journeyTime: '2h 30min',
                        stops: ['Mbabane Bus Terminal', 'Siteki Main Station']
                    },
                    saturday: {
                        firstDeparture: '08:00',
                        lastDeparture: '16:00',
                        frequency: '4 daily trips',
                        journeyTime: '2h 30min'
                    },
                    sunday: {
                        firstDeparture: '09:00',
                        lastDeparture: '15:00',
                        frequency: '3 daily trips',
                        journeyTime: '2h 30min'
                    }
                },
                fare: 'E35.00',
                vehicles: ['16-seater minibus', '25-seater coaster'],
                amenities: ['AC'],
                operator: 'Lubombo Express'
            }
        },
        locations: {
            'mbabane': 'Mbabane Bus Terminal',
            'manzini': 'Manzini Station',
            'big-bend': 'Big Bend Terminal',
            'siteki': 'Siteki Main Station',
            'ngwenya': 'Ngwenya Border Post',
            'siphofaneni': 'Siphofaneni Junction',
            'nkoyoyo': 'Nkoyoyo Market',
            'matsapha': 'Matsapha Industrial'
        },
        popularDestinations: [
            {
                id: 'mbabane',
                name: 'Mbabane',
                description: 'Capital city with government offices and shopping centers',
                departures: '50+ daily departures',
                journeyTime: 'From 45min journey',
                image: 'Mbabane.jpg',
                routes: ['mbabane-manzini', 'mbabane-siteki']
            },
            {
                id: 'manzini',
                name: 'Manzini',
                description: 'Commercial hub with markets and business districts',
                departures: '60+ daily departures',
                journeyTime: 'From 45min journey',
                image: 'Manzini.jpg',
                routes: ['mbabane-manzini', 'manzini-big-bend']
            },
            {
                id: 'mlilwane',
                name: 'Mlilwane Wildlife Sanctuary',
                description: 'Nature reserve with wildlife viewing and activities',
                departures: '8 daily departures',
                journeyTime: '1h 15min journey',
                image: 'mlilwane.jpg',
                routes: ['manzini-big-bend']
            }
        ]
    };

    // Initialize map with routes
    function initMap() {
        const map = L.map('route-map').setView([-26.5225, 31.4659], 9);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Add markers and routes to map
        function addRouteToMap(routeId) {
            // Clear existing routes and markers
            map.eachLayer(layer => {
                if (layer instanceof L.Polyline || layer instanceof L.Marker) {
                    map.removeLayer(layer);
                }
            });
            
            const route = transportData.routes[routeId];
            
            // Add route line
            const polyline = L.polyline(route.coordinates, {
                color: route.color,
                weight: 5,
                opacity: 0.7
            }).addTo(map);
            
            // Add markers for each stop with popups
            route.coordinates.forEach((coord, index) => {
                const isFirst = index === 0;
                const isLast = index === route.coordinates.length - 1;
                const stopName = route.schedule.weekday.stops[index];
                
                let icon;
                if (isFirst) {
                    icon = L.divIcon({
                        className: 'map-marker start',
                        html: '<i class="fas fa-map-marker-alt"></i>',
                        iconSize: [30, 30]
                    });
                } else if (isLast) {
                    icon = L.divIcon({
                        className: 'map-marker end',
                        html: '<i class="fas fa-map-marker-alt"></i>',
                        iconSize: [30, 30]
                    });
                } else {
                    icon = L.divIcon({
                        className: 'map-marker intermediate',
                        html: '<i class="fas fa-circle"></i>',
                        iconSize: [15, 15]
                    });
                }
                
                const marker = L.marker(coord, { icon: icon }).addTo(map);
                marker.bindPopup(`<b>${stopName}</b><br>${route.name}`);
            });
            
            // Fit map to route bounds
            const bounds = L.latLngBounds(route.coordinates);
            map.fitBounds(bounds, { padding: [50, 50] });
            
            // Update route details section
            updateRouteDetails(routeId);
        }
        
        // Set default route
        addRouteToMap('mbabane-manzini');
        
        // Handle route selection buttons
        document.querySelectorAll('.map-control-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const routeId = this.getAttribute('data-route');
                
                // Update active button
                document.querySelectorAll('.map-control-btn').forEach(b => {
                    b.classList.remove('active');
                });
                this.classList.add('active');
                
                // Update map
                addRouteToMap(routeId);
            });
        });
    }
    
    // Update route details section
    function updateRouteDetails(routeId) {
        const route = transportData.routes[routeId];
        const detailsContainer = document.querySelector('.route-details');
        
        if (!detailsContainer) {
            // Create route details section if it doesn't exist
            const mapDisplay = document.querySelector('.map-display');
            const detailsHTML = `
                <div class="route-details">
                    <h3>${route.name}</h3>
                    <div class="route-info-grid">
                        <div class="route-info-card">
                            <h4><i class="fas fa-clock"></i> Schedule</h4>
                            <ul>
                                <li><strong>Weekdays:</strong> ${route.schedule.weekday.firstDeparture} - ${route.schedule.weekday.lastDeparture} (${route.schedule.weekday.frequency})</li>
                                <li><strong>Saturdays:</strong> ${route.schedule.saturday.firstDeparture} - ${route.schedule.saturday.lastDeparture} (${route.schedule.saturday.frequency})</li>
                                <li><strong>Sundays:</strong> ${route.schedule.sunday.firstDeparture} - ${route.schedule.sunday.lastDeparture} (${route.schedule.sunday.frequency})</li>
                            </ul>
                        </div>
                        <div class="route-info-card">
                            <h4><i class="fas fa-money-bill-wave"></i> Fare</h4>
                            <p>${route.fare}</p>
                            <h4><i class="fas fa-bus"></i> Vehicles</h4>
                            <p>${route.vehicles.join(', ')}</p>
                        </div>
                        <div class="route-info-card">
                            <h4><i class="fas fa-concierge-bell"></i> Amenities</h4>
                            <p>${route.amenities.join(', ')}</p>
                            <h4><i class="fas fa-building"></i> Operator</h4>
                            <p>${route.operator}</p>
                        </div>
                    </div>
                    <div class="route-stops">
                        <h4><i class="fas fa-map-pin"></i> Stops</h4>
                        <ol>
                            ${route.schedule.weekday.stops.map(stop => `<li>${stop}</li>`).join('')}
                        </ol>
                    </div>
                </div>
            `;
            mapDisplay.insertAdjacentHTML('beforeend', detailsHTML);
        } else {
            // Update existing details
            detailsContainer.innerHTML = `
                <h3>${route.name}</h3>
                <div class="route-info-grid">
                    <div class="route-info-card">
                        <h4><i class="fas fa-clock"></i> Schedule</h4>
                        <ul>
                            <li><strong>Weekdays:</strong> ${route.schedule.weekday.firstDeparture} - ${route.schedule.weekday.lastDeparture} (${route.schedule.weekday.frequency})</li>
                            <li><strong>Saturdays:</strong> ${route.schedule.saturday.firstDeparture} - ${route.schedule.saturday.lastDeparture} (${route.schedule.saturday.frequency})</li>
                            <li><strong>Sundays:</strong> ${route.schedule.sunday.firstDeparture} - ${route.schedule.sunday.lastDeparture} (${route.schedule.sunday.frequency})</li>
                        </ul>
                    </div>
                    <div class="route-info-card">
                        <h4><i class="fas fa-money-bill-wave"></i> Fare</h4>
                        <p>${route.fare}</p>
                        <h4><i class="fas fa-bus"></i> Vehicles</h4>
                        <p>${route.vehicles.join(', ')}</p>
                    </div>
                    <div class="route-info-card">
                        <h4><i class="fas fa-concierge-bell"></i> Amenities</h4>
                        <p>${route.amenities.join(', ')}</p>
                        <h4><i class="fas fa-building"></i> Operator</h4>
                        <p>${route.operator}</p>
                    </div>
                </div>
                <div class="route-stops">
                    <h4><i class="fas fa-map-pin"></i> Stops</h4>
                    <ol>
                        ${route.schedule.weekday.stops.map(stop => `<li>${stop}</li>`).join('')}
                    </ol>
                </div>
            `;
        }
    }
    
    // Initialize tabs functionality
    function initTabs() {
        // Route selector tabs
        const selectorTabs = document.querySelectorAll('.selector-tab');
        const selectorContents = document.querySelectorAll('.selector-content');
        
        selectorTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Update active tab
                selectorTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Show corresponding content
                selectorContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === tabId) {
                        content.classList.add('active');
                    }
                });
            });
        });
        
        // Timetable tabs
        const timetableTabs = document.querySelectorAll('.timetable-tab');
        const timetableContents = document.querySelectorAll('.timetable-content');
        
        timetableTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const scheduleId = this.getAttribute('data-schedule');
                
                // Update active tab
                timetableTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Show corresponding content
                timetableContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === scheduleId) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }
    
    // Handle form submission with route search
    function handleFormSubmission() {
        document.querySelector('.route-search-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const origin = document.getElementById('origin').value;
            const destination = document.getElementById('destination').value;
            
            if (!origin || !destination) {
                showAlert('Please select both origin and destination.', 'error');
                return;
            }
            
            if (origin === destination) {
                showAlert('Origin and destination cannot be the same.', 'error');
                return;
            }
            
            // Find matching routes (simplified logic for demo)
            const matchingRoutes = findMatchingRoutes(origin, destination);
            
            if (matchingRoutes.length === 0) {
                showAlert('No direct routes found. Please try different locations.', 'info');
                return;
            }
            
            // Display search results
            displaySearchResults(matchingRoutes, origin, destination);
            
            // Scroll to results
            document.querySelector('.search-results').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
    // Find routes between two locations
    function findMatchingRoutes(origin, destination) {
        const matchingRoutes = [];
        
        // Simplified matching logic - in a real app this would be more sophisticated
        for (const [routeId, route] of Object.entries(transportData.routes)) {
            const firstStop = route.coordinates[0];
            const lastStop = route.coordinates[route.coordinates.length - 1];
            
            // Check if origin matches first stop and destination matches last stop (direct route)
            if ((firstStop[0] === -26.3167 && origin === 'mbabane' && lastStop[0] === -26.5258 && destination === 'manzini') ||
                (firstStop[0] === -26.5258 && origin === 'manzini' && lastStop[0] === -26.8167 && destination === 'big-bend') ||
                (firstStop[0] === -26.3167 && origin === 'mbabane' && lastStop[0] === -26.4500 && destination === 'siteki')) {
                matchingRoutes.push(routeId);
            }
        }
        
        return matchingRoutes;
    }
    
    // Display search results
    function displaySearchResults(routeIds, origin, destination) {
        let resultsContainer = document.querySelector('.search-results');
        
        if (!resultsContainer) {
            resultsContainer = document.createElement('div');
            resultsContainer.className = 'search-results';
            document.querySelector('.route-selector').appendChild(resultsContainer);
        }
        
        const originName = transportData.locations[origin] || origin;
        const destinationName = transportData.locations[destination] || destination;
        
        let resultsHTML = `
            <h3><i class="fas fa-route"></i> Routes from ${originName} to ${destinationName}</h3>
            <div class="route-results">
        `;
        
        routeIds.forEach(routeId => {
            const route = transportData.routes[routeId];
            resultsHTML += `
                <div class="route-result-card">
                    <div class="route-summary">
                        <h4>${route.name}</h4>
                        <div class="route-meta">
                            <span><i class="fas fa-clock"></i> ${route.schedule.weekday.journeyTime}</span>
                            <span><i class="fas fa-money-bill-wave"></i> ${route.fare}</span>
                            <span><i class="fas fa-bus"></i> ${route.vehicles[0]}</span>
                        </div>
                    </div>
                    <div class="route-actions">
                        <button class="btn secondary-btn view-route-btn" data-route="${routeId}">
                            <i class="fas fa-map-marked-alt"></i> View Route
                        </button>
                        <button class="btn primary-btn book-btn">
                            <i class="fas fa-ticket-alt"></i> Book Ticket
                        </button>
                    </div>
                </div>
            `;
        });
        
        resultsHTML += `</div>`;
        resultsContainer.innerHTML = resultsHTML;
        
        // Add event listeners to view route buttons
        document.querySelectorAll('.view-route-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const routeId = this.getAttribute('data-route');
                
                // Update active map control button
                document.querySelectorAll('.map-control-btn').forEach(b => {
                    b.classList.remove('active');
                    if (b.getAttribute('data-route') === routeId) {
                        b.classList.add('active');
                    }
                });
                
                // Show the route on map
                addRouteToMap(routeId);
                
                // Scroll to map
                document.querySelector('.map-display').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
        
        // Add event listeners to book buttons
        document.querySelectorAll('.book-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                // In a real app, this would redirect to booking page
                showAlert('Redirecting to booking system...', 'success');
            });
        });
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
    
    // Handle popular destination clicks
    function initPopularDestinations() {
        document.querySelectorAll('.destination-card .btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const destinationId = this.closest('.destination-card').getAttribute('data-destination');
                const destination = transportData.popularDestinations.find(d => d.id === destinationId);
                
                if (destination) {
                    // Show all routes to this destination
                    const originSelect = document.getElementById('origin');
                    const destinationSelect = document.getElementById('destination');
                    
                    // Set destination in search form
                    destinationSelect.value = destinationId;
                    
                    // Switch to search tab
                    document.querySelector('.selector-tab[data-tab="search-routes"]').click();
                    
                    // Show message
                    showAlert(`Showing routes to ${destination.name}`, 'info');
                    
                    // Focus on origin select
                    originSelect.focus();
                }
            });
        });
    }
    
    // Initialize all functions
    initMap();
    initTabs();
    handleFormSubmission();
    initPopularDestinations();
    
    // Set minimum date for travel date picker (today)
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('travel-date').setAttribute('min', today);
    
    // Add data-destination attributes to popular destination cards
    document.querySelectorAll('.destination-card').forEach((card, index) => {
        if (transportData.popularDestinations[index]) {
            card.setAttribute('data-destination', transportData.popularDestinations[index].id);
        }
    });
});