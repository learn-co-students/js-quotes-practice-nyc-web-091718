const quoteList = document.getElementById('quote-list');
const quoteForm = document.getElementById('new-quote-form')
document.addEventListener('DOMContentLoaded',()=>{
  let allQuotes = []
  fetch('http://localhost:3000/quotes')
  .then((response)=>response.json())
  .then((json)=>{
    quoteList.innerHTML += renderQuotes(json);
    allQuotes = json;
  })

  quoteList.addEventListener('click',(event)=>{
    if (event.target.className == "btn-danger"){
      let currentID = event.target.parentElement.parentElement.dataset.id
      fetch(`http://localhost:3000/quotes/${currentID}`, {
        method: 'DELETE'
      })
      .then((response)=>{
        if (response.ok){
          allQuotes = allQuotes.filter((quote)=> quote.id != currentID)
          event.target.parentElement.parentElement.remove()
        }
      })
    }else if(event.target.className == "btn-success"){
      let currentID = event.target.parentElement.parentElement.dataset.id
      let foundQuote = allQuotes.find((quote)=> quote.id == currentID)
      foundQuote.likes++
      fetch(`http://localhost:3000/quotes/${currentID}`, {
        method: 'PATCH',
        headers: {
                    "Content-Type": "application/json; charset=utf-8",
                  },
        body: JSON.stringify({ likes: foundQuote.likes})
      })
      .then((res)=>res.json())
      .then((json)=>{
        event.target.querySelector("span").innerText = foundQuote.likes
      })
    }
  })//buttons events like/delete
quoteForm.addEventListener('submit',(event)=>{
  event.preventDefault()
  const newQuote = document.getElementById('new-quote').value
  const newAuthor = document.getElementById('author').value
  fetch('http://localhost:3000/quotes',{
    method: 'POST',
    headers: {
                "Content-Type": "application/json; charset=utf-8",
              },
    body: JSON.stringify({quote:newQuote, author:newAuthor, likes:0})
  })
  .then((res)=>res.json())
  .then((json)=>{
    allQuotes.push(json)
    quoteList.innerHTML += renderQuotes(new Array(json))
  })
})
})//dom content loaded end
function renderQuotes(quotes){
   return quotes.map((quote)=>{
    return ` <li data-id = "${quote.id}" class='quote-card'>
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span>${quote.likes}</span></button>
      <button class='btn-danger'>Delete</button>
    </blockquote>
  </li>`
}).join('')
  // quoteList.innerHTML = quoteHTMLS
}
