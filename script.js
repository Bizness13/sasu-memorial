
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
    
    // Store in localStorage for now (you'll want to replace this with a backend service)
    let memories = JSON.parse(localStorage.getItem('memories') || '[]');
    memories.push(formData);
    localStorage.set

