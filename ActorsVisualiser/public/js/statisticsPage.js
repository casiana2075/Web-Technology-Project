document.addEventListener('DOMContentLoaded', () => {
    const filteredItems = JSON.parse(localStorage.getItem('filteredItems'));
    console.log('filteredItems:', filteredItems);

    if (filteredItems) {
        const moviesContainer = document.querySelector('.movies ul');
        moviesContainer.innerHTML = '';

        filteredItems.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.full_name} (${item.show}) - ${item.category}`;
            moviesContainer.appendChild(listItem);
        });
    } else {
        console.log('No filtered items found in localStorage.');
    }
});
