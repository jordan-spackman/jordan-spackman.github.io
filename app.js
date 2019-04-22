var books = null;


var modal = document.getElementById('RegisterModal');
var registerButton = document.getElementById("register-button");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
registerButton.onclick = function() {
  modal.style.display = "block";
};
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
};
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

var loginButton = document.querySelector("#login-button");
console.log("the login button is, ", loginButton);
loginButton.onclick = function() {
  console.log("Login button pressed");
  var emailInput = document.querySelector("#email");
  var pwordInput = document.querySelector("#pword");
  var email = emailInput.value;
  var pword = pwordInput.value;
  authenticateUser(email, pword);
};

var authenticateUser = function (email, pword) {
  var data = "email=" + encodeURIComponent(email);
  data += "&pword=" + encodeURIComponent(pword);

  fetch("https://reading-list-deploy.herokuapp.com/users/sessions", {
    credentials: 'include',
    method: 'POST',
    body: data,
    headers: {
      "Content-type": "application/x-www-form-urlencoded"
    }
  }).then(function (response) {
    if (response.status == 201) {
      console.log("user authenticated");
      document.getElementById("loginhide").style.display = "none";
      document.getElementById("hide").style.display = "block";
      getBooks();
    } 
    else if (response.status == 401){
      console.log("user NOT authenticated");
      document.getElementById("failure_login").style.display = "block";
    }
    else if (response.status == 404){
      console.log("user doesn't exist, retry or make a new account");
      document.getElementById("failure").style.display = "block";
    }
  });
};

var creataccountButton = document.querySelector("#createaccount-button");
creataccountButton.onclick = function() {
  console.log("create acount button pressed");

  var fnameInput = document.querySelector("#fname");
  var lnameInput = document.querySelector("#lname");
  var emailInput = document.querySelector("#regemail");
  var pwordInput = document.querySelector("#regpword");

  var fname = fnameInput.value;
  var lname = lnameInput.value;
  var email = emailInput.value;
  var pword = pwordInput.value;

  createUser(fname, lname, email, pword);
};

var createUser = function (fname, lname, email, pword) {
  var data = "fname=" + encodeURIComponent(fname);
  data += "&lname=" + encodeURIComponent(lname);
  data += "&email=" + encodeURIComponent(email);
  data += "&pword=" + encodeURIComponent(pword);

  fetch("https://reading-list-deploy.herokuapp.com/users", {
    credentials: 'include',
    method: 'POST',
    body: data,
    headers: {
      "Content-type": "application/x-www-form-urlencoded"
    }
  }).then(function (response) {
    if (response.status == 201) {
      console.log("user saved");
      document.getElementById("success").style.display = "block";
      document.getElementById("RegisterModal").style.display = "none";
    }
    else if (response.status == 422){
      console.log("user NOT saved");
      document.getElementById("failure_create").style.display = "block";
    }
  });
};

var createBook = function (name, author, fvnf, topic, isbn) {
  var data = "name=" + encodeURIComponent(name);
  data += "&author=" + encodeURIComponent(author);
  data += "&fvnf=" + encodeURIComponent(fvnf);
  data += "&topic=" + encodeURIComponent(topic);
  data += "&isbn=" + encodeURIComponent(isbn);

  fetch("https://reading-list-deploy.herokuapp.com/reading_list", {
    credentials: 'include',
    method: 'POST',
    body: data,
    headers: {
      "Content-type": "application/x-www-form-urlencoded"
    }
  }).then(function (response) {
    console.log("books saved.");
    getBooks();
  });
};

var deleteBook = function (id) {
  fetch("https://reading-list-deploy.herokuapp.com/reading_list/${id}", {
    credentials: 'include',
    method: 'DELETE',
    headers: {
      "Content-type": "application/x-www-form-urlencoded"
    }
  }).then(function (response) {
    console.log("book deleted");
    getBooks();
  });
};

