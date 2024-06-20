document.addEventListener('DOMContentLoaded', () => {
    let searchBar = document.querySelector('.search-button input');

    searchBar.addEventListener('input', function() {
        let searchTerm = this.value.toLowerCase();
        let containers = document.querySelectorAll('.container');

        containers.forEach(function(container) {
            let containerText = container.textContent.toLowerCase();
            if (containerText.includes(searchTerm)) {
                container.style.display = '';
            } else {
                container.style.display = 'none';
            }
        });
    });

    searchBar.addEventListener('keypress', function(event) {
        if (event.keyCode === 13) {
            let searchTerm = this.value.toLowerCase();
            let containers = document.querySelectorAll('.container');

            for (let i = 0; i < containers.length; i++) {
                let container = containers[i];
                let containerText = container.textContent.toLowerCase();
                if (containerText.includes(searchTerm)) {
                    let link = container.querySelector('a');
                    if (link) {
                        window.location.href = link.href;
                        break;
                    }
                }
            }
        }
    });
});