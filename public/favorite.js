const userId = "687f50791bf63e1f59b20353"; // Same userId
fetch(`/api/favorites/${userId}`)
  .then(res => res.json())
  .then(favorites => {
    const container = document.getElementById("favorites-list");
    container.innerHTML = favorites.map(p => `
      <div class="product-card">
        <img src="${p.image}" />
        <p>${p.name}</p>
        <p>${p.brand}</p>
        <p>₹${p.price}</p>
        <a href="${p.link}" target="_blank">Buy Now</a>
      </div>
    `).join("");
  });

//   const mongoose = require('mongoose');

// const favoriteSchema = new mongoose.Schema({
//   name: String,
//   category: String,
//   price: Number,
//   imageUrl: String,
// });

// module.exports = mongoose.model('Favorite', favoriteSchema);
  
  const favList = document.getElementById("favoritesList");
  const emptyMsg = document.getElementById("emptyMsg");
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  function renderFavorites() {
    favList.innerHTML = "";

    if (favorites.length === 0) {
      emptyMsg.style.display = "block";
      return;
    }

    emptyMsg.style.display = "none";

    favorites.forEach((product, index) => {
      const card = document.createElement("div");
      card.classList.add("fav-card");
      card.innerHTML = `
        <img src="${product.img}" alt="${product.name}">
        <div class="info">
          <h3>${product.name}</h3>
          <p>Price: ${product.price}</p>
          <button onclick="removeFromFavorites(${index})" style="
            margin-top: 10px;
            padding: 5px 10px;
            background-color: crimson;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;">Remove</button>
        </div>
      `;
      favList.appendChild(card);
    });
  }

  function removeFromFavorites(index) {
    favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
  }

  renderFavorites();

// document.addEventListener("DOMContentLoaded", () => {
//   const userId = "687f50791bf63e1f59b20353";
//   const container = document.getElementById("favorites-list");

//   fetch(`/api/favorites/${userId}`)
//     .then(res => res.json())
//     .then(favorites => {
//       if (favorites.length === 0) {
//         container.innerHTML = "<p>No favorites found.</p>";
//         return;
//       }

//       container.innerHTML = favorites.map(p => `
//         <div class="fav-card">
//           <img src="${p.image}" alt="${p.name}">
//           <div class="info">
//             <h3>${p.name}</h3>
//             <p>Brand: ${p.brand}</p>
//             <p>Price: ₹${p.price}</p>
//             <a href="${p.link}" target="_blank">Buy Now</a>
//           </div>
//         </div>
//       `).join("");
//     })
//     .catch(error => {
//       console.error("Error loading favorites:", error);
//       container.innerHTML = "<p>Failed to load favorites.</p>";
//     });
// });

// function removeFavorite(id) {
//   fetch(`/api/favorites/${id}`, {
//     method: "DELETE"
//   })
//   .then(() => {
//     location.reload();
//   });
// }

// const userId = "YOUR_USER_OBJECT_ID_HERE"; // Replace with real MongoDB user _id

// function loadFavorites() {
//   fetch(`/api/favorites/${userId}`)
//     .then(res => res.json())
//     .then(favorites => {
//       const favList = document.getElementById("favoritesList");
//       const emptyMsg = document.getElementById("emptyMsg");

//       favList.innerHTML = "";

//       if (favorites.length === 0) {
//         emptyMsg.style.display = "block";
//         return;
//       }

//       emptyMsg.style.display = "none";

//       favorites.forEach((product, index) => {
//         const card = document.createElement("div");
//         card.classList.add("fav-card");
//         card.innerHTML = `
//           <img src="${product.image}" alt="${product.name}">
//           <div class="info">
//             <h3>${product.name}</h3>
//             <p>Brand: ${product.brand}</p>
//             <p>Price: ₹${product.price}</p>
//             <a href="${product.link}" target="_blank">Buy Now</a>
//           </div>
//         `;
//         favList.appendChild(card);
//       });
//     });
// }

// // Call it when page loads
// loadFavorites();