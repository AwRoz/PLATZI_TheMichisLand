const ApiRandomEndpoint = 'https://api.thecatapi.com/v1/images/search'
const APiFavEndpoint = 'https://api.thecatapi.com/v1/favourites'
const ApiKey = 'live_TDVyIWPpiZsKxPbuVhqeMvmY0lrxo44jTBGlVLOf10qbgOojQy4aNTZtUPE2Cyp0'
const michisLimit= 4

const errorBlock = document.getElementById('error')
const michisCards = document.querySelector('.random-michis-cards')
const favoritesCards = document.querySelector('.fav-cards-container')




async function fetchData(endpoint){
    const res = await fetch(endpoint)
    return res.json()
}

async function getRandomMichis(){
    michisCards.innerHTML = ''
    try{
        const randomMichis = await 
        fetchData(`${ApiRandomEndpoint}?api_key=${ApiKey}&limit=${michisLimit}`)
        console.log(randomMichis)
        let view = `
            ${randomMichis.map(michi =>`
                <div class="michi-card">
                    <img src="${michi.url}"," alt="a cat picture">
                    <button class="fav-btn" data-id="${michi.id}">
                        Add to
                        <img src="./assets/favorite.png" alt="favoriteIcon">
                    </button>
                    <a href="" class="remove"></a>
                    <p class="desc">this is a michi!</p>
                </div>
            `).slice(0,randomMichis.lenght).join('')}
        `
        michisCards.innerHTML = view

        /// This code is selecting all the elements with class 'fav-btn' and storing them in the "favButtons" constant.
        const favBtns = document.querySelectorAll('.fav-btn')
        //// Then, using the forEach loop, it's adding a click event listener to each button.
        favBtns.forEach(btn =>{
            btn.addEventListener('click', (event) => {
                // The id of the button is extracted from the "data-id" attribute
                const id = event.target.dataset.id
                // Finally, the "saveFavoriteMichis" function is called with the "id" parameter.
                saveFavoriteMichis(id)
                getFavoriteMichis()
            })
        })

    }catch(err){
        errorBlock.innerHTML = (`Ha ocurrido el siguiente error: ${err}`)
    }
}

async function getFavoriteMichis(){
    favoritesCards.innerHTML = ''
    try{
        const favorites = await fetchData(`${APiFavEndpoint}?api_key=${ApiKey}`)
        console.log(favorites)
        const view = `
            ${favorites.map(michi => `
                <div class="michi-card">
                    <img src="${michi.image.url}"," alt="a cat picture">
                    <button class="remove-btn" data-id="${michi.id}">
                        X
                    </button>
                    <a href="" class="remove"></a>
                    <p class="desc">this is a michi!</p>
                </div>
            `).slice(0,favorites.lenght).join('')}
        `
        favoritesCards.innerHTML = view
        const favBtns = document.querySelectorAll('.remove-btn')
        favBtns.forEach(btn =>{
            btn.addEventListener('click', (event) =>{
                const id = event.target.dataset.id
                deleteFavorite(id)
            })
        })
    }catch(err){
        errorBlock.innerHTML = (`Ha ocurrido el siguiente error: ${err}`)
    }
}

async function saveFavoriteMichis(id){
    try{
        const res = await fetch(APiFavEndpoint,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ApiKey
            },
            body: JSON.stringify({
                image_id: id
            })
        })
        const data = await res.json()
        console.log('El michi se ha guardado en tus favoritos')
        console.log(data)
        getFavoriteMichis()
    }catch(err){
        errorBlock.innerHTML = (`Ha ocurrido el siguiente error: ${err}`)
    }
}

async function deleteFavorite(id){
    try{
        const res = await fetch(`${APiFavEndpoint}/${id}`,{
            method:'DELETE',
            headers:{
                'content-type':'application/json',
                'x-api-key': ApiKey
            }
        })
        console.log('Michi eliminado de favoritos!!')
        getFavoriteMichis()
    }catch(err){
        errorBlock.innerHTML = (`Ha ocurrido el siguiente error: ${err}`)
    }
}
getRandomMichis()
getFavoriteMichis()