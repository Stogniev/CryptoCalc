let openSearchButton = document.querySelectorAll('.holder .open-search');

for(let i = 0; i<openSearchButton.length; i++){
    openSearchButton[i].onclick = openSearchMenu;
}

function openSearchMenu() {
    this.classList.toggle('active');
}