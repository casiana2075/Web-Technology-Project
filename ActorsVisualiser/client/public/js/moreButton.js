document.getElementById("moreButton").addEventListener("click", function(event) {
    event.preventDefault();
    var actorsContainer = document.getElementById("actorsTable").getElementsByClassName("actorsLine")[0];
    var newActors = '';
    for (var i = 0; i < 50; i++) {
        newActors += '<a href="../views/actorProfile.html"><div class="actorCircle"></div></a>';
    }
    actorsContainer.innerHTML += newActors;
});