document.addEventListener('DOMContentLoaded', () => {
    const homeContainer = document.getElementById('homeContainer');

    // Create logo element
    const logo = document.createElement('img');
    logo.src = 'assets/ds_stack_black.svg';  // Ensure the path is correct
    logo.alt = 'DigiSwatch Logo';
    logo.classList.add('intro-logo');
    logo.style.opacity = '0';
    logo.style.transform = 'scale(0.8)';

    // Create "Get Started" button element
    const button = document.createElement('button');
    button.textContent = 'Get Started';
    button.classList.add('get-started-btn');
    button.style.opacity = '0';
    button.style.transform = 'translateY(20px)';
    button.onclick = () => location.href = 'pages/palette.html';

    // Append elements to the container
    homeContainer.appendChild(logo);
    homeContainer.appendChild(button);

    // Animate logo fade-in
    setTimeout(() => {
        logo.style.transition = 'opacity 1.5s ease, transform 1.5s ease';
        logo.style.opacity = '1';
        logo.style.transform = 'scale(1)';
    }, 500);

    // Animate button pop-up after logo fades in
    setTimeout(() => {
        button.style.transition = 'opacity 1s ease, transform 1s ease';
        button.style.opacity = '1';
        button.style.transform = 'translateY(0)';
    }, 2000);
});
