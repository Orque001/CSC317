var url = "https://jsonplaceholder.typicode.com/albums/2/photos";

function fadeOut(ev) {
    ev.currentTarget.remove();
    var ele = ev.CurrentTarget;
    let timer = setInterval(function () {
        console.log("1");
        clearInterval(timer);
        document.getElementById("count").innerHTML = document.getElementsByClassName("post-card").length;
    }, 200);
}

function buildCard(container, data) {
    var cardDiv = document.createElement('div');
    cardDiv.setAttribute('class', 'post-card');

    var imgTag = document.createElement('img');
    imgTag.setAttribute('class', 'post-img');
    imgTag.setAttribute('src', data.url);

    var postInfoDiv = document.createElement('div');
    postInfoDiv.setAttribute('class', 'post-info');

    var titleTag = document.createElement('p');
    titleTag.setAttribute('class', 'post-title');
    titleTag.appendChild(document.createTextNode(data.title));

    cardDiv.addEventListener('click', fadeOut)

    postInfoDiv.appendChild(titleTag);
    cardDiv.appendChild(imgTag);
    cardDiv.appendChild(postInfoDiv);
    container.appendChild(cardDiv);

    return cardDiv;
}

async function fetchWithDOMAPI() {
    try {
        var response = await fetch(url);
        var data = await response.json();
        var container = document.getElementById('post-list');
        data.forEach(function (post) {
            buildCard(container, post);
        });
        // document.getElementById('post-list').append(...container);

    } catch (error) {
        console.log(error);
    }
}
fetchWithDOMAPI();