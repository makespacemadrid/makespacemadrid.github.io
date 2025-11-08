function sendEmail() {
    const x = '';
    const y = 'makespacemadrid';
    const emailAddress = `${x}@${y}.org`;
    window.location.href = `mailto:${emailAddress}`;
}

function openTelegramLink() {
    const x = 'makespacemadridorg';
    const telegramUrl = `https://t.me/${x}`;
    window.open(telegramUrl, '_blank');
}

document.addEventListener('DOMContentLoaded', function() {
    const email = document.querySelector('#email-link');
    const telegram = document.querySelector('#telegram-link');
    email.onclick = sendEmail;
    telegram.onclick = openTelegramLink;
});