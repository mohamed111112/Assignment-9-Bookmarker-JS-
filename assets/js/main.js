// Selecting elements
const siteName = document.querySelector('#bookmarkName');
const siteURL = document.querySelector('#bookmarkURL');
const submitBtn = document.querySelector('#submitBtn');
const tableContent = document.querySelector('#tableContent');
const searchInput = document.querySelector('#searchInput');

// Array to store bookmarks
let bookmarks = [];

// Regular expressions for validation
const siteNameRegex = /^([a-z]{3})[a-z]*$/i;
const siteURLRegex = /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;

// Error message object
const messagesAlert = {
    msgErrorObj: {
        icon: "error",
        title: "Oops...",
        text: "The Site Name or URL is not valid.",
        footer: `<p class="text-start fw-semibold">
        <i class="icon-angle-double-right text-danger"></i> The Site Name must contain at least 3 characters. 
        <br>
        <i class="icon-angle-double-right text-danger"></i> The Site URL must be valid.</p>`
    }
}

// Function to toggle CSS class
function toggleClass(el, className, condition) {
    condition ? el.classList.add(className) : el.classList.remove(className);
}

// Function to add item to local storage
function setLocalstorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
}

// Function to retrieve item from local storage
function getLocalstorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

// Function for input validation
function validationInput(regex, element) {
    const valid = regex.test(element.value);
    toggleClass(element, "is-valid", valid);
    toggleClass(element, "is-invalid", !valid);
    return valid;
}

// Immediately invoked function expression (IIFE) for initialization
(function () {
    let bookmarksListFounded = getLocalstorage('bookmarksList');

    if (bookmarksListFounded && bookmarksListFounded.length > 0) {
        bookmarks = bookmarksListFounded;
        Display(bookmarks);
    } else {
        document.querySelector('#tableSection').style.display = 'none';
    }
})();

// Function to clear input fields
function clearInput() {
    siteName.value = "";
    siteURL.value = "";
    toggleClass(siteName, "is-valid", false);
    toggleClass(siteURL, "is-valid", false);
}

// Function to display bookmarks in the table
function Display(bookmarksArray) {
    document.querySelector('#tableSection').style.display = 'block';
    tableContent.innerHTML = '';
    let contentTable = '';
    for (let i = 0; i < bookmarksArray.length; i++) {
        contentTable += `<tr>
      <td scope="row" class="fw-semibold">${i + 1}</td>
      <td class="fw-semibold text-capitalize">${bookmarksArray[i].siteName}</td>              
      <td><button class="btn btn-success btn-sm"  onclick="visitBookmark('${bookmarksArray[i].siteURL}')" data-index="${bookmarksArray[i].siteURL}">Visit</button></td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteBookmark(${bookmarksArray[i].index})" data-index="${bookmarksArray[i].index}">Delete</button></td>
    </tr>`;
    };
    tableContent.innerHTML = contentTable;
}

// Function to add bookmark
function addToBookmarks(bookmarkObj) {
    bookmarks.push(bookmarkObj);
    setLocalstorage('bookmarksList', bookmarks);
    Display(bookmarks);
}

// Function to delete bookmark
function deleteBookmark(index) {
    siteIndex = bookmarks.indexOf(bookmarks.find(site => site.index === index))
    bookmarks.splice(siteIndex, 1);
    setLocalstorage('bookmarksList', bookmarks);
    Display(bookmarks);
    if (bookmarks.length < 1) { document.querySelector('#tableSection').style.display = 'none'; }
}

// Function to visit bookmarked site
function visitBookmark(url) {
    window.open(url, '_blank');
}

// Function to search bookmarks
function searchBookmark(val) {
    keyword = val.toLowerCase();
    let result = bookmarks.filter(bookmark => {
        return bookmark.siteName.toLowerCase().includes(keyword);
    });
    Display(result);
}

// Event listener for form submission
submitBtn.addEventListener('click', () => {
    let nameValid = validationInput(siteNameRegex, siteName);
    let urlValid = validationInput(siteURLRegex, siteURL);
    if (nameValid && urlValid) {
        let bookmark = { index: bookmarks.length, siteName: siteName.value, siteURL: siteURL.value };
        addToBookmarks(bookmark);
        clearInput();
    } else {
        Swal.fire(messagesAlert.msgErrorObj);
    }
});

// Event listener for input in site name field
siteName.addEventListener("input", () => {
    validationInput(siteNameRegex, siteName);
});

// Event listener for input in site URL field
siteURL.addEventListener("input", () => {
    validationInput(siteURLRegex, siteURL);
});

// Event listener for input in search field
searchInput.addEventListener('input', () => {
    searchBookmark(searchInput.value);
});
