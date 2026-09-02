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
    name: "Fujifilm Instax Mini 12",
    price: 0,
    oldPrice: null,
    image: "images/instax.jpg",
    tag: "CONSULTAR",
    description: "Cámara instantánea compacta para guardar tus momentos en formato físico."
  }
];

let cart = JSON.parse(localStorage.getItem("rebajon_cart") || "[]");

const money = n => n ? "$" + n.toLocaleString("es-CO") : "Consultar";
const getProduct = id => products.find(p => p.id === id);

function saveCart(){ localStorage.setItem("rebajon_cart", JSON.stringify(cart)); renderCart(); }

function addToCart(id){
  const p = getProduct(id);
  if(!p.price){ openWhatsApp(`Hola Importadora El Rebajón, quiero consultar el precio de ${p.name}.`); return; }
  const item = cart.find(x => x.id === id);
  if(item) item.qty++;
  else cart.push({id, qty:1});
  saveCart();
  openCart();
}

function changeQty(id, delta){
  const item = cart.find(x => x.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart = cart.filter(x => x.id !== id);
  saveCart();
}

function removeItem(id){ cart = cart.filter(x => x.id !== id); saveCart(); }

function total(){
  return cart.reduce((sum, item) => {
    const p = getProduct(item.id);
    return sum + (p.price * item.qty);
  }, 0);
}

function renderProducts(list = products){
  const grid = document.getElementById("productGrid");
  if(!list.length){ grid.innerHTML = '<div class="empty">No encontramos productos con esa búsqueda.</div>'; return; }
  grid.innerHTML = list.map(p => `
    <article class="product">
      <img src="${p.image}" alt="${p.name}">
      <div class="product-body">
        <span class="tag">${p.tag}</span>
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="price">${p.oldPrice ? `<span class="old">${money(p.oldPrice)}</span>` : ""}${money(p.price)}</div>
        <button class="btn primary" onclick="addToCart('${p.id}')">${p.price ? "AÑADIR AL CARRITO" : "CONSULTAR POR WHATSAPP"}</button>
      </div>
    </article>
  `).join("");
}

function renderCart(){
  document.getElementById("cartCount").textContent = cart.reduce((s,x)=>s+x.qty,0);
  const box = document.getElementById("cartItems");
  if(!cart.length){
    box.innerHTML = '<div class="empty">Tu carrito está vacío.<br><br>Agrega un producto para comenzar.</div>';
  } else {
    box.innerHTML = cart.map(item => {
      const p = getProduct(item.id);
      return `<div class="cart-row">
        <img src="${p.image}" alt="${p.name}">
        <div>
          <h4>${p.name}</h4>
          <small>${money(p.price)} c/u</small>
          <div class="qty">
            <button onclick="changeQty('${p.id}',-1)">−</button>
            <b>${item.qty}</b>
            <button onclick="changeQty('${p.id}',1)">+</button>
            <button class="remove" onclick="removeItem('${p.id}')">Eliminar</button>
          </div>
        </div>
        <strong>${money(p.price * item.qty)}</strong>
      </div>`;
    }).join("");
  }
  document.getElementById("cartTotal").textContent = money(total());
  document.getElementById("checkoutBtn").disabled = cart.length === 0;
  document.getElementById("checkoutBtn").style.opacity = cart.length ? "1" : ".45";
}

function openCart(){
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("drawerBackdrop").classList.add("show");
}
function closeCart(){
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("drawerBackdrop").classList.remove("show");
}
function openWhatsApp(text){ window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank"); }

document.getElementById("openCart").onclick = openCart;
document.getElementById("closeCart").onclick = closeCart;
document.getElementById("drawerBackdrop").onclick = closeCart;

document.getElementById("checkoutBtn").onclick = () => {
  if(!cart.length) return;
  document.getElementById("modalBackdrop").classList.add("show");
  closeCart();
};
document.getElementById("closeModal").onclick = () => document.getElementById("modalBackdrop").classList.remove("show");

document.getElementById("orderForm").addEventListener("submit", e => {
  e.preventDefault();
  const data = new FormData(e.target);
  const lines = cart.map(item => {
    const p = getProduct(item.id);
    return `• ${item.qty} x ${p.name} — ${money(p.price * item.qty)}`;
  }).join("\n");
  const message = `🛒 *NUEVO PEDIDO - IMPORTADORA EL REBAJÓN*\n\n` +
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
  document.getElementById("modalBackdrop").classList.remove("show");
  e.target.reset();
});

document.getElementById("search").addEventListener("input", e => {
  const q = e.target.value.toLowerCase().trim();
  renderProducts(products.filter(p => `${p.name} ${p.description} ${p.tag}`.toLowerCase().includes(q)));
});

renderProducts();
renderCart();
