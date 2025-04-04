# 🎬 Movie Finder App

This is a dynamic and interactive movie search application built using **HTML**, **CSS**, and **vanilla JavaScript**.  
The app fetches movie data from the [OMDb API](http://www.omdbapi.com/) and allows users to search, browse, and view detailed information about movies.

## 🔍 Features

- 🔎 **Search movies** by title and optional keyword
- 🧠 **Search history persistence** using `localStorage`
- ➕ **Load more results** with a "Load More" button and pagination
- ℹ️ **Detailed modal window** showing:
  - Poster
  - Title
  - Released date
  - Genre, Country
  - Director, Writer, Actors
  - Awards
- 🔄 **Loading animations**
- 📱 **Responsive layout** using Flexbox
- ✅ Fully functional using pure HTML/CSS/JS – no frameworks

## ⚙️ Technologies Used

- **HTML5** — semantic structure and form input
- **CSS3** — custom styles, responsive layout, transitions
- **JavaScript (ES6+)** — API handling, dynamic DOM rendering, OOP
- **Fetch API** — for asynchronous API requests
- **OMDb API** — for movie data

## 🚀 How to Use

1. Clone the repository:

```bash
git clone https://github.com/fxcker01/cinema.git
cd movie-search-js
Open index.html in your browser:

bash
Copy
Edit
# No server or build tools required!
🌐 Live Demo
Check the live site on GitHub Pages:
👉 https://fxcker01.github.io/movie-search-js

🧠 Architecture
MovieService class handles all API requests

DOMUtils class manages DOM rendering, event handling, and UI interaction

Search inputs are restored on page reload via localStorage

Modal windows are generated dynamically for movie details

Pagination is implemented using OMDb's page parameter

📂 File Structure
plaintext
Copy
Edit
├── index.html
├── style.css
├── script.js
├── img/
│   └── gifload.gif
├── README.md
└── LICENSE
🧪 Known Limitations
Limited results per page from OMDb API (10 per request)

No backend used – only client-side functionality

👤 Author
Created by fxcker01
Feel free to fork, use, and modify the code!

📄 License
This project is licensed under the MIT License.

