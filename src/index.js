document.addEventListener('DOMContentLoaded', () => {
// *******************************Vars **************************
 let allQuotes = []
 const quotesCont = document.querySelector('.quotes-container')
 const quotesForm = document.querySelector('#new-quote-form')


 let renderAllNotes = (quotesArray) => {
     return quotesArray.map((quotes) => {
       return `
       <li class='quote-card'>
    <blockquote class="blockquote">
      <p class="mb-0">${quotes.quote}</p>
      <footer class="blockquote-footer">${quotes.author}</footer>
      <br>
      <button class='btn-success' data-id="${quotes.id}"  data-action= "like" >Likes: ${quotes.likes} </button>
      <button class='btn-danger' data-id="${quotes.id}" data-action= "delete">Delete</button>
    </blockquote>
  </li>
       `
     }).join(' ')
 }

 fetch('http://localhost:3000/quotes')
    .then((responseObject) => responseObject.json())
    .then((json) => {
      allQuotes = json
      quotesCont.innerHTML = renderAllNotes(allQuotes)

    })


// *************************EVENTLISTENERS******HELPERS **************************

quotesForm.addEventListener('submit', (event) => {
      event.preventDefault();
console.log(event);
      const quoteInput = document.querySelector('#new-quote')
      const authorInput = document.querySelector('#author')

const postQuote = (event) => {
      fetch('http://localhost:3000/quotes',
      {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          "quote": quoteInput.value,
          "likes": 0,
          "author": authorInput.value
         })
        })
        .then((response) => {
            return response = response.json()
          })
          .then((json) => {
          allQuotes.push(json)
          quotesForm.innerHTML += `
          <li class='quote-card'>
       <blockquote class="blockquote">
         <p class="mb-0">${json.quote}</p>
         <footer class="blockquote-footer">${json.author}</footer>
         <br>
         <button class='btn-success' data-id="${json.id}" data-action= "like" >Likes: ${json.likes} </button>
         <button class='btn-danger' data-id="${json.id}" data-action= "delete">Delete</button>
       </blockquote>
     </li>
          `
        })
      }
      postQuote();

}) //End Submit Listener

quotesCont.addEventListener('click', (event) => {

 const quoteId = parseInt(event.target.dataset.id)

 if (event.target.dataset.action === "like") {
   let clickedQuote = allQuotes.filter((quote) => (quote.id === quoteId))
      console.log(clickedQuote);
    let likedQuote = ++clickedQuote[0].likes
    let likesButton = event.target.parentNode.querySelector('.btn-success').innerText.split(" ")[1]
     parseInt(likesButton);

     fetch(`http://localhost:3000/quotes/${quoteId}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "likes": likedQuote
      })
    })
 } else if (event.target.dataset.action === "delete") {
   const quoteCard = document.querySelector('.quote-card')
   const deleteBtn = document.querySelector('.btn-danger')

   fetch(`http://localhost:3000/quotes/${quoteId}`,
      {
        method: 'DELETE'
      })
    .then(response => {
      if (response.ok) {
        allQuotes = allQuotes.filter(quote => quote.id != quoteId) //removes from global pokemonArray
        quotesCont.removeChild(quoteCard); //removes from DOM
        debugger;
      }
    })


 }


})



}) ///end DOM Listener
