const WHATSAPP = "573147636825";

const products = [
  {
    id: "carro",
    name: "Carro Control Remoto HD",
    price: 99000,
    oldPrice: 110000,
    image: "images/carro.jpg",
    tag: "OFERTA",
    description: "Control desde celular, cámara HD en vivo, WiFi y batería recargable."
  },
  {
    id: "aspiradora",
    name: "Aspiradora Inalámbrica TOTAL 20V",
    price: 127000,
    oldPrice: 175000,
    image: "images/aspiradora.jpg",
    tag: "DESTACADO",
    description: "Succión de 8 kPa, filtro lavable y diseño ligero. Batería 20V no incluida."
  },
  {
    id: "linterna",
    name: "Linterna SOFIRN SD06",
    price: 89999,
    oldPrice: null,
    image: "images/linterna.jpg",
    tag: "TOP VENTAS",
    description: "Alta potencia, alcance anunciado de hasta 470 m e impermeabilidad IPX8."
  },
  {
    id: "instax",
    name: "Fujifilm Instax Mini 12 Rosa",
    price: 285000,
    oldPrice: 395000,
    image: "images/instanx-rosa-1.jpg",
    images: [
      "images/instanx-rosa-1.jpg",
      "images/instanx-rosa-2.jpg",
      "images/instanx-rosa-3.jpg",
      "images/instanx-rosa-4.jpg",
      "images/instanx-rosa-5.jpg"
    ],
    tag: "TOP VENTAS",
    description: "Cámara instantánea Fujifilm Instax Mini 12 en color rosa. Captura tus momentos favoritos y conviértelos en recuerdos físicos al instante."
  }
];

let cart = JSON.parse(localStorage.getItem("rebajon_cart") || "[]");

const money = n =>
  n ? "$" + n.toLocaleString("es-CO") : "Consultar";

const getProduct = id =>
  products.find(p => p.id === id);

function saveCart() {
  localStorage.setItem("rebajon_cart", JSON.stringify(cart));
  renderCart();
}

function addToCart(id) {
  const p = getProduct(id);

  if (!p) return;

  const item = cart.find(x => x.id === id);

  if (item) {
    item.qty++;
  } else {
    cart.push({ id, qty: 1 });
  }

  saveCart();
  openCart();
}

function changeQty(id, delta) {
  const item = cart.find(x => x.id === id);

  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    cart = cart.filter(x => x.id !== id);
  }

  saveCart();
}

function removeItem(id) {
  cart = cart.filter(x => x.id !== id);
  saveCart();
}

