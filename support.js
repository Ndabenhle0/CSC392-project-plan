document.addEventListener('DOMContentLoaded', function() {
    // FAQ Accordion Functionality
    function initFAQAccordion() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                // Toggle active class on question
                this.classList.toggle('active');
                
                // Toggle answer visibility
                const answer = this.nextElementSibling;
                answer.classList.toggle('active');
                
                // Close other answers if this one is opening
                if (this.classList.contains('active')) {
                    faqQuestions.forEach(q => {
                        if (q !== this && q.classList.contains('active')) {
                            q.classList.remove('active');
                            q.nextElementSibling.classList.remove('active');
                        }
                    });
                }
            });
        });
    }
    
    // FAQ Category Filtering
    function initFAQFiltering() {
        const categories = document.querySelectorAll('.faq-category');
        const faqItems = document.querySelectorAll('.faq-item');
        
        categories.forEach(category => {
            category.addEventListener('click', function() {
                const categoryId = this.getAttribute('data-category');
                
                // Update active category
                categories.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                
                // Filter FAQ items
                faqItems.forEach(item => {
                    if (categoryId === 'all' || item.getAttribute('data-categories').includes(categoryId)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // FAQ Search Functionality
    function initFAQSearch() {
        const searchInput = document.querySelector('.search-box input');
        const searchButton = document.querySelector('.search-box button');
        
        function performSearch() {
            const searchTerm = searchInput.value.toLowerCase();
            const faqItems = document.querySelectorAll('.faq-item');
            
            if (searchTerm.length < 2) {
                // Show all if search term is too short
                faqItems.forEach(item => {
                    item.style.display = 'block';
                });
                return;
            }
            
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question').textContent.toLowerCase();
                const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
                
                if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                    item.style.display = 'block';
                    
                    // Expand matching items
                    const questionBtn = item.querySelector('.faq-question');
                    if (!questionBtn.classList.contains('active')) {
                        questionBtn.classList.add('active');
                        item.querySelector('.faq-answer').classList.add('active');
                    }
                } else {
                    item.style.display = 'none';
                }
            });
        }
        
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        searchButton.addEventListener('click', performSearch);
    }
    
    // Star Rating System
    function initStarRating() {
        const stars = document.querySelectorAll('.rating-stars i');
        const ratingInput = document.getElementById('feedback-rating');
        
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = this.getAttribute('data-rating');
                ratingInput.value = rating;
                
                // Update star display
                stars.forEach((s, index) => {
                    if (index < rating) {
                        s.classList.remove('far');
                        s.classList.add('fas', 'active');
                    } else {
                        s.classList.remove('fas', 'active');
                        s.classList.add('far');
                    }
                });
            });
            
            // Hover effect
            star.addEventListener('mouseover', function() {
                const hoverRating = this.getAttribute('data-rating');
                stars.forEach((s, index) => {
                    if (index < hoverRating) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    } else {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });
            });
            
            star.addEventListener('mouseout', function() {
                const currentRating = ratingInput.value;
                stars.forEach((s, index) => {
                    if (index < currentRating) {
                        s.classList.remove('far');
                        s.classList.add('fas', 'active');
                    } else {
                        s.classList.remove('fas', 'active');
                        s.classList.add('far');
                    }
                });
            });
        });
    }
    
    // Form Submissions
    function handleFormSubmissions() {
        // Feedback form
        document.querySelector('.feedback-section form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const type = document.getElementById('feedback-type').value;
            const rating = document.getElementById('feedback-rating').value;
            const message = document.getElementById('feedback-message').value;
            
            if (!message) {
                alert('Please provide your feedback message');
                return;
            }
            
            // In a real implementation, this would submit to your backend
            alert('Thank you for your feedback! We appreciate your input.');
            this.reset();
            
            // Reset stars
            const stars = document.querySelectorAll('.rating-stars i');
            stars.forEach(star => {
                star.classList.remove('fas', 'active');
                star.classList.add('far');
            });
            document.getElementById('feedback-rating').value = '0';
        });
        
        // Lost & Found form
        document.querySelector('.lost-found-form form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const item = document.getElementById('lost-item').value;
            const date = document.getElementById('lost-date').value;
            const contact = document.getElementById('lost-contact').value;
            
            if (!item || !date || !contact) {
                alert('Please fill in all required fields');
                return;
            }
            
            // In a real implementation, this would submit to your backend
            alert('Your lost item report has been submitted. We will contact you if your item is found.');
            this.reset();
        });
    }
    
    // Initialize all functions
    initFAQAccordion();
    initFAQFiltering();
    initFAQSearch();
    initStarRating();
    handleFormSubmissions();
    
    // Set maximum date for lost item report (today)
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('lost-date').setAttribute('max', today);
});