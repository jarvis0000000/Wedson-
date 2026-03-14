// Smooth Scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if(target){
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Booking form submission (basic demo)
const bookingForm = document.querySelector('.booking-form');
bookingForm.addEventListener('submit', function(e){
  e.preventDefault();
  alert('Thank you! Your availability request has been submitted.');
});
