// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

document.addEventListener('DOMContentLoaded', () => {

  const quotesDiv = document.getElementById('quote-list')
  // const createNewQuoteButton = document.getElementsByClassName('btn-primary')[0]
  const newQuoteForm = document.getElementById('new-quote-form')
  const newQuoteText = document.getElementById('new-quote')
  const newQuoteAuthor = document.getElementById('author')
  let quotesData = []

  fetch('http://localhost:3000/quotes').then((object) => {
    return object.json()
  }).then((parsedJSON) => {
    quotesData = parsedJSON
    // console.log(parsedJSON)
    // debugger

    parsedJSON.forEach((quote) => {
      // debugger
      quotesDiv.innerHTML += makeQuoteCards(quote)
    })
  })

  const makeQuoteCards = (quote) => {
    return`
    <li class='quote-card' data-id='${quote.id}'>
      <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success' data-id='${quote.id}'>Likes: <span>${quote.likes}</span></button>
        <button class='btn-danger' data-id='${quote.id}'>Delete</button>
      </blockquote>
    </li>
    `
  }

  quotesDiv.addEventListener('click', (event) => {
    if (event.target.dataset.id) {
      let quoteID = event.target.dataset.id
      // console.log(event.target.className)
      // debugger
      if (event.target.className === "btn-success") {
        let quoteClicked = quotesData.filter((quote) =>
          quote.id == quoteID
        )
        // console.log(quoteClicked)
        // debugger
        let quoteLiked = parseInt(++quoteClicked[0].likes)
        // console.log(quoteLiked)

        fetch(`http://localhost:3000/quotes/${quoteID}`, {
          method: 'PATCH',
          headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            'likes': quoteLiked
          })
        })
        // console.log(event.target)
        // console.log(event.target.getElementsByTagName('span'))
        // console.log(event.target.getElementsByTagName('span').innerText)
        // debugger
        event.target.getElementsByTagName('span')[0].innerText = quoteLiked
      }
      else if (event.target.className === "btn-danger") {
        console.log(event.target.className)
        event.target.parentNode.parentNode.remove()
        console.log(quotesData)
        let removeIndex = quotesData.findIndex(el => el.id == event.target.dataset.id)
        quotesData.splice(removeIndex,1)
        // debugger
        return fetch(`http://localhost:3000/quotes/${quoteID}`, {
          method: 'DELETE'
        })
        // quotesData
      }
    }
  })

  // debugger
  newQuoteForm.addEventListener('submit', (event) => {
    event.preventDefault()
    // debugger
    console.log(event.target)
    let textValue = newQuoteText.value
    console.log(textValue)
    let authorValue = newQuoteAuthor.value
    console.log(authorValue)
    return fetch('http://localhost:3000/quotes', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        'quote': textValue,
        'likes': 0,
        'author': authorValue
      })
    }).then((object) => {
      // console.log(object)
      parsedJSON = object.json()
      return parsedJSON
    }).then((parsedJSON) => {
      quotesData.push(parsedJSON)
      // console.log(parsedJSON)
      // console.log(quotesData)
      quotesDiv.innerHTML += makeQuoteCards(parsedJSON)
    })
})












})
