document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year (minimum 2025)
    const currentYear = new Date().getFullYear();
    const copyrightYear = Math.max(currentYear, 2025);
    const yearElement = document.getElementById('copyright-year');
    if (yearElement) {
        yearElement.textContent = copyrightYear;
    }

    new Splide('.splide', {
        type: 'loop',
        perPage: 1,
        autoplay: true,
        interval: 4000,
        pauseOnHover: true,
        pauseOnFocus: true,
        arrows: true,
        pagination: true,
        speed: 800,
        drag: true,
        keyboard: true
    }).mount();

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const answer = this.nextElementSibling;
            const icon = this.querySelector('.faq-icon');
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close all other FAQs
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    otherQuestion.parentElement.classList.remove('active');
                    otherQuestion.nextElementSibling.style.maxHeight = null;
                    otherQuestion.querySelector('.faq-icon').textContent = '+';
                    otherQuestion.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle current FAQ
            if (!isExpanded) {
                faqItem.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.textContent = '−';
                this.setAttribute('aria-expanded', 'true');
            } else {
                faqItem.classList.remove('active');
                answer.style.maxHeight = null;
                icon.textContent = '+';
                this.setAttribute('aria-expanded', 'false');
            }
        });
    });
});
