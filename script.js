const menu = document.getElementById("menu");
const modalCart = document.getElementById("modal-cart");
const btnCartOpen = document.getElementById("cart-btn");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const btnCheckOut = document.getElementById("checkout-btn");
const btnCartClose = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const spanItemHour = document.getElementById("date-span");

let cart = [];

btnCartOpen.addEventListener("click", () => {
  updateCartModal();
  modalCart.style.display = "flex";
});

modalCart.addEventListener("click", (event) => {
  if (event.target === modalCart) {
    modalCart.style.display = "none";
  }
});

btnCartClose.addEventListener("click", () => {
  modalCart.style.display = "none";
});

menu.addEventListener("click", (event) => {
  let parentBtnAddCart = event.target.closest(".add-to-cart-btn");
  if (parentBtnAddCart) {
    const name = parentBtnAddCart.getAttribute("data-name");
    const price = parseFloat(parentBtnAddCart.getAttribute("data-price"));

    const existingItem = cart.find((item) => item.name === name);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    updateCartModal();
  }
});

function updateCartModal() {
  cartItemsContainer.innerHTML = "";

  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );

    cartItemElement.innerHTML = `
			<div class="flex items-center justify-between">
				<div>
					<p class="font-medium">${item.name}</p>
					<p>Qtd: ${item.quantity}</p>
					<p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
				</div>
				<div>
					<button class="remove-from-cart-btn" data-name="${item.name}">Remover</button>
				</div>
			</div>
		`;

    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCounter.innerHTML = cart.length;
}

cartItemsContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");

    const index = cart.findIndex((item) => item.name === name);

    if (index !== -1) {
      const item = cart[index];

      if (item.quantity > 1) {
        item.quantity -= 1;
        updateCartModal();
      } else {
        cart.splice(index, 1);
        updateCartModal();
      }
    }
  }
});

addressInput.addEventListener("input", (event) => {
  let inputValue = event.target.value;

  if (inputValue !== "") {
    addressWarn.classList.add("hidden");
    addressInput.classList.remove("border-red-500");
  }
});

btnCheckOut.addEventListener("click", () => {
  if (!checkRestaurantOpen()) {
    Toastify({
      text: "Restaurante se encontra fechado!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #ef4444, #ef5555)",
      },
      onClick: function () {},
    }).showToast();
    return;
  }
  if (cart.length === 0) return;
  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }

  const cartItems = cart
    .map((item) => {
      return ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`;
    })
    .join("");

  const message = encodeURIComponent(cartItems);
  const phone = "67900000000";

  window.open(
    `https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`,
    "_blank"
  );

  cart = [];

  updateCartModal();
});

function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();
  console.log(hora >= 18 && hora < 22);
  return hora >= 18 && hora < 22;
}

if (checkRestaurantOpen()) {
  spanItemHour.classList.remove("bg-red-500");
  spanItemHour.classList.add("bg-green-600");
} else {
  spanItemHour.classList.add("bg-red-500");
  spanItemHour.classList.remove("bg-green-600");
}
