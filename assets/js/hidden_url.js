function sendEmail(e) {
    e.preventDefault();
    const x = 'info';
    const y = 'makespacemadrid';
    const emailAddress = `${x}@${y}.org`;
    window.location.href = `mailto:${emailAddress}`;
}

function openTelegramLink(e) {
    e.preventDefault();
    const x = 'makespacemadridorg';
    const telegramUrl = `https://t.me/${x}`;
    window.open(telegramUrl, '_blank');
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.email-link').forEach(el => el.onclick = sendEmail);
    const telegram = document.querySelector('#telegram-link');
    telegram.onclick = openTelegramLink;
});