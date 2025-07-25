 function openNav() {
      document.getElementById("sideNavbar").style.width = "300px";
      document.getElementById("overlay").style.display = "block";
    }

    function closeNav() {
      document.getElementById("sideNavbar").style.width = "0";
      document.getElementById("overlay").style.display = "none";
    }

    // Open the brand filter sidebar
function openBrandFilter() {
  document.getElementById("brandSidebar").style.width = "250px";
  document.getElementById("brandOverlay").style.display = "block";
}

// Close the sidebar
function closeBrandFilter() {
  document.getElementById("brandSidebar").style.width = "0";
  document.getElementById("brandOverlay").style.display = "none";
}

// Listen to checkbox changes
document.querySelectorAll('#brandSidebar input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener('change', applyBrandFilter);
});

// Filter logic
function applyBrandFilter() {
  const selectedBrands = Array.from(document.querySelectorAll('#brandSidebar input[type="checkbox"]:checked'))
    .map(cb => cb.parentElement.textContent.trim().toLowerCase());

  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach(card => {
    const brand = card.querySelector("p strong + b")?.innerText.trim().toLowerCase();
    if (selectedBrands.length === 0 || selectedBrands.includes(brand)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Add to favourite~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

 document.addEventListener("DOMContentLoaded", () => {
  const favButtons = document.querySelectorAll(".fav");
  const favCount = document.getElementById("fav-count");

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  function updateFavCount() {
    favCount.textContent = favorites.length;
  }

  updateFavCount();

  favButtons.forEach(button => {
    button.addEventListener("click", () => {
      const productCard = button.closest(".product-card");
      const img = productCard.querySelector("img").getAttribute("src");
      const name = productCard.querySelector("p:nth-of-type(2)").innerText;
      const price = productCard.querySelector(".new-price").innerText;

      const product = { img, name, price };

      if (!favorites.some(p => p.name === product.name)) {
        favorites.push(product);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        updateFavCount();
        button.textContent = "Added ✓";
        button.disabled = true;
        alert("Added to favorites!");
      } else {
        alert("Already in favorites!");
      }
    });
  });
});

// ~~~~~~~~~~~~~~~~~~~`category wise brand filtering~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const categoryLinks = document.querySelectorAll('.category-filter');
  const allProducts = document.querySelectorAll('.product-card');
  const brandListItems = document.querySelectorAll('#brandSidebar ul li');

  categoryLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const category = this.getAttribute('data-category');

      allProducts.forEach(product => {
        const productCategory = product.getAttribute('data-category');
        if (category === 'all' || productCategory === category) {
          product.style.display = 'block';
        } else {
          product.style.display = 'none';
        }
      });

      brandListItems.forEach(item => {
        const brandCategory = item.getAttribute('data-category');
        if (category === 'all' || brandCategory === category || brandCategory === 'unisex') {
          item.style.display = 'list-item';
        } else {
          item.style.display = 'none';
        }
      });

      document.getElementById("brandSidebar").style.width = "250px";
      document.getElementById("brandOverlay").style.display = "block";
    });
   });

  function closeBrandFilter() {
    document.getElementById("brandSidebar").style.width = "0";
    document.getElementById("brandOverlay").style.display = "none";
  }

  // script.js
function addToFavorites(productName) {
  alert("Added to favorites: " + productName);

  fetch('/api/favorites', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: productName })
  })
  .then(res => res.json())
  .then(data => {
    console.log('Saved:', data);
  });
}

//const userId = "64b0c4ee..."; 

document.querySelectorAll(".fav").forEach(button => {
  button.addEventListener("click", async () => {
    const productId = button.dataset.productId;

    const response = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId }),
    });

    const result = await response.json();
    alert(result.message);
  });
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Search bar~~~~~~~~~~~~~~~~
const searchInput = document.getElementById("search-input");
const productCards = document.querySelectorAll(".product-card");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();

  productCards.forEach(card => {
    const name = card.querySelector(".product-name").textContent.toLowerCase();

    if (name.includes(query)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});




// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Buy Now~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

document.querySelectorAll('.buy-now-btn').forEach(button => {
  button.addEventListener('click', async (e) => {
    const productId = e.target.dataset.productId;
    const userId ="6883455af804ac26842e0f88"; 

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, productId })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Order placed!");
        window.location.href = 'my-orders.html';
      } else {
        alert(data.error || 'Failed to place order');
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  });
});



// ~~~~~~~~~~~~~~~~~~~~~~add to cart~~~~~~~~~~~~~~~
const userId = "6883455af804ac26842e0f88"; // replace with dynamic user if you have auth

async function addToCart(productId) {
  try {
    const res = await fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId, quantity: 1 })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Item added to cart!');
    } else {
      alert('Error: ' + data.message);
    }
  } catch (err) {
    console.error(err);
    alert('Failed to add to cart.');
  }
}