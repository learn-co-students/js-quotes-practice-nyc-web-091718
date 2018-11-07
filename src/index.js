  let quoteArray = [];
document.addEventListener('DOMContentLoaded', () => { // DOMContentLoaded
  // Variables
  let quoteContainer = document.querySelector('.container');
  let quoteList = document.querySelector("#quote-list");
  let newForm = document.querySelector("#new-quote-form");
  let newQuote = document.getElementById("new-quote");
  let newAuthor = document.getElementById("author");
  // End variables

  // load up the quotes container
  const loadQuotes = ( () => {
    fetch('http://localhost:3000/quotes')
    .then(response => {
      return response.json();
    })
    .then(json => {
      quoteArray = json;
      const quoteHtml = quoteArray.map((quote) => {
        return `
        <li class='quote-card'>
          <blockquote class="blockquote">
          <p class="mb-0">${quote.quote}</p>
          <footer class="blockquote-footer">${quote.author}</footer>
          <br>
          <button class='btn-success'>Likes: <span>${quote.likes}</span></button>
          <button class='btn-danger'>Delete</button>
          </blockquote>
          </li>
        `
      }).join('');
      quoteList.innerHTML = quoteHtml;
    });
  })
// end loading quotes

  // Fetches & promises go here

  loadQuotes()

  newForm.addEventListener('submit', () => {
    event.preventDefault(); // Look up meaning
    newQuote.value = newQuote.value.trim();
    newAuthor.value = newAuthor.value.trim();
    let checkDupes = quoteArray.find( (element) => {
      return (element.author == newAuthor.value && element.quote == newQuote.value)
    })
    if (checkDupes==undefined){
      fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
          "Content-Type" : "application/json; charset=utf-8"
        },
        body: JSON.stringify({
          quote: newQuote.value,
          likes: 0,
          author: newAuthor.value
        })
      })
      .then(response => {
        return response.json();
      })
      .then(json => {
        quoteArray.push(json);
        quoteList.innerHTML += `
        <li class='quote-card'>
          <blockquote class="blockquote">
          <p class="mb-0">${newQuote.value}</p>
          <footer class="blockquote-footer">${newAuthor.value}</footer>
          <br>
          <button class='btn-success'>Likes: <span>0</span></button>
          <button class='btn-danger'>Delete</button>
          </blockquote>
        </li>
        `
      })
      .then(response => loadQuotes() );
    } else if (newQuote.value == "" || newAuthor.value== "") {
      alert("Enter some info u dingus")
      loadQuotes();
    } else {
      alert("Idiot, don't enter info that exists already")
      loadQuotes();
    }
  })

  quoteList.addEventListener('click', () => {
    name = event.target.parentElement.querySelector('.blockquote-footer').innerText;
    quote = event.target.parentElement.querySelector('.mb-0').innerText;
    let id = quoteArray.find( (element) => {
      return (element.author == name && element.quote == quote)
    }).id
    let num = quoteArray.find( (element) => {
      return (element.author == name && element.quote == quote);
    }).likes
    let index = quoteArray.findIndex((q) => q.id == id);

    if (event.target.className == "btn-success"){
      num++;
      fetch(`http://localhost:3000/quotes/${id}`, {
        method: 'PATCH',
        headers:{
          "Content-Type" : "application/json; charset=utf-8"
        },
        body: JSON.stringify({
          likes: num
        })
      })
      .then(response => response.json())
      .then(response => {
        quoteArray[index] = response;
        loadQuotes()
      });
    } else if (event.target.className == "btn-danger") { // else if start
      event.target.parentNode.remove(event.target.parentNode)
      fetch(`http://localhost:3000/quotes/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-type" : "application/json; charset=utf-8"
          }
        })
        .then(response => {
          return response.json();
        })
        .then(quoteJson => {
          loadQuotes();
        })
    } // end else if
  })

}) // End DOMContentLoaded
