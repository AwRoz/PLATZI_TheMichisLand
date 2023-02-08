//define each of the endpoints
const ApiRandomEndpoint = 'https://api.thecatapi.com/v1/images/search'
const ApiFavEndpoint = 'https://api.thecatapi.com/v1/favourites'
const ApiUploadEndpoint = 'https://api.thecatapi.com/v1/images/upload'
//ApiKey - for future projects it should use better auth system
const ApiKey = 'live_TDVyIWPpiZsKxPbuVhqeMvmY0lrxo44jTBGlVLOf10qbgOojQy4aNTZtUPE2Cyp0'
//Adding a limit to the resoults when gettin the random images - it could be defined by the user
const michisLimit= 4

//Elements for DOM manipulation
const errorBlock = document.getElementById('error')
const michisCards = document.querySelector('.random-michis-cards')
const favoritesCards = document.querySelector('.fav-cards-container')


//main fetch function.
async function fetchData(endpoint){
    const res = await fetch(endpoint)
    return res.json()
}

async function getRandomMichis(){
    //cleaning fevorites block
    michisCards.innerHTML = ''
    try{
        const randomMichis = await 
        fetchData(`${ApiRandomEndpoint}?api_key=${ApiKey}&limit=${michisLimit}`)
        //this view iterates all items returned from the fetch operation
        let view = `
            ${randomMichis.map(michi =>`
                <div class="michi-card">
                    <img src="${michi.url}"," alt="a cat picture">
                    <button class="fav-btn" data-id="${michi.id}" type="button">
                        Add to
                        <img src="./assets/favorite.png" alt="favoriteIcon">
                    </button>
                    <p class="desc">this is a michi!</p>
                </div>
            `).slice(0,randomMichis.lenght).join('')}
        `
        //the slice and join methods are for a correct html rendering
        //then the view is inserted in the html
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
                //reload the favorites, wich will load all the favorited pictures
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
        const favorites = await fetchData(`${ApiFavEndpoint}?api_key=${ApiKey}`)
        console.log(favorites)
        const view = `
            ${favorites.map(michi => `
                <div class="michi-card">
                    <img src="${michi.image.url}"," alt="a cat picture">
                    <button class="remove-btn" data-id="${michi.id}" type="button">
                        X
                    </button>
                    <a href="" class="remove"></a>
                    <p class="desc">this is a michi!</p>
                </div>
            `).slice(0,favorites.lenght).join('')}
        `
        favoritesCards.innerHTML = view
        //now we add an event listener to all the .remove-btn in the loaded favorite pictures
        const favBtns = document.querySelectorAll('.remove-btn')
        favBtns.forEach(btn =>{
            btn.addEventListener('click', (event) =>{
                const id = event.target.dataset.id
                //this will allow to trigger the defeteFavorite function in order to delete the selected picture
                deleteFavorite(id)
            })
        })
    }catch(err){
        errorBlock.innerHTML = (`Ha ocurrido el siguiente error: ${err}`)
    }
}

async function saveFavoriteMichis(id){
    try{
        const res = await fetch(ApiFavEndpoint,{
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
        const res = await fetch(`${ApiFavEndpoint}/${id}`,{
            method:'DELETE',
            headers:{
                'content-type':'application/json',
                'x-api-key': ApiKey
            }
        })
        console.log('Michi eliminado de favoritos!!')
        //reload the favorites section
        getFavoriteMichis()
    }catch(err){
        errorBlock.innerHTML = (`Ha ocurrido el siguiente error: ${err}`)
    }
}

async function uploadMichi(file){
    //creating an instance of the prototype FormData()
    const formData = new FormData()
	//Adding parameters
    formData.append('file', file) // * REQUIRED
    formData.append('Sub_id','fafafacha123') //optional
    try{
        const res = await fetch(ApiUploadEndpoint,{
            method:'POST',
            headers:{
                'x-api-key': ApiKey
            },
            body:formData,
        })
        console.log(await res.json())
        console.log('Michi cargado exitosamente!!!')
    }catch(err){
        errorBlock.innerHTML = (`Ha ocurrido el siguiente error: ${err}`)   
    }
}

async function formEvent(){
    const fileInput = document.getElementById('file')
    const file = fileInput.files[0]
    uploadMichi(file)
}
getRandomMichis()
getFavoriteMichis()