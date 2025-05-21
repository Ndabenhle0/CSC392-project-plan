document.addEventListener('DOMContentLoaded', function() {
    // Enhanced transport data with real-time simulation
    const transportData = {
        routes: {
            'mbabane-manzini': {
                name: 'Mbabane → Manzini',
                coordinates: [
                    [-26.3167, 31.1333], // Mbabane
                    [-26.4833, 31.3667], // Matsapha
                    [-26.5258, 31.3072]  // Manzini
                ],
                color: '#3498db',
                stops: [
                    { name: 'Mbabane Station', coords: [-26.3167, 31.1333] },
                    { name: 'Matsapha Industrial', coords: [-26.4833, 31.3667] },
                    { name: 'Manzini Station', coords: [-26.5258, 31.3072] }
                ],
                distance: '45 km',
                duration: '45 min',
                buses: {
                    'ESW-101': {
                        type: '32-seater bus',
                        amenities: ['AC', 'WiFi', 'Charging ports'],
                        schedule: ['06:00', '07:30', '09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00']
                    },
                    'ESW-102': {
                        type: '16-seater minibus',
                        amenities: ['AC'],
                        schedule: ['06:30', '08:00', '09:30', '11:00', '12:30', '14:00', '15:30', '17:00', '18:30']
                    }
                }
            },
            'manzini-mbabane': {
                name: 'Manzini → Mbabane',
                coordinates: [
                    [-26.5258, 31.3072], // Manzini
                    [-26.4833, 31.3667], // Matsapha
                    [-26.3167, 31.1333]  // Mbabane
                ],
                color: '#e74c3c',
                stops: [
                    { name: 'Manzini Station', coords: [-26.5258, 31.3072] },
                    { name: 'Matsapha Industrial', coords: [-26.4833, 31.3667] },
                    { name: 'Mbabane Station', coords: [-26.3167, 31.1333] }
                ],
                distance: '45 km',
                duration: '45 min',
                buses: {
                    'ESW-103': {
                        type: '32-seater bus',
                        amenities: ['AC', 'WiFi'],
                        schedule: ['06:15', '07:45', '09:15', '10:45', '12:15', '13:45', '15:15', '16:45', '18:15']
                    },
                    'ESW-104': {
                        type: '16-seater minibus',
                        amenities: ['AC'],
                        schedule: ['06:45', '08:15', '09:45', '11:15', '12:45', '14:15', '15:45', '17:15', '18:45']
                    }
                }
            },
            'manzini-big-bend': {
                name: 'Manzini → Big Bend',
                coordinates: [
                    [-26.5258, 31.3072], // Manzini
                    [-26.5667, 31.8833], // Siphofaneni
                    [-26.8167, 31.9333]  // Big Bend
                ],
                color: '#2ecc71',
                stops: [
                    { name: 'Manzini Station', coords: [-26.5258, 31.3072] },
                    { name: 'Siphofaneni Junction', coords: [-26.5667, 31.8833] },
                    { name: 'Big Bend Terminal', coords: [-26.8167, 31.9333] }
                ],
                distance: '120 km',
                duration: '2h 15min',
                buses: {
                    'ESW-201': {
                        type: '32-seater bus',
                        amenities: ['AC', 'Restroom'],
                        schedule: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00']
                    },
                    'ESW-202': {
                        type: '25-seater coaster',
                        amenities: ['AC'],
                        schedule: ['07:00', '09:00', '11:00', '13:00', '15:00', '17:00']
                    }
                }
            },
            'manzini-siteki': {
                name: 'Manzini → Siteki',
                coordinates: [
                    [-26.5258, 31.3072], // Manzini
                    [-26.4500, 31.9500]  // Siteki
                ],
                color: '#9b59b6',
                stops: [
                    { name: 'Manzini Station', coords: [-26.5258, 31.3072] },
                    { name: 'Siteki Main Station', coords: [-26.4500, 31.9500] }
                ],
                distance: '90 km',
                duration: '2h',
                buses: {
                    'ESW-301': {
                        type: '25-seater coaster',
                        amenities: ['AC'],
                        schedule: ['07:00', '09:30', '12:00', '14:30', '17:00']
                    }
                }
            }
        },
        alerts: [
            {
                id: 'alert-1',
                type: 'delay',
                route: 'mbabane-manzini',
                affectedBuses: ['ESW-101', 'ESW-102'],
                title: 'Delay on Mbabane-Manzini Route',
                message: 'Due to heavy traffic near Matsapha Industrial Site, buses are experiencing delays of 15-20 minutes.',
                timestamp: '2023-06-15T08:30:00',
                severity: 'medium'
            },
            {
                id: 'alert-2',
                type: 'update',
                route: 'manzini-siteki',
                affectedBuses: ['ESW-301'],
                title: 'Route Change: Manzini-Siteki',
                message: 'Temporary diversion near Mhlumeni due to road construction. Buses will use alternative route via Tikhuba.',
                timestamp: '2023-06-15T07:45:00',
                severity: 'low'
            },
            {
                id: 'alert-3',
                type: 'cancellation',
                route: 'manzini-mbabane',
                affectedBuses: ['ESW-112'],
                title: 'Cancellation: Late Night Manzini-Mbabane',
                message: 'The 10:30 PM service has been cancelled due to operational reasons. Next service at 5:30 AM.',
                timestamp: '2023-06-14T21:00:00',
                severity: 'high'
            }
        ]
    };

    // Initialize tracking map with enhanced functionality
    function initTrackingMap() {
        const map = L.map('tracking-map').setView([-26.5225, 31.4659], 10);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Define icons
        const busIcon = L.divIcon({
            className: 'bus-marker',
            html: '<i class="fas fa-bus"></i>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        const stopIcon = L.divIcon({
            className: 'stop-marker',
            html: '<i class="fas fa-map-marker-alt"></i>',
            iconSize: [25, 25],
            iconAnchor: [12, 25]
        });

        // Variables to store map elements
        let currentRoute, currentBus, busMarker, routeLine, stopMarkers = [];
        let busInterval;

        // Function to update bus position with realistic movement
        function updateBusPosition(routeId, busId, progress) {
            // Clear existing elements
            if (busMarker) map.removeLayer(busMarker);
            if (routeLine) map.removeLayer(routeLine);
            stopMarkers.forEach(marker => map.removeLayer(marker));
            stopMarkers = [];
            
            // Get the selected route and bus
            currentRoute = transportData.routes[routeId];
            currentBus = busId && currentRoute.buses[busId];
            if (!currentRoute) return;
            
            // Draw the route line
            routeLine = L.polyline(currentRoute.coordinates, {
                color: currentRoute.color,
                weight: 5,
                opacity: 0.7
            }).addTo(map);
            
            // Add stop markers with popups
            currentRoute.stops.forEach((stop, index) => {
                const marker = L.marker(stop.coords, { icon: stopIcon })
                    .bindPopup(`
                        <b>${stop.name}</b><br>
                        ${index === 0 ? 'Departure' : index === currentRoute.stops.length - 1 ? 'Terminus' : 'Stop'}
                        ${currentBus ? `<br><small>Next bus: ${getNextBusTime(routeId, index)}</small>` : ''}
                    `)
                    .addTo(map);
                stopMarkers.push(marker);
            });
            
            // Calculate bus position
            const segmentLength = 1 / (currentRoute.coordinates.length - 1);
            const segmentIndex = Math.min(
                Math.floor(progress / segmentLength),
                currentRoute.coordinates.length - 2
            );
            const segmentProgress = (progress % segmentLength) / segmentLength;
            
            const startCoord = currentRoute.coordinates[segmentIndex];
            const endCoord = currentRoute.coordinates[segmentIndex + 1];
            
            const busLat = startCoord[0] + (endCoord[0] - startCoord[0]) * segmentProgress;
            const busLng = startCoord[1] + (endCoord[1] - startCoord[1]) * segmentProgress;
            
            // Add bus marker with detailed popup
            const nextStopIndex = segmentIndex + 1;
            const nextStop = currentRoute.stops[nextStopIndex]?.name || 'Terminus';
            const busInfo = currentBus ? `
                <b>${busId}</b><br>
                Type: ${currentBus.type}<br>
                Amenities: ${currentBus.amenities.join(', ')}<br>
                Next stop: ${nextStop}
            ` : `
                <b>${currentRoute.name}</b><br>
                Next stop: ${nextStop}
            `;
            
            busMarker = L.marker([busLat, busLng], { 
                icon: busIcon, 
                zIndexOffset: 1000 
            }).bindPopup(busInfo).addTo(map);
            
            // Fit map to show the entire route
            map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
            
            // Update bus info overlay
            updateBusInfo(routeId, busId, progress);
            
            // Update ETA display
            updateETADisplay(routeId, progress);
        }

        // Calculate next bus time for a stop
        function getNextBusTime(routeId, stopIndex) {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMin = now.getMinutes();
            
            const route = transportData.routes[routeId];
            if (!route) return 'N/A';
            
            // Find next departure time from first stop
            const firstStopTimes = Object.values(route.buses).flatMap(bus => bus.schedule);
            const nextTime = firstStopTimes.find(time => {
                const [h, m] = time.split(':').map(Number);
                return h > currentHour || (h === currentHour && m > currentMin);
            });
            
            if (!nextTime) return 'No more today';
            
            // Calculate arrival time at this stop
            const [depH, depM] = nextTime.split(':').map(Number);
            const depTime = new Date();
            depTime.setHours(depH, depM, 0, 0);
            
            // Simple calculation: assume equal time between stops
            const stopCount = route.stops.length;
            const segmentDuration = Math.round(parseInt(route.duration) * 60 / (stopCount - 1)); // in seconds
            const arrivalTime = new Date(depTime.getTime() + (segmentDuration * stopIndex * 1000));
            
            return arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        // Update bus info overlay
        function updateBusInfo(routeId, busId, progress) {
            const route = transportData.routes[routeId];
            if (!route) return;
            
            const segmentLength = 1 / (route.coordinates.length - 1);
            const segmentIndex = Math.min(
                Math.floor(progress / segmentLength),
                route.coordinates.length - 2
            );
            const nextStopIndex = segmentIndex + 1;
            const nextStop = route.stops[nextStopIndex]?.name || 'Terminus';
            
            // Calculate ETA to next stop (simplified)
            const totalTime = parseInt(route.duration) * 60; // in seconds
            const remainingTime = Math.round(totalTime * (1 - progress));
            const eta = new Date();
            eta.setSeconds(eta.getSeconds() + remainingTime);
            
            // Determine status (simulated)
            let status, statusClass;
            if (Math.random() > 0.85) {
                status = 'Delayed';
                statusClass = 'status-delayed';
            } else if (Math.random() > 0.95) {
                status = 'Cancelled';
                statusClass = 'status-cancelled';
            } else {
                status = 'On Time';
                statusClass = 'status-on-time';
            }
            
            // Update overlay
            document.querySelector('.info-value:nth-child(1)').textContent = busId || 'N/A';
            document.querySelector('.info-value:nth-child(2)').textContent = route.name;
            document.querySelector('.info-value:nth-child(3)').textContent = 'Just now';
            document.querySelector('.info-value:nth-child(4)').textContent = nextStop;
            document.querySelector('.info-value:nth-child(5)').textContent = 
                eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            const statusElement = document.querySelector('.info-value:nth-child(6)');
            statusElement.textContent = status;
            statusElement.className = 'info-value ' + statusClass;
        }

        // Update ETA display section
        function updateETADisplay(routeId, progress) {
            const route = transportData.routes[routeId];
            if (!route) return;
            
            // Find matching ETA card
            const card = document.querySelector(`.eta-card h3:contains("${route.name}")`)?.closest('.eta-card');
            if (!card) return;
            
            // Update progress bar
            const progressPercent = Math.round(progress * 100);
            card.querySelector('.progress-bar').style.width = `${progressPercent}%`;
            card.querySelector('.progress-text').textContent = 
                `${progressPercent}% of journey completed`;
            
            // Update stop statuses
            const segmentCount = route.coordinates.length - 1;
            const currentSegment = Math.floor(progress * segmentCount);
            
            card.querySelectorAll('.eta-stop').forEach((stop, index) => {
                const timeElement = stop.querySelector('.stop-time');
                timeElement.className = 'stop-time ';
                
                if (index < currentSegment) {
                    timeElement.classList.add('departed');
                    timeElement.textContent = `Departed ${getRandomTime(-60, -5)}`;
                } else if (index === currentSegment) {
                    timeElement.classList.add('arriving');
                    timeElement.textContent = `Arriving ${getRandomTime(1, 15)}`;
                } else {
                    timeElement.classList.add('scheduled');
                    timeElement.textContent = getNextBusTime(routeId, index);
                }
            });
        }

        // Helper function for random times
        function getRandomTime(minMins, maxMins) {
            const now = new Date();
            const mins = minMins + Math.random() * (maxMins - minMins);
            now.setMinutes(now.getMinutes() + mins);
            return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        // Simulate bus movement
        function simulateBusMovement(routeId, busId) {
            if (busInterval) clearInterval(busInterval);
            
            let progress = 0.1 + Math.random() * 0.3; // Start somewhere along the route
            updateBusPosition(routeId, busId, progress);
            
            busInterval = setInterval(() => {
                // Move bus forward 1-3%
                progress = Math.min(progress + (0.01 + Math.random() * 0.02), 0.99);
                updateBusPosition(routeId, busId, progress);
                
                // Reset if near end
                if (progress >= 0.99) {
                    setTimeout(() => {
                        progress = 0;
                        updateBusPosition(routeId, busId, progress);
                    }, 5000);
                }
            }, 3000);
        }

        // Initialize route selector dropdown
        function initRouteSelector() {
            const routeSelect = document.getElementById('track-route');
            
            // Clear existing options
            routeSelect.innerHTML = '<option value="">-- All Routes --</option>';
            
            // Add route options
            Object.entries(transportData.routes).forEach(([id, route]) => {
                const option = document.createElement('option');
                option.value = id;
                option.textContent = route.name;
                routeSelect.appendChild(option);
            });
            
            // Initialize bus selector based on route
            routeSelect.addEventListener('change', function() {
                const routeId = this.value;
                const busSelect = document.getElementById('track-bus');
                
                // Clear existing options
                busSelect.innerHTML = '<option value="">-- All Buses --</option>';
                
                if (routeId && transportData.routes[routeId]) {
                    // Add bus options for selected route
                    Object.keys(transportData.routes[routeId].buses).forEach(busId => {
                        const option = document.createElement('option');
                        option.value = busId;
                        option.textContent = `${busId} (${transportData.routes[routeId].name})`;
                        busSelect.appendChild(option);
                    });
                }
                
                // Update map with selected route
                if (routeId) {
                    simulateBusMovement(routeId, busSelect.value);
                }
            });
        }

        // Initialize bus selector
        function initBusSelector() {
            document.getElementById('track-bus').addEventListener('change', function() {
                const routeId = document.getElementById('track-route').value;
                const busId = this.value;
                
                if (routeId) {
                    simulateBusMovement(routeId, busId);
                }
            });
        }

        // Handle refresh button
        document.querySelector('.refresh-btn').addEventListener('click', function() {
            const routeId = document.getElementById('track-route').value;
            const busId = document.getElementById('track-bus').value;
            
            if (routeId) {
                // Show refreshing animation
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing';
                
                // Force update
                simulateBusMovement(routeId, busId);
                
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
                }, 1000);
            }
        });

        // Initialize notification tabs
        function initNotificationTabs() {
            const tabs = document.querySelectorAll('.notification-tab');
            const notifications = document.querySelectorAll('.notification-card');
            
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const alertType = this.getAttribute('data-alert');
                    
                    // Update active tab
                    tabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Filter notifications
                    notifications.forEach(notification => {
                        if (alertType === 'all') {
                            notification.style.display = 'flex';
                        } else {
                            const matchesType = notification.classList.contains(`alert-${alertType}`);
                            notification.style.display = matchesType ? 'flex' : 'none';
                        }
                    });
                });
            });
        }

        // Initialize alert notifications
        function initAlerts() {
            const alertsContainer = document.querySelector('.notification-cards');
            
            // Clear existing alerts (keeping the template ones)
            while (alertsContainer.children.length > 3) {
                alertsContainer.removeChild(alertsContainer.lastChild);
            }
            
            // Add real alerts from data
            transportData.alerts.forEach(alert => {
                const alertCard = document.createElement('div');
                alertCard.className = `notification-card alert-${alert.type}`;
                alertCard.innerHTML = `
                    <div class="alert-icon">
                        <i class="fas ${
                            alert.type === 'delay' ? 'fa-clock' : 
                            alert.type === 'cancellation' ? 'fa-times-circle' : 'fa-info-circle'
                        }"></i>
                    </div>
                    <div class="alert-content">
                        <h3>${alert.title}</h3>
                        <p class="alert-meta">Posted ${formatTimeSince(alert.timestamp)} | Affects ${alert.affectedBuses.join(', ')}</p>
                        <p>${alert.message}</p>
                    </div>
                `;
                alertsContainer.appendChild(alertCard);
            });
        }

        // Format time since alert
        function formatTimeSince(timestamp) {
            const now = new Date();
            const alertTime = new Date(timestamp);
            const diff = now - alertTime;
            
            const minutes = Math.floor(diff / (1000 * 60));
            if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
            
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
            
            const days = Math.floor(hours / 24);
            return `${days} day${days !== 1 ? 's' : ''} ago`;
        }

        // Handle subscription form
        function handleSubscription() {
            document.querySelector('.subscribe-form').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const route = document.getElementById('notify-route').value;
                const method = document.getElementById('notify-method').value;
                const contact = document.getElementById('notify-contact').value;
                
                if (!route || !contact) {
                    showAlert('Please select a route and provide contact information.', 'error');
                    return;
                }
                
                // In a real app, this would subscribe the user
                showAlert(`You'll receive ${method} notifications for ${transportData.routes[route].name} at ${contact}`, 'success');
                
                // Reset form
                this.reset();
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

        // Initialize all components
        initRouteSelector();
        initBusSelector();
        initNotificationTabs();
        initAlerts();
        handleSubscription();
        
        // Start with default route
        document.getElementById('track-route').value = 'mbabane-manzini';
        const event = new Event('change');
        document.getElementById('track-route').dispatchEvent(event);
    }

    // Initialize the tracking system
    initTrackingMap();
});