function total() {
  return cart.reduce((sum, item) => {
    const p = getProduct(item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
}

function renderProducts(list = products) {
  const grid = document.getElementById("productGrid");

  if (!grid) return;

  if (!list.length) {
    grid.innerHTML =
      '<div class="empty">No encontramos productos con esa búsqueda.</div>';
    return;
  }

  grid.innerHTML = list.map(p => `
    <article class="product" onclick="openProduct('${p.id}')">

      <img src="${p.image}" alt="${p.name}">

      <div class="product-body">

        <span class="tag">${p.tag}</span>

        <h3>${p.name}</h3>

        <p>${p.description}</p>

        <div class="price">
          ${p.oldPrice ? `<span class="old">${money(p.oldPrice)}</span>` : ""}
          ${money(p.price)}
        </div>

        <button
          class="btn primary"
          onclick="event.stopPropagation(); addToCart('${p.id}')">
          AÑADIR AL CARRITO
        </button>

      </div>

    </article>
  `).join("");
}

function renderCart() {
  const cartCount = document.getElementById("cartCount");
  const box = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");

  if (!cartCount || !box || !cartTotal || !checkoutBtn) return;

  cartCount.textContent =
    cart.reduce((s, x) => s + x.qty, 0);

  if (!cart.length) {

    box.innerHTML =
      '<div class="empty">Tu carrito está vacío.<br><br>Agrega un producto para comenzar.</div>';

  } else {

    box.innerHTML = cart.map(item => {

      const p = getProduct(item.id);

      if (!p) return "";

      return `
        <div class="cart-row">

          <img src="${p.image}" alt="${p.name}">

          <div>

            <h4>${p.name}</h4>

            <small>${money(p.price)} c/u</small>

            <div class="qty">

              <button onclick="changeQty('${p.id}',-1)">−</button>

              <b>${item.qty}</b>

              <button onclick="changeQty('${p.id}',1)">+</button>

              <button
                class="remove"
                onclick="removeItem('${p.id}')">
                Eliminar
              </button>

            </div>

          </div>

          <strong>
            ${money(p.price * item.qty)}
          </strong>

        </div>
      `;

    }).join("");
  }

  cartTotal.textContent = money(total());

  checkoutBtn.disabled = cart.length === 0;

  checkoutBtn.style.opacity =
    cart.length ? "1" : ".45";
}

function openProduct(id) {

  const p = getProduct(id);

  if (!p) return;

  const modal =
    document.getElementById("productModal");

  const detail =
    document.getElementById("productDetail");

  if (!modal || !detail) return;

  const gallery = p.images || [p.image];

  detail.innerHTML = `

    <div class="product-detail">

      <div class="product-detail-image">

        <img
          id="mainProductImage"
          src="${gallery[0]}"
          alt="${p.name}">

        <div class="product-thumbnails">

          ${gallery.map((img, index) => `
            <button
              type="button"
              class="thumbnail-button"
              onclick="changeProductImage('${img}')">

              <img
                src="${img}"
                alt="${p.name} ${index + 1}">

            </button>
          `).join("")}

        </div>

      </div>

      <div class="product-detail-info">

        <span class="tag">${p.tag}</span>

        <h2>${p.name}</h2>

        <div class="price">

          ${
            p.oldPrice
              ? `<span class="old">${money(p.oldPrice)}</span>`
              : ""
          }

          ${money(p.price)}

        </div>

        <p>${p.description}</p>

        <button
          class="btn primary full"
          onclick="addToCart('${p.id}'); closeProduct();">

          AÑADIR AL CARRITO

        </button>

      </div>

    </div>
  `;

  modal.classList.add("show");
}

function changeProductImage(image) {

  const main =
    document.getElementById("mainProductImage");

  if (main) {
    main.src = image;
  }
}

function closeProduct() {

  const modal =
    document.getElementById("productModal");

  if (modal) {
    modal.classList.remove("show");
  }
}

function openCart() {

  const drawer =
    document.getElementById("cartDrawer");

  const backdrop =
    document.getElementById("drawerBackdrop");

  if (drawer) {
    drawer.classList.add("open");
  }

  if (backdrop) {
    backdrop.classList.add("show");
  }
}

function closeCart() {

  const drawer =
    document.getElementById("cartDrawer");

  const backdrop =
    document.getElementById("drawerBackdrop");

  if (drawer) {
    drawer.classList.remove("open");
  }

  if (backdrop) {
    backdrop.classList.remove("show");
  }
}

function openWhatsApp(text) {

  window.open(
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`,
    "_blank"
  );
}

document.addEventListener("DOMContentLoaded", () => {

  const openCartBtn =
    document.getElementById("openCart");

  const closeCartBtn =
    document.getElementById("closeCart");

  const drawerBackdrop =
    document.getElementById("drawerBackdrop");

  const checkoutBtn =
    document.getElementById("checkoutBtn");

  const closeModalBtn =
    document.getElementById("closeModal");

  const closeProductModal =
    document.getElementById("closeProductModal");

  const productModal =
    document.getElementById("productModal");

  const search =
    document.getElementById("search");

  const orderForm =
    document.getElementById("orderForm");

  if (openCartBtn) {
    openCartBtn.onclick = openCart;
  }

  if (closeCartBtn) {
    closeCartBtn.onclick = closeCart;
  }

  if (drawerBackdrop) {
    drawerBackdrop.onclick = closeCart;
  }

  if (checkoutBtn) {

    checkoutBtn.onclick = () => {

      if (!cart.length) return;

      const modalBackdrop =
        document.getElementById("modalBackdrop");

      if (modalBackdrop) {
        modalBackdrop.classList.add("show");
      }

      closeCart();
    };
  }

  if (closeModalBtn) {

    closeModalBtn.onclick = () => {

      const modalBackdrop =
        document.getElementById("modalBackdrop");

      if (modalBackdrop) {
        modalBackdrop.classList.remove("show");
      }
    };
  }

  if (closeProductModal) {
    closeProductModal.onclick = closeProduct;
  }

  if (productModal) {

    productModal.addEventListener("click", e => {

      if (e.target === productModal) {
        closeProduct();
      }

    });

  }

  if (search) {

    search.addEventListener("input", e => {

      const q =
        e.target.value.toLowerCase().trim();

      renderProducts(
        products.filter(p =>
          `${p.name} ${p.description} ${p.tag}`
            .toLowerCase()
            .includes(q)
        )
      );

    });

  }

  if (orderForm) {

    orderForm.addEventListener("submit", e => {

      e.preventDefault();

      const data =
        new FormData(e.target);

      const lines =
        cart.map(item => {

          const p =
            getProduct(item.id);

          return `• ${item.qty} x ${p.name} — ${money(p.price * item.qty)}`;

        }).join("\n");

      const message =
        `🛒 *NUEVO PEDIDO - IMPORTADORA EL REBAJÓN*\n\n` +
        `👤 Cliente: ${data.get("name")}\n` +
        `📱 Teléfono: ${data.get("phone")}\n` +
        `📍 Departamento: ${data.get("department")}\n` +
        `🏙️ Ciudad: ${data.get("city")}\n` +
        `🏠 Dirección: ${data.get("address")}\n` +
        `🏘️ Barrio: ${data.get("neighborhood") || "No indicado"}\n\n` +
        `📦 *PRODUCTOS:*\n${lines}\n\n` +
        `💰 *TOTAL: ${money(total())}*\n` +
        `💵 *PAGO: CONTRA ENTREGA*\n` +
        `📝 Observaciones: ${data.get("notes") || "Ninguna"}`;

      openWhatsApp(message);

      cart = [];

      saveCart();

      const modalBackdrop =
        document.getElementById("modalBackdrop");

      if (modalBackdrop) {
        modalBackdrop.classList.remove("show");
      }

      e.target.reset();

    });

  }

  renderProducts();
  renderCart();

});
