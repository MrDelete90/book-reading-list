let books = JSON.parse(localStorage.getItem("books")) || [];
let currentFilter = "all";

const form = document.getElementById("bookForm");
const titleInput = document.getElementById("titleInput");
const authorInput = document.getElementById("authorInput");
const bookList = document.getElementById("bookList");
const counter = document.getElementById("counter");
const emptyMessage = document.getElementById("emptyMessage");
const filterButtons = document.querySelectorAll(".filter-btn");

function saveBooks() {
  localStorage.setItem("books", JSON.stringify(books));
}

function renderBooks() {
  bookList.innerHTML = "";

  const visibleBooks = books.filter(function (book) {
    if (currentFilter === "read") return book.read;
    if (currentFilter === "unread") return !book.read;
    return true;
  });

  visibleBooks.forEach(function (book) {
    const li = document.createElement("li");
    if (book.read) {
      li.classList.add("read");
    }

    const info = document.createElement("div");
    info.classList.add("book-info");

    const title = document.createElement("strong");
    title.textContent = book.title;

    const author = document.createElement("span");
    author.textContent = "by " + book.author;

    info.appendChild(title);
    info.appendChild(author);

    const actions = document.createElement("div");
    actions.classList.add("actions");

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = book.read ? "Mark Unread" : "Mark Read";
    toggleBtn.addEventListener("click", function () {
      toggleRead(book.id);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", function () {
      deleteBook(book.id);
    });

    actions.appendChild(toggleBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(info);
    li.appendChild(actions);
    bookList.appendChild(li);
  });

  const readCount = books.filter(function (b) { return b.read; }).length;
  counter.textContent = "Total: " + books.length + " | Read: " + readCount + " | Unread: " + (books.length - readCount);
  emptyMessage.hidden = visibleBooks.length > 0;
}

function addBook(title, author) {
  books.push({
    id: Date.now(),
    title: title,
    author: author,
    read: false
  });
  saveBooks();
  renderBooks();
}

function toggleRead(id) {
  books = books.map(function (book) {
    if (book.id === id) {
      book.read = !book.read;
    }
    return book;
  });
  saveBooks();
  renderBooks();
}

function deleteBook(id) {
  books = books.filter(function (book) {
    return book.id !== id;
  });
  saveBooks();
  renderBooks();
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  if (title === "" || author === "") {
    return;
  }
  addBook(title, author);
  form.reset();
  titleInput.focus();
});

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.dataset.filter;
    filterButtons.forEach(function (b) { b.classList.remove("active"); });
    button.classList.add("active");
    renderBooks();
  });
});

renderBooks();