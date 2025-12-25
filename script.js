
// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Image Slideshow Functionality
let currentSlide = 0;
let images = [];
let isPlaying = true;
let slideshowInterval;

// Function to load all images from the images folder
async function loadImages() {
    // Since we can't directly read directory contents in the browser,
    // we'll need to manually list the images or use a build script
    // For now, we'll create a comprehensive list of common image extensions
    
    const imageFolder = 'images/';
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'JPG', 'JPEG', 'PNG', 'GIF'];
    
    // This approach requires you to list your images
    // You can generate this list automatically using a simple script
    // For now, let's try to load images dynamically
    
    // Alternative: Load images by trying common patterns
    const loadedImages = [];
    
    // Try to load images from your folder
    // Since you have 238 images, we'll need to get the actual filenames
    // The best approach is to create an images.json file with all filenames
    
    try {
        const response = await fetch('images/images.json');
        if (response.ok) {
            const imageList = await response.json();
            images = imageList.map(img => imageFolder + img);
        } else {
            // Fallback: try to load images with common naming patterns
            await loadImagesWithPatterns();
        }
    } catch (error) {
        // If images.json doesn't exist, try pattern-based loading
        await loadImagesWithPatterns();
    }
    
    if (images.length > 0) {
        initializeSlideshow();
    } else {
        document.getElementById('slideCounter').textContent = 'No images found. Please check the images folder.';
    }
}

// Fallback function to try loading images with common patterns
async function loadImagesWithPatterns() {
    const imageFolder = 'images/';
    const extensions = ['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'PNG'];
    
    // Try common naming patterns
    const patterns = [
        // Try numbered patterns
        ...Array.from({length: 300}, (_, i) => `IMG_${String(i).padStart(4, '0')}`),
        ...Array.from({length: 300}, (_, i) => `DSC_${String(i).padStart(4, '0')}`),
        ...Array.from({length: 300}, (_, i) => `${i}`),
        // Try other common patterns
        'sasu', 'family', 'graduation', 'teffbar', 'music', 'friends', 'seattle', 'florence'
    ];
    
    const loadPromises = [];
    
    for (const pattern of patterns) {
        for (const ext of extensions) {
            const imagePath = `${imageFolder}${pattern}.${ext}`;
            loadPromises.push(
                checkImageExists(imagePath).then(exists => {
                    if (exists) images.push(imagePath);
                })
            );
        }
    }
    
    await Promise.all(loadPromises);
}

// Check if an image exists
function checkImageExists(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

// Initialize the slideshow
function initializeSlideshow() {
    if (images.length === 0) return;
    
    // Display first image
    showSlide(0);
    
    // Create thumbnails
    createThumbnails();
    
    // Start autoplay
    startSlideshow();
    
    // Set up controls
    document.getElementById('prevBtn').addEventListener('click', () => {
        changeSlide(-1);
    });
    
    document.getElementById('nextBtn').addEventListener('click', () => {
        changeSlide(1);
    });
    
    document.getElementById('playPauseBtn').addEventListener('click', togglePlayPause);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') changeSlide(-1);
        if (e.key === 'ArrowRight') changeSlide(1);
        if (e.key === ' ') {
            e.preventDefault();
            togglePlayPause();
        }
    });
}

// Show a specific slide
function showSlide(index) {
    if (images.length === 0) return;
    
    currentSlide = (index + images.length) % images.length;
    
    const mainImage = document.getElementById('mainImage');
    mainImage.src = images[currentSlide];
    mainImage.alt = `Sasu's memory ${currentSlide + 1}`;
    
    document.getElementById('slideCounter').textContent = 
        `${currentSlide + 1} / ${images.length}`;
    
    // Update active thumbnail
    updateActiveThumbnail();
}

// Change slide
function changeSlide(direction) {
    showSlide(currentSlide + direction);
    
    // Reset autoplay timer
    if (isPlaying) {
        clearInterval(slideshowInterval);
        startSlideshow();
    }
}

// Create thumbnail grid
function createThumbnails() {
    const thumbnailGrid = document.getElementById('thumbnailGrid');
    thumbnailGrid.innerHTML = '';
    
    images.forEach((imageSrc, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail';
        if (index === 0) thumbnail.classList.add('active');
        
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = `Thumbnail ${index + 1}`;
        img.loading = 'lazy';
        
        thumbnail.appendChild(img);
        thumbnail.addEventListener('click', () => {
            showSlide(index);
            if (isPlaying) {
                clearInterval(slideshowInterval);
                startSlideshow();
            }
        });
        
        thumbnailGrid.appendChild(thumbnail);
    });
}

// Update active thumbnail
function updateActiveThumbnail() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentSlide);
    });
    
    // Scroll active thumbnail into view
    if (thumbnails[currentSlide]) {
        thumbnails[currentSlide].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }
}

// Start slideshow
function startSlideshow() {
    slideshowInterval = setInterval(() => {
        changeSlide(1);
    }, 5000); // Change image every 5 seconds
}

// Toggle play/pause
function togglePlayPause() {
    const btn = document.getElementById('playPauseBtn');
    
    if (isPlaying) {
        clearInterval(slideshowInterval);
        btn.textContent = '▶';
        isPlaying = false;
    } else {
        startSlideshow();
        btn.textContent = '⏸';
        isPlaying = true;
    }
}

// Load images when page loads
window.addEventListener('load', loadImages);

// Memory form submission handler
document.getElementById('memoryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        relationship: document.getElementById('relationship').value,
        memory: document.getElementById('memory').value,
        timestamp: new Date().toISOString()
    };
    
    // Store in localStorage for now
    let memories = JSON.parse(localStorage.getItem('memories') || '[]');
    memories.push(formData);
    localStorage.setItem('memories', JSON.stringify(memories));
    
    // Show success message
    alert('Thank you for sharing your memory of Sasu. Your tribute has been saved.');
    
    // Reset form
    this.reset();
    
    // Optionally display the new memory
    displayMemories();
});

// Display stored memories
function displayMemories() {
    const memories = JSON.parse(localStorage.getItem('memories') || '[]');
    const tributeWall = document.getElementById('tributeWall');
    
    if (memories.length > 0) {
        tributeWall.innerHTML = '';
        
        memories.reverse().forEach(memory => {
            const tributeItem = document.createElement('div');
            tributeItem.className = 'tribute-item';
            
            const date = new Date(memory.timestamp).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            tributeItem.innerHTML = `
                <div class="tribute-header">
                    <h4>${memory.name}</h4>
                    <span class="tribute-date">${date}</span>
                </div>
                <p class="tribute-text">${memory.memory}</p>
                <p class="tribute-author">— ${memory.relationship || 'A Friend'}</p>
            `;
            
            tributeWall.appendChild(tributeItem);
        });
    }
}

// Load and display memories on page load
window.addEventListener('load', displayMemories);

