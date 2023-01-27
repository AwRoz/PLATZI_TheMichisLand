const ApiRandomEndpoint = 'https://api.thecatapi.com/v1/images/search'
const APiFavEndpoint = 'https://api.thecatapi.com/v1/favourites'
const ApiKey = 'live_TDVyIWPpiZsKxPbuVhqeMvmY0lrxo44jTBGlVLOf10qbgOojQy4aNTZtUPE2Cyp0'
const michisLimit= 4

async function fetchData(endpoint){
    const res = await fetch(endpoint)
    return res.json()
}

async function getRandomMichis(){
    try{
        const randomMichis = await 
        fetchData(`${ApiRandomEndpoint}?api_key=${ApiKey}&limit=${michisLimit}`)
        console.log(randomMichis)
    }catch(err){
        console.log(`Hubo un error: ${err}, ${err.message}`)
    }
}

async function getFavoriteMichis(){
    try{
        const favorites = await fetchData(`${APiFavEndpoint}?api_key=${ApiKey}`)
        console.log(favorites)
    }catch(err){
        console.log(err)
    }
}