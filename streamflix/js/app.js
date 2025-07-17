document.addEventListener('DOMContentLoaded', function() {
    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Create placeholder images for posters and profile
    createPlaceholderImages();
    
    // Add hover effect for poster containers
    const posterContainers = document.querySelectorAll('.poster-container');
    posterContainers.forEach(container => {
        container.addEventListener('mouseenter', function() {
            setTimeout(() => {
                this.style.zIndex = '10';
            }, 300);
        });
        
        container.addEventListener('mouseleave', function() {
            setTimeout(() => {
                this.style.zIndex = '1';
            }, 300);
        });
    });
    
    // Add click event for play buttons
    const playButtons = document.querySelectorAll('.btn-play, .poster-btn:first-child');
    playButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            alert('This is a demo app. Video playback is not available.');
        });
    });
    
    // Add click event for add to list buttons
    const addButtons = document.querySelectorAll('.poster-btn:nth-child(2)');
    addButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            this.innerHTML = this.innerHTML.includes('plus') ? 
                '<i class="fas fa-check"></i>' : 
                '<i class="fas fa-plus"></i>';
            
            const message = this.innerHTML.includes('check') ? 
                'Added to My List' : 
                'Removed from My List';
            
            showNotification(message);
        });
    });
    
    // Add click event for like buttons
    const likeButtons = document.querySelectorAll('.poster-btn:nth-child(3)');
    likeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            this.innerHTML = this.innerHTML.includes('thumbs-up') ? 
                '<i class="fas fa-thumbs-down"></i>' : 
                '<i class="fas fa-thumbs-up"></i>';
            
            const message = this.innerHTML.includes('thumbs-up') ? 
                'Added to your likes' : 
                'Added to your dislikes';
            
            showNotification(message);
        });
    });
    
    // Add click event for poster containers
    posterContainers.forEach(container => {
        container.addEventListener('click', function() {
            const title = this.querySelector('.poster-details').textContent;
            alert(`This is a demo app. Details for this title are not available.`);
        });
    });
});

// Create placeholder images for missing images
function createPlaceholderImages() {
    // For profile image
    const profileImg = document.querySelector('.profile-icon');
    if (profileImg) {
        profileImg.onerror = function() {
            this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23333"/><text x="50" y="50" font-size="50" text-anchor="middle" dominant-baseline="middle" fill="%23FFF">U</text></svg>';
        };
        profileImg.src = profileImg.src;
    }
    
    // For hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.onerror = function() {
            this.outerHTML = '<h1 class="hero-title" style="font-size: 3rem; margin-bottom: 1.5rem;">COSMIC HORIZON</h1>';
        };
    }
    
    // For poster images
    const posters = document.querySelectorAll('.row-poster');
    posters.forEach((poster, index) => {
        poster.onerror = function() {
            const colors = ['#e50914', '#333333', '#564d4d', '#8c8c8c', '#141414'];
            const color = colors[index % colors.length];
            const number = (index % 18) + 1;
            
            this.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"><rect width="200" height="300" fill="${color}"/><text x="100" y="150" font-size="30" text-anchor="middle" dominant-baseline="middle" fill="%23FFF">Movie ${number}</text></svg>`;
        };
        poster.src = poster.src;
    });
    
    // For hero background
    const hero = document.querySelector('.hero');
    if (hero) {
        const img = new Image();
        img.onload = function() {
            hero.style.backgroundImage = `url(${this.src})`;
        };
        img.onerror = function() {
            hero.style.backgroundImage = 'linear-gradient(to bottom, #000 0%, #141414 100%)';
        };
        img.src = '../img/hero-bg.jpg';
    }
}

// Show notification
function showNotification(message) {
    // Check if notification container exists, if not create it
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.bottom = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '1000';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.marginTop = '10px';
    notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    notification.style.transition = 'opacity 0.3s, transform 0.3s';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}