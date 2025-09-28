import { menuArray } from "./data.js";

const MenuItems = document.querySelector("#container-1");
const orderSection = document.querySelector("#container-2");
const orderListEl = document.querySelector("#order-list");
const orderTotalEl = document.querySelector("#order-total");
const completeBtn = document.querySelector("#complete-order");
const modalPop = document.querySelector(".modal-container");
const modalPopCloseBtn = document.querySelector("modal-close");

function renderMenu(items) {
  let menuHtml = items
    .map(
      (item) => `
    <div class="foodstyle">
      <div class="food-left">
        <div class="emoji"><span>${item.emoji}</span></div>
        <div class="items-text">
          <h3>${item.name}</h3>
          <span class="ingredients"><p>${item.ingredients.join(", ")}</p></span>
          <p class="price">$${item.price}</p>
        </div>
      </div>
      <button class="add-button" data-id="${item.id}">+</button>
    </div>
  `
    )
    .join("");

  MenuItems.innerHTML = menuHtml;
}

renderMenu(menuArray);

let cart = [];

document.addEventListener("click", (e) => {
  if (e.target.className.includes("add-button")) {
    const id = Number(e.target.dataset.id);
    const item = menuArray.find((i) => i.id === id);
    if (item) {
      cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
      });
      renderOrder();
    }
  }

  if (e.target.className.includes("remove-item")) {
    const idx = Number(e.target.dataset.index);
    if (!Number.isNaN(idx)) {
      cart.splice(idx, 1);
      renderOrder();
    }
  }

  if (e.target.className.includes("complete-btn")) {
    const popupHtml = `
    
        <div class="modal">
        <button class="modal-close">×</button>
        <h2>Enter card details</h2>
        <form id="payment-form">
          <input type="text" id="name" placeholder="Enter your name" required>
          <input type="text" placeholder="Enter card number" required>
          <input type="text" placeholder="Enter CVV" required />
          <button class="pay" id="pay">Pay</button>
        </form>
    </div>
    
    `;
    modalPop.innerHTML = popupHtml;
    modalPop.style.display = "block";
  }

  if (e.target.className.includes("modal-close")) {
    modalPop.style.display = "none";
    modalPop.innerHTML = "";
  }
});

document.addEventListener("submit", (e) => {
  if (e.target.id === "payment-form") {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const name = document.getElementById("name").value;
    orderSection.innerHTML = `<p class="final-message">Thanks, ${name}! Your order is on its way!</p>`;
    modalPop.style.display = "none";
    modalPop.innerHTML = "";
  }
});

function renderOrder() {
  if (cart.length === 0) {
    orderSection.classList.add("hidden");
    orderListEl.innerHTML = "";
    orderTotalEl.textContent = "$0";
    return;
  }

  orderSection.classList.remove("hidden");

  const rows = cart
    .map((item, index) => {
      return `
     <div class="order-row">
          <div class="order-left">
            <span class="order-name">${item.name}</span>
            <button class="remove-item" data-index="${index}">remove</button>
          </div>
          <span class="order-price">$${item.price}</span>
    </div>
    `;
    })
    .join("");

  orderListEl.innerHTML = rows;

  const total = cart.reduce((sum, i) => sum + Number(i.price), 0);
  orderTotalEl.textContent = `$${total}`;
}
