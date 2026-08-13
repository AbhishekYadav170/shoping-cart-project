
const products = [
    { id: 1, name: "Heirloom Tomatoes", category: "produce", price: 3.49, emoji: "🍅" },
    { id: 2, name: "Baby Spinach Bunch", category: "produce", price: 2.19, emoji: "🥬" },
    { id: 3, name: "Valencia Oranges (6)", category: "produce", price: 4.99, emoji: "🍊" },
    { id: 4, name: "Stone-Ground Flour", category: "pantry", price: 5.75, emoji: "🌾" },
    { id: 5, name: "Cold-Pressed Olive Oil", category: "pantry", price: 11.20, emoji: "🫒" },
    { id: 6, name: "Wildflower Honey Jar", category: "pantry", price: 7.40, emoji: "🍯" },
    { id: 7, name: "Linen Tea Towels (3)", category: "home", price: 14.00, emoji: "🧺" },
    { id: 8, name: "Beeswax Candle", category: "home", price: 9.60, emoji: "🕯️" },
    { id: 9, name: "Hand Cream", category: "wellness", price: 8.50, emoji: "🧴" },
    { id: 10, name: "Herbal Soap", category: "wellness", price: 6.25, emoji: "🧼" },
    { id: 11, name: "Fresh Apples", category: "produce", price: 4.25, emoji: "🍎" },
    { id: 12, name: "Organic Rice", category: "pantry", price: 8.90, emoji: "🍚" }
];


// HTML elements
const productContainer = document.getElementById("product-container");
const cartContainer = document.getElementById("cart-container");
const cartButton = document.getElementById("cart-button");
const cartDrawer = document.getElementById("cart-drawer");
const cartOverlay = document.getElementById("cart-overlay");
const closeCart = document.getElementById("close-cart");

const cartCount = document.getElementById("cart-count");
const subtotalElement = document.getElementById("subtotal");
const taxElement = document.getElementById("tax");
const cartTotal = document.getElementById("cart-total");
const orderButton = document.getElementById("order-btn");


// Order elements
const orderOverlay = document.getElementById("order-overlay");
const closeOrder = document.getElementById("close-order");
const orderForm = document.getElementById("order-form");
const orderTotal = document.getElementById("order-total");
const confirmTotal = document.getElementById("confirm-total");

const successOverlay = document.getElementById("success-overlay");
const closeSuccess = document.getElementById("close-success");
const successName = document.getElementById("success-name");
const successAddress = document.getElementById("success-address");
const orderNumber = document.getElementById("order-number");


let cart = [];


// Display products
function displayProducts(category = "all") {

    productContainer.innerHTML = "";

    const filteredProducts = category === "all"
        ? products
        : products.filter(function(product) {
            return product.category === category;
        });

    filteredProducts.forEach(function(product) {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">${product.emoji}</div>

            <span class="product-category">
                ${product.category}
            </span>

            <h3>${product.name}</h3>

            <div class="product-price">
                $${product.price.toFixed(2)}
            </div>

            <button class="add-cart"
                onclick="addToCart(${product.id})">
                Add to cart
            </button>
        `;

        productContainer.appendChild(card);
    });
}


// Add to cart
function addToCart(productId) {

    const product = products.find(function(item) {
        return item.id === productId;
    });

    const existingProduct = cart.find(function(item) {
        return item.id === productId;
    });

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
}


// Update cart
function updateCart() {

    cartContainer.innerHTML = "";

    let subtotal = 0;
    let totalItems = 0;

    if (cart.length === 0) {

        cartContainer.innerHTML =
            `<p class="empty-cart">Your basket is empty.</p>`;

        cartCount.textContent = "0";
        subtotalElement.textContent = "0.00";
        taxElement.textContent = "0.00";
        cartTotal.textContent = "0.00";

        return;
    }

    cart.forEach(function(item) {

        const itemTotal = item.price * item.quantity;

        subtotal += itemTotal;
        totalItems += item.quantity;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <div class="cart-item-top">

                <div class="cart-item-info">

                    <div class="cart-item-category">
                        ${item.category}
                    </div>

                    <div class="cart-item-name">
                        ${item.name}
                    </div>

                    <div class="quantity-controls">

                        <button onclick="decreaseQuantity(${item.id})">
                            −
                        </button>

                        <span>${item.quantity}</span>

                        <button onclick="increaseQuantity(${item.id})">
                            +
                        </button>

                    </div>

                    <button class="remove-item"
                        onclick="removeFromCart(${item.id})">
                        Remove
                    </button>

                </div>

                <div class="cart-item-price">
                    $${itemTotal.toFixed(2)}
                </div>

            </div>
        `;

        cartContainer.appendChild(cartItem);
    });

    const tax = subtotal * 0.06;
    const total = subtotal + tax;

    cartCount.textContent = totalItems;
    subtotalElement.textContent = subtotal.toFixed(2);
    taxElement.textContent = tax.toFixed(2);
    cartTotal.textContent = total.toFixed(2);
}


// Increase quantity
function increaseQuantity(productId) {

    const item = cart.find(function(product) {
        return product.id === productId;
    });

    if (item) {
        item.quantity++;
    }

    updateCart();
}


// Decrease quantity
function decreaseQuantity(productId) {

    const item = cart.find(function(product) {
        return product.id === productId;
    });

    if (!item) return;

    if (item.quantity > 1) {
        item.quantity--;
    } else {
        removeFromCart(productId);
        return;
    }

    updateCart();
}


// Remove item
function removeFromCart(productId) {

    cart = cart.filter(function(item) {
        return item.id !== productId;
    });

    updateCart();
}


// Cart open / close
function openCart() {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("show");
}

function closeCartDrawer() {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("show");
}

cartButton.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartDrawer);
cartOverlay.addEventListener("click", closeCartDrawer);


// Category buttons
const categoryButtons = document.querySelectorAll(".category-btn");

categoryButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const category = button.dataset.category;

        displayProducts(category);

        categoryButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");
    });
});


// Navbar links
const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(function(link) {

    link.addEventListener("click", function() {

        const category = link.dataset.category;

        displayProducts(category);

        navLinks.forEach(function(item) {
            item.classList.remove("active");
        });

        link.classList.add("active");
    });
});


// Open order form
orderButton.addEventListener("click", function() {

    if (cart.length === 0) {
        alert("Your basket is empty.");
        return;
    }

    orderTotal.textContent = cartTotal.textContent;
    confirmTotal.textContent = cartTotal.textContent;

    orderOverlay.classList.add("show");

    closeCartDrawer();
});


// Confirm order
orderForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("customer-name").value.trim();
    const address = document.getElementById("delivery-address").value.trim();

    const id = "STL-" + Math.floor(100000 + Math.random() * 900000);

    successName.textContent = name;
    successAddress.textContent = address;
    orderNumber.textContent = id;

    orderOverlay.classList.remove("show");
    successOverlay.classList.add("show");

    cart = [];
    updateCart();

    orderForm.reset();
});


// Close order form
closeOrder.addEventListener("click", function() {
    orderOverlay.classList.remove("show");
});


// Close success message
closeSuccess.addEventListener("click", function() {
    successOverlay.classList.remove("show");
});


// Show products when page loads
displayProducts();