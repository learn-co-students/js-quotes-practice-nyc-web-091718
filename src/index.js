// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
let allQuoteData = []
let url = `http://localhost:3000/quotes`
const quoteContainer = document.getElementById('quote-list')
const newQuoteForm = document.getElementById('new-quote-form')

///HELPER METHODS///
const newQuoteStructure = (quote) => {
  return `<li class='quote-card'>
  <blockquote class="blockquote">
   <p class="mb-0" id="quote-${quote.id}" data-id=${quote.id}>${quote.quote}</p>
   <footer class="blockquote-footer" data-id=${quote.id}>${quote.author}</footer>
     <br>
   <button class='btn-success' data-id=${quote.id}>Likes: <span>${quote.likes}</span></button>
   <button class='btn-danger' data-id=${quote.id}>Delete</button>
 </blockquote>
</li>`
}
///////////

fetch(url)
.then(responseObj =>
  responseObj.json()
  // console.log(responseObj.json())
).then(parsedQuoteData => {
  allQuoteData = parsedQuoteData
  // console.log(allQuoteData)
quoteContainer.innerHTML = allQuoteData.map(newQuoteStructure
).join('')
})//end of fetch

// let submitButton = document.getElementById('submit-button')

newQuoteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  let newQuoteInput = event.target[0].value
  // console.log(newQuoteInput)
  let newQuoteAuthor = event.target[1].value
  // console.log(newQuoteAuthor)

fetch(url,
  {
    method: 'POST',
    headers: {
        "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
    "quote": newQuoteInput,
    "author": newQuoteAuthor,
    "likes": 0
    })//end fetch request
  }).then(responseObj =>
    responseObj.json()
  ).then(newQuoteParsedData => {
    allQuoteData.push(newQuoteParsedData)
    let newQuote = newQuoteStructure(newQuoteParsedData)
    quoteContainer.innerHTML += newQuote
  })
})//end new form event listener


// let deleteContainer = document.querySelector('#quote-list')

quoteContainer.addEventListener('click', (event) => {

  if (event.target.className === 'btn-danger') {
  // console.log(event.target.className)
let deleteId = event.target.dataset.id

  fetch(url + `/${deleteId}`,
  {
    method: 'DELETE',
    headers: {
        "Content-Type": "application/json; charset=utf-8",
    }
    //end fetch
}).then(() => {

    let quoteID = parseInt(deleteId)
    // console.log(quoteID)
    allQuoteData = allQuoteData.filter((quote) =>
     (quote.id !== quoteID)
    )
  quoteContainer.innerHTML = allQuoteData.map(newQuoteStructure
).join('')

    })
  } else if (event.target.className === 'btn-success'){
    let patchId = event.target.dataset.id
    const numberInClickedButton = event.target.children[0]
    const updatedLike = parseInt(numberInClickedButton.innerText) + 1
    fetch(url + `/${patchId}`,
    {
      method: 'PATCH',
      headers: {
          "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
      "likes": updatedLike
    })
  }).then(numberInClickedButton.innerText = updatedLike)

  }
}) //end event listener





//end
