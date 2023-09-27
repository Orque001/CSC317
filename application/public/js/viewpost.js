let count = 0;
//do it with DOM api
function buildCardsUsingDOMAPI(container, data){ //container is image lists
    count++;
    let cardDiv = document.createElement('div');
    cardDiv.addEventListener('click', function(ev){
        ev.currentTarget.classList.add("removed");
    })

    //this event listener will wait for the transition in .img-card to .removed to be complete
    //then it will run
    cardDiv.addEventListener("transitionend", function(ev){
        cardDiv.remove();
        count--;
        console.log(count);
    })

    cardDiv.setAttribute('class', 'img-card');

    let imgElement = document.createElement('img');
    imgElement.setAttribute('src', data.url);
    imgElement.setAttribute('class', 'img');

    let title = document.createElement('p');
    title.setAttribute('class', 'img-title');
    title.appendChild(document.createTextNode(data.title));

    //now to link these statements together, do it backwards
    cardDiv.appendChild(imgElement);
    cardDiv.appendChild(title);

    container.appendChild(cardDiv);
}
function updateCount(){
    let container = document.getElementById('img-list');
    let footer = document.getElementById('index-footer');
    if (document.getElementById('photoCount') != null) {
        let childElement = document.getElementById('photoCount');
        footer.removeChild(childElement);
    }
    let countElement = document.createElement('p');
    countElement.setAttribute('class', 'photo-count');
    countElement.setAttribute('id', 'photoCount');
    countElement.appendChild(document.createTextNode(count.toString()));
    footer.appendChild(countElement);
}

function fetchProducts(){
    fetch("https://jsonplaceholder.typicode.com/albums/2/photos")
        .then(function(response){
            console.log(response);
            return response.json();
        })
        .then(function(data){
            let photos = data; //<-----------what is it called?
            let container = document.getElementById('img-list');
            let containerFragment = document.createDocumentFragment();
            photos.forEach(function(img) {
                buildCardsUsingDOMAPI(container, img);

            })
            container.appendChild(containerFragment);
        })
    //promise syntax - an object that wraps an event that promises to be resolved (run successfully)
}
fetchProducts()
//instead of a setTimeout can I make it so the updateCount function instead waits for the fetchProducts
//to finsih loading then run?
setTimeout(updateCount, 100) //put on delay so the count can be updated
document.addEventListener('click', function (e){
    setTimeout(updateCount, 1001)
})
