
// Clicking the delete button should delete the respective quote from the database and remove it from the page without having to refresh.

document.addEventListener("DOMContentLoaded", function(event) {
  let quotes
  const quoteContainer = document.querySelector(`#quote-list`)
  const quoteForm = document.querySelector("#new-quote-form")

  fetch('http://localhost:3000/quotes')
    .then(response => response.json())
    .then(response => {
      quotes = response
      // console.log(quotes)
      quotes.forEach ( quote => postQuoteToPage(quote) )

    })

  // LISTENERS
  quoteForm.addEventListener("submit", createQuote);
  quoteContainer.addEventListener("click", quoteClicked);


  // HELPERS
  function postQuoteToPage(quote) {
    console.log('posting a quote')
    quoteContainer.innerHTML += `
      <li class='quote-card'>
        <blockquote class="blockquote" data-id="${quote.id}">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${quote.likes}</span></button>
        <button class='btn-danger'>Delete</button>
        </blockquote>
      </li>
      `
  }


  function createQuote(event) {
    event.preventDefault()
    console.log('creating a quote')
    // debugger
    fetch('http://localhost:3000/quotes',{
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        "quote": event.target.querySelector('#new-quote').value,
        "author": event.target.querySelector('#author').value
      })
    })
    .then(response => response.json())
    .then(newQuote => {
      quotes.push(newQuote)
      postQuoteToPage(newQuote)
    })
  } //end of createQuote

  function quoteClicked(event) {
    console.log("quote clicked")
    let quoteId = event.target.parentElement.dataset.id
    let foundQuote = quotes.find((quote) => quote.id == quoteId)
    let quoteLikes = event.target.parentElement.querySelector('.btn-success')
    // debugger

    if (Array.from(event.target.classList).includes('btn-success')) {
      likeQuote(foundQuote, quoteLikes)
    } else if (Array.from(event.target.classList).includes('btn-danger')) {
      event.target.parentElement.parentElement.remove()
      deleteQuote(foundQuote)
    }
  } //end of quoteClicked

  function likeQuote(foundQuote, quoteLikes) {
    console.log("liking a quote")
    // let quoteId = event.target.parentElement.dataset.id
    // let foundQuote = quotes.find((quote) => quote.id == quoteId)
    fetch(`http://localhost:3000/quotes/${foundQuote.id}`,
      { method: 'PATCH',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          "likes": ++foundQuote.likes
        })
    }).then(quoteLikes.innerText= `Likes: ${foundQuote.likes}`)
    // debugger
  } //end of likeQuote

  function deleteQuote(foundQuote) {
    console.log("deleting a quote");

    fetch(`http://localhost:3000/quotes/${foundQuote.id}`,
      { method: 'DELETE',
        headers: {"Content-Type": "application/json"},
      }
    )
  } //end of deleteQuote



}) //end of DOM loaded
