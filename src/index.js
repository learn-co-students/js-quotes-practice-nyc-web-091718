// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
document.addEventListener('DOMContentLoaded', ()=>{
  const quoteUl = document.getElementById('quote-list');
  const formDiv = document.getElementById('form-div');
  const newQuoteForm = document.getElementById('new-quote-form');
  let editQuoteForm = document.getElementById('edit-quote-form');
  let quotesArray = [];

// on load fetch
  fetch('http://localhost:3000/quotes')
    .then(resp => resp.json())
    .then(quotesJSON =>{
      quotesArray = quotesJSON;
      quoteUl.innerHTML = renderAllQuotes(quotesArray);
    })

// event listener
newQuoteForm.addEventListener('submit', (event)=>{
  event.preventDefault();
  const newQuote = event.target.querySelector('#new-quote').value;
  const newQAuthor = event.target.querySelector('#author').value;
  let newQLikes = 0;

  // send fetch post request to server
  fetch('http://localhost:3000/quotes', {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      quote: newQuote,
      likes: newQLikes,
      author: newQAuthor
    })
  })
    .then(resp=>resp.json())
    .then(quoteJSON =>{
      quotesArray.push(quoteJSON);
      quoteUl.innerHTML = renderAllQuotes(quotesArray);
      newQuoteForm.reset();
    })

}) //end newQuoteForm event listener



quoteUl.addEventListener('click', (event)=>{
  const qCard = event.target.parentElement.parentElement;
  if (event.target.className === 'btn-danger') {
    const targetQuote = quotesArray.find((q)=> q.id == qCard.id)

    fetch(`http://localhost:3000/quotes/${targetQuote.id}`, {
      method: 'DELETE'
    })
    .then(resp => {
      // 'ok' is a key of the Response object that's a boolean value - if it's a successful response then it'll be true
      if (resp.ok) {
        quotesArray = quotesArray.filter((q) => q.id != parseInt(qCard.id));
        quoteUl.innerHTML = renderAllQuotes(quotesArray);
      }
    })
  } //end delete button if stmt ('btn-danger')

  if (event.target.className === 'btn-success') {
    const targetQIndex = quotesArray.findIndex((q)=> q.id == qCard.id);
    const targetQuote = quotesArray[targetQIndex];
    let upLike = targetQuote.likes;
    upLike++;
    fetch(`http://localhost:3000/quotes/${targetQuote.id}`, {
      method: 'PATCH',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        quote: targetQuote.quote,
        likes: upLike,
        author: targetQuote.author
      })
    })
      .then(resp => resp.json())
      .then(updatedQuote =>{
        quotesArray[targetQIndex] = updatedQuote;
        qCard.querySelector('.btn-success').innerText = `Likes: ${updatedQuote.likes}`;
      })
  } //end like button if stmt ('btn-success')

  if (event.target.className === 'btn-edit') {
    const targetQIndex = quotesArray.findIndex((q)=> q.id == qCard.id);
    const targetQuote = quotesArray[targetQIndex];
    let qQuote = targetQuote.quote;
    let qAuthor = targetQuote.author;

    if (document.querySelector('#edit-quote-form') != null) {
      editQuoteForm = document.getElementById('edit-quote-form');
      editQuoteForm.innerHTML = renderEditForm(targetQuote.id, qQuote, qAuthor);
    } else {
      // insertAdjacentHTML allows you to insert string templates into the HTML so the 'beforebegin' is like prepending before the node it's called on.
      newQuoteForm.insertAdjacentHTML('beforebegin', renderEditForm(targetQuote.id, qQuote, qAuthor));
      editQuoteForm = document.getElementById('edit-quote-form');
      editQuoteForm.addEventListener('submit', editFormSubmitHandler);
    }
  } //end edit button if stmt ('btn-edit')
}) //end quoteUl event listener

// helper functions
  function renderAllQuotes(array) {
    return array.map((quote)=>{
      return `
      <li id='${quote.id}' class='quote-card'>
        <blockquote class="blockquote">
          <p class="mb-0">${quote.quote}</p>
          <footer class="blockquote-footer">${quote.author}</footer>
          <br>
          <button class='btn-success'>Likes: <span>${quote.likes}</span></button>
          <button class='btn-danger'>Delete</button>
          <button class='btn-edit'>Edit</button>
        </blockquote>
      </li>
      `
    }).join('')
  } //end renderAllQuotes helper function

  function renderEditForm(qId, qQuote, qAuthor) {
    return `
    <form id="edit-quote-form" data-qId='${qId}'>
      <div class="form-group">
        <label for="edit-quote">Edit Quote</label>
        <input type="text" class="form-control" id="edit-quote" value="${qQuote}">
      </div>
      <div class="form-group">
        <label for="Author">Author</label>
        <input type="text" class="form-control" id="edit-author" value='${qAuthor}'>
      </div>
      <button type="submit" class="btn btn-primary">Edit</button>
    </form>
    `
  } // end renderEditForm helper function

  function editFormSubmitHandler(event) {
    event.preventDefault();
    let qId = event.target.dataset.qid;
    let targetQIndex = quotesArray.findIndex((q)=> q.id == qId);
    let targetQuote = quotesArray[targetQIndex];
    let updatedQ = event.target.querySelector('#edit-quote').value;
    let updatedA = event.target.querySelector('#edit-author').value;

    fetch(`http://localhost:3000/quotes/${targetQuote.id}`, {
      method: 'PATCH',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        quote: updatedQ,
        likes: targetQuote.likes,
        author: updatedA
      })
    })
      .then(resp => resp.json())
      .then(updatedQuote =>{
        quotesArray[targetQIndex] = updatedQuote;
        debugger
        quoteUl.innerHTML = renderAllQuotes(quotesArray);
      })
  }

}) //end DOMContentLoaded event listener
