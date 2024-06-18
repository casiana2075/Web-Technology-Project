import { filterCategory } from './filter.js';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.filterBox ul li').forEach(item => {
        item.addEventListener('click', event => {
            const category = event.target.innerText.toUpperCase();
            console.log(`Clicked category: ${category}`);
            filterCategory(category);
        });
    });
});
