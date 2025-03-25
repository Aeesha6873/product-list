const cartContentEl = document.querySelector(".cart-content");
const cartIncrementEl = document.querySelector(".cart-increment");
const svgEl = document.querySelector(".svg");
const cartPEl = document.querySelector(".cart-p");
const addToCartEl = document.querySelectorAll(".add-to-cart");

// Object to store cart items
const cartItems = {};

// Function to handle click event on Add to Cart
function clickHandler(event) {
  const item = event.target.closest(".item");
  const itemName = item.querySelector("h3").textContent;
  const priceNumber = Number(
    item.querySelector(".amount").textContent.replace("$", "").trim()
  );

  svgEl.textContent = "";
  svgEl.style.display = "none";

  // Clear the order total area when adding a new item
  cartPEl.innerHTML = "";

  // If item already exists in the cart
  if (cartItems[itemName]) {
    cartItems[itemName].quantity++;
    const cartItemEl = cartItems[itemName].element;
    cartItemEl.querySelector(
      ".quantity"
    ).textContent = `x${cartItems[itemName].quantity}`;
    cartItemEl.querySelector(".total-price").textContent = `$${(
      cartItems[itemName].quantity * priceNumber
    ).toFixed(2)}`;
  } else {
    // Else, add the item to the cart
    const cartItemHTML = `
            <div class="cart-item">
                <p class="item-name">${itemName}</p>
                <div class="item-details">
                    <p class="quantity">x1</p>
                    <p class="fixed-price">@$${priceNumber.toFixed(2)}</p>
                    <p class="total-price">$${priceNumber.toFixed(2)}</p>
                    <button class="delete-item"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg></button>
                </div>
            </div>
        `;

    // Insert new item at the top
    cartContentEl.insertAdjacentHTML("afterbegin", cartItemHTML);

    // Get the newly added item
    const cartItemEl = cartContentEl.firstElementChild;

    cartItems[itemName] = {
      element: cartItemEl,
      quantity: 1,
      price: priceNumber,
    };

    // Delete item button
    cartItemEl
      .querySelector(".delete-item")
      .addEventListener("click", function () {
        cartItemEl.remove();
        delete cartItems[itemName];
        updateCartUI();
      });
  }

  updateCartUI();
}

// Add click event listener for each Add to Cart button
addToCartEl.forEach((button) => {
  button.addEventListener("click", clickHandler);
});

// Update cart count and total price
function updateCartUI() {
  let totalItems = 0;
  let totalPrice = 0;

  for (let key in cartItems) {
    let item = cartItems[key];
    totalItems += item.quantity;
    totalPrice += item.quantity * item.price;
  }

  cartIncrementEl.textContent = `Your Cart (${totalItems})`;

  // Update the cart with the total price and confirm button
  cartPEl.innerHTML = `
        <p><strong>Total: </strong>$${totalPrice.toFixed(2)}</p>
        <button class="confirm-order">Confirm Order</button>
    `;

  // Confirm order button click
  document
    .querySelector(".confirm-order")
    .addEventListener("click", function () {
      const receiptContainer = document.createElement("div");
      receiptContainer.classList.add("receipt-container");

      let receiptHTML = `
            <div class="confirmation-modal">
                <span class="checkmark"><svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 32.121L13.5 24.6195L15.6195 22.5L21 27.879L32.3775 16.5L34.5 18.6225L21 32.121Z" fill="#1EA575"/>
                    <path d="M24 3C19.8466 3 15.7865 4.23163 12.333 6.53914C8.8796 8.84665 6.18798 12.1264 4.59854 15.9636C3.0091 19.8009 2.59323 24.0233 3.40352 28.0969C4.21381 32.1705 6.21386 35.9123 9.15077 38.8492C12.0877 41.7861 15.8295 43.7862 19.9031 44.5965C23.9767 45.4068 28.1991 44.9909 32.0364 43.4015C35.8736 41.812 39.1534 39.1204 41.4609 35.667C43.7684 32.2135 45 28.1534 45 24C45 18.4305 42.7875 13.089 38.8493 9.15076C34.911 5.21249 29.5696 3 24 3ZM24 42C20.4399 42 16.9598 40.9443 13.9997 38.9665C11.0397 36.9886 8.73256 34.1774 7.37018 30.8883C6.0078 27.5992 5.65134 23.98 6.34587 20.4884C7.04041 16.9967 8.75474 13.7894 11.2721 11.2721C13.7894 8.75473 16.9967 7.0404 20.4884 6.34587C23.98 5.65133 27.5992 6.00779 30.8883 7.37017C34.1774 8.73255 36.9886 11.0397 38.9665 13.9997C40.9443 16.9598 42 20.4399 42 24C42 28.7739 40.1036 33.3523 36.7279 36.7279C33.3523 40.1036 28.7739 42 24 42Z" fill="#1EA575"/>
                    </svg>
                </span>
                <h2>Order Confirmed</h2>
                <p>We hope you enjoy your food!</p>
                <div class="order-details">
        `;

      for (let key in cartItems) {
        let item = cartItems[key];
        receiptHTML += `
                <div class="order-item">
                    <p class="item-name">${key}</p>
                    <p>${item.quantity} x @$${item.price.toFixed(
          2
        )} <span class="total-price">$${(item.quantity * item.price).toFixed(
          2
        )}</span></p>
                    <hr>
                </div>
            `;
      }

      receiptHTML += `
                <div>
                <p class="finaal-total">Order Total:<span>$${totalPrice.toFixed(
                  2
                )}</span></p>
                <button class="start-new-order">Start New Order</button>
            </div>
        `;

      receiptContainer.innerHTML = receiptHTML;
      document.body.appendChild(receiptContainer);

      document
        .querySelector(".start-new-order")
        .addEventListener("click", function () {
          location.reload();
        });
    });
}
