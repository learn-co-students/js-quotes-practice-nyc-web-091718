// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
const quotesUl = document.querySelector("#quote-list")
const newQuoteForm = document.querySelector("#new-quote-form")
const sortButton = document.querySelector("#sort")
let quotes
let alphaSort = 1;
(function getQuotes() {
  fetch(`http://localhost:3000/quotes`)
    .then(resp => resp.json())
    .then(quoteObj => {
      quotes = quoteObj
      quotes.forEach ( quote => addQuoteToDOM(quote))
    })
})()
newQuoteForm.addEventListener("submit", createQuote)
sortButton.addEventListener("click", sortQuotesByAuthor)
quotesUl.addEventListener("click", event => {
  let quoteId = event.target.parentElement.parentElement.dataset.id
  let foundQuote = quotes.find(quote => quote.id == quoteId)
  let quoteDiv = Array.from(document.querySelectorAll(".quote-card")).find(quoteCard => quoteCard.dataset.id == quoteId)
  if (Array.from(event.target.classList).includes("btn-danger")) {
    event.target.parentElement.parentElement.remove()
    fetch(`http://localhost:3000/quotes/${quoteId}`,
      {method: "DELETE"})
    .then(() => {
      quotes = quotes.filter( quote => !(quote.id == quoteId))
    })
  } else if (Array.from(event.target.classList).includes("btn-success")) {
    fetch(`http://localhost:3000/quotes/${quoteId}`,
    {method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({likes: ++foundQuote.likes})
  }).then(() => {
    event.target.firstElementChild.innerText = foundQuote.likes
  })
} else if (Array.from(event.target.classList).includes("btn-edit")) {
  quoteDiv.querySelector(".hidden-edit-form").style.display=""
}
})
quotesUl.addEventListener("submit", event => {
  let quoteId = event.target.parentElement.parentElement.dataset.id
  let foundQuote = quotes.find(quote => quote.id == quoteId)
  let quoteDiv = Array.from(document.querySelectorAll(".quote-card")).find(quoteCard => quoteCard.dataset.id == quoteId)
  let newAuthor = quoteDiv.querySelector(".edited-author").value
  let newContent = quoteDiv.querySelector(".edited-content").value
  if (Array.from(event.target.classList).includes("hidden-edit-form")) {
    event.preventDefault()
    fetch(`http://localhost:3000/quotes/${quoteId}`,
    {method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({author: newAuthor, quote: newContent})})
    .then(resp => resp.json())
    .then(updatedQuote => {
      index = quotes.findIndex (quote => quote.id == quoteId)
      quotes[index].author = newAuthor
      quotes[index].quote = newContent
      quoteDiv.querySelector(".mb-0").innerText = newContent
      quoteDiv.querySelector(".blockquote-footer").innerText = newAuthor
      quoteDiv.querySelector(".hidden-edit-form").style.display = "none"
    })
  }
})
function createQuote(event) {
  event.preventDefault()
  let quoteContent = newQuoteForm.querySelector("#new-quote").value
  let quoteAuthor = newQuoteForm.querySelector("#author").value
  fetch(`http://localhost:3000/quotes`,
    {method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({quote: quoteContent, likes: 0, author: quoteAuthor})
  }).then(resp => resp.json())
  .then(newQuote => {
    quotes.push(newQuote)
    addQuoteToDOM(newQuote)
    newQuoteForm.reset()
  })
} //cloes func
function addQuoteToDOM(quote) {
  quotesUl.innerHTML += `
    <li class='quote-card' data-id="${quote.id}">
      <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <form style="display: none;" class="hidden-edit-form">
          <input type="text" class="edited-content" value="${quote.quote}"></input>
          <input type="text" class="edited-author" value="${quote.author}"></input>
          <button class="edit-submit">Submit</button>
        </form>
        <button class='btn-success'>Likes: <span>${quote.likes}</span></button>
        <button class='btn-danger'>Delete</button>
        <button class='btn-edit'>Edit</button>
      </blockquote>
    </li>
  `
}
function sortQuotesByAuthor() {
  quotes = quotes.sort( (quote1, quote2) => quote1.author.localeCompare(quote2.author)*alphaSort)
  alphaSort *= -1
  quotesUl.innerHTML = ''
  quotes.forEach ( quote => addQuoteToDOM(quote))
}