var updateBook = function (id, name, author, fvnf, topic, isbn) {
  var data = "name=" + encodeURIComponent(name);
  data += "&author=" + encodeURIComponent(author);
  data += "&fvnf=" + encodeURIComponent(fvnf);
  data += "&topic=" + encodeURIComponent(topic);
  data += "&isbn=" + encodeURIComponent(isbn);

  fetch("https://reading-list-deploy.herokuapp.com/reading_list/${id}", {
    credentials: 'include',
    method: 'PUT',
    body: data,
    headers: {
      "Content-type": "application/x-www-form-urlencoded"
    }
  }).then(function (response) {
    console.log("Book updated");
    getBooks();
  });
};


var theButton = document.querySelector("#the-button");
console.log("the button is", theButton);
theButton.onclick = function () {
  var nameInput = document.querySelector("#name");
  var authorInput = document.querySelector("#author");
  var fvnfInput = document.querySelector("#fvnf");
  var topicInput = document.querySelector("#topic");
  var isbnInput = document.querySelector("#isbn");

  var name = nameInput.value;
  var author = authorInput.value;
  var fvnf = fvnfInput.value;
  var topic = topicInput.value;
  var isbn = isbnInput.value;


  
  createBook(name, author, fvnf, topic, isbn);
};

var getBooks = function () {
  fetch("https://reading-list-deploy.herokuapp.com/reading_list", {
    credentials: 'include'
  }).then(function (response) {
    if (response.status == 401){
      console.log("NOT LOGGED IN")
      document.getElementById("hide").style.display = "none";
      document.getElementById("loginhide").style.display = "inline";
      //Show the login/register form
      return;
    }
    if (response.status != 200){
      //SOMETHING WEIRD/UNEXPECTED, maybe show some kind of confused emoji or something
      //show a confused_div?
      document.getElementById("hide").style.display = "none";
      console.log("Something weird or unexpected happened.")
      return;
    }

    response.json().then(function (data) {
      //show the appropiriate DIV/DIVS for the data
      document.getElementById("hide").style.display = "inline";
      document.getElementById("loginhide").style.display = "none";
      document.getElementById("RegisterModal").style.display = "none";
      //save all of the data into a global variable (to use later)
      books = data;

      // data is an array of string values
      var book_list = document.querySelector("#book_list");
      book_list.innerHTML = "";

      // add the book to the book list
      data.forEach(function (book) { // for book in data
        var newItem = document.createElement("li");

        var nameDiv = document.createElement("div");
        nameDiv.innerHTML = book.name;
        nameDiv.className = "book-name";
        newItem.appendChild(nameDiv);

        var authorDiv = document.createElement("div");
        authorDiv.innerHTML = book.author;
        authorDiv.className = "book-author";
        newItem.appendChild(authorDiv);

        var fvnfDiv = document.createElement("div");
        fvnfDiv.innerHTML = book.fvnf;
        fvnfDiv.className = "book-fvnf";
        newItem.appendChild(fvnfDiv);

        var topicDiv = document.createElement("div");
        topicDiv.innerHTML = book.topic;
        topicDiv.className = "book-topic";
        newItem.appendChild(topicDiv);

        var isbnDiv = document.createElement("div");
        isbnDiv.innerHTML = book.isbn;
        isbnDiv.className = "book-isbn";
        newItem.appendChild(isbnDiv);

        var deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete";
        deleteButton.onclick = function () {
          var proceed = confirm(`Do you want to delete ${book.name}?`);
          if (proceed) {
            deleteBook(book.id);
          }
        };
        newItem.appendChild(deleteButton);

        var updateButton = document.createElement("button");
        updateButton.innerHTML = "Update";
        updateButton.onclick = function () {
          var nameInput = document.querySelector("#updatename");
          var authorInput = document.querySelector("#updateauthor");
          var fvnfInput = document.querySelector("#updatefvnf");
          var topicInput = document.querySelector("#updatetopic");
          var isbnInput = document.querySelector("#updateisbn");

          var name = nameInput.value;
          var author = authorInput.value;
          var fvnf = fvnfInput.value;
          var topic = topicInput.value;
          var isbn = isbnInput.value;

          updateBook(book.id, name, author, fvnf, topic, isbn);
          console.log("updated book ", book.id);
        };
        newItem.appendChild(updateButton);

        book_list.appendChild(newItem);
      });
    });
  });
};

// first load the reading_list when the page loads
getBooks();



