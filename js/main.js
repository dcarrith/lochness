document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Parallax effect
    window.addEventListener('scroll', function() {
        const parallaxSections = document.querySelectorAll('.parallax-section');
        
        parallaxSections.forEach(section => {
            const distance = window.scrollY;
            const parallaxBg = section.querySelector('.parallax-bg');
            
            if (parallaxBg) {
                const speed = 0.5;
                parallaxBg.style.transform = `translateY(${distance * speed}px)`;
            }
        });
    });
    
    // Testimonial slider
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-testimonial');
    const nextBtn = document.querySelector('.next-testimonial');
    let currentSlide = 0;
    
    function showSlide(n) {
        testimonialSlides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + testimonialSlides.length) % testimonialSlides.length;
        
        testimonialSlides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
        nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });
    
    // Auto slide testimonials
    setInterval(() => {
        if (testimonialSlides.length > 1) {
            showSlide(currentSlide + 1);
        }
    }, 5000);
    
    // Form submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send the data to a server
            // For demo purposes, we'll just log it and show a success message
            console.log({name, email, service, message});
            
            // Show success message with Chia-specific response
            let responseMessage = '';
            
            switch(service) {
                case 'farm-monitoring':
                    responseMessage = 'We\'ll help you optimize your Chia farming operation!';
                    break;
                case 'chialisp-security':
                    responseMessage = 'Our Chialisp security experts will be in touch to discuss your smart contract needs.';
                    break;
                case 'farming-analytics':
                    responseMessage = 'We\'ll analyze your farming setup to help maximize your XCH rewards.';
                    break;
                case 'smart-contracts':
                    responseMessage = 'Our Chialisp developers will contact you about your smart contract project.';
                    break;
                case 'datalayer-rad':
                    responseMessage = 'Our DataLayer specialists will contact you to discuss your rapid application development needs.';
                    break;
                case 'enterprise-provenance':
                    responseMessage = 'Our enterprise blockchain team will reach out to discuss how we can implement provenance and transparency solutions for your business.';
                    break;
                default:
                    responseMessage = 'We\'ll get back to you shortly about your Chia blockchain needs.';
            }
            
            contactForm.innerHTML = `
                <div class="success-message">
                    <h3>Thank you for your message, ${name}!</h3>
                    <p>${responseMessage}</p>
                    <p>We'll reach out to you at ${email} within 24 hours.</p>
                </div>
            `;
        });
    }
    
    // Add a simple Chia farming calculator
    const calculatorSection = document.createElement('div');
    calculatorSection.className = 'calculator-widget';
    calculatorSection.innerHTML = `
        <h4>Chia Farming Calculator</h4>
        <div class="calculator-form">
            <div class="form-group">
                <label for="plotSize">Number of Plots:</label>
                <input type="number" id="plotSize" min="1" value="100">
            </div>
            <div class="form-group">
                <label for="networkSize">Network Space (EiB):</label>
                <input type="number" id="networkSize" min="0.1" step="0.1" value="40">
            </div>
            <button id="calculateBtn" class="btn btn-primary">Calculate</button>
            <div id="calculationResult"></div>
        </div>
    `;
    
    // Add calculator to the technology section
    const techFeatures = document.querySelector('.tech-features');
    if (techFeatures) {
        techFeatures.appendChild(calculatorSection);
        
        // Add calculator functionality
        const calculateBtn = document.getElementById('calculateBtn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', function() {
                const plots = parseFloat(document.getElementById('plotSize').value);
                const networkSize = parseFloat(document.getElementById('networkSize').value);
                
                // Simple Chia reward calculation (approximate)
                const plotSizeInTiB = plots * 0.1; // Each plot is roughly 0.1 TiB
                const networkSizeInTiB = networkSize * 1024 * 1024; // Convert EiB to TiB
                const dailyRewards = (plotSizeInTiB / networkSizeInTiB) * 4608 * 2; // 4608 blocks per day, 2 XCH per block
                
                const resultElement = document.getElementById('calculationResult');
                resultElement.innerHTML = `
                    <p>With ${plots} plots (${plotSizeInTiB.toFixed(2)} TiB) on a ${networkSize} EiB network:</p>
                    <p>Estimated daily XCH: <strong>${dailyRewards.toFixed(4)} XCH</strong></p>
                    <p>Estimated monthly XCH: <strong>${(dailyRewards * 30).toFixed(4)} XCH</strong></p>
                `;
            });
        }
    }
    
    // Animate elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.service-card, .tech-feature, .stat-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial styles for animation
    document.querySelectorAll('.service-card, .tech-feature, .stat-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Run animation on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Run once on page load
    animateOnScroll();
});
