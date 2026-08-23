(async () => {
    try {
        const response = await fetch("/api/products");
        if (!response.ok) return;
        const products = await response.json();
        const grid = document.getElementById("productsGrid");
        if (!grid) return;
        products.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.dataset.category = (product.category || "other").toLowerCase();
            card.dataset.name = product.name;
            card.innerHTML = `<div class="product-image"><img src="${product.image}" alt=""></div><div class="product-info"><span class="category"></span><h3 class="product-name"></h3><div class="price">₹${Number(product.price).toLocaleString("en-IN")}</div><div class="product-buttons"><button class="btn add-cart">Cart</button><button class="btn buy-now">Buy Now</button></div></div>`;
            card.querySelector("img").alt = product.name;
            card.querySelector(".category").textContent = product.category || "Other";
            card.querySelector(".product-name").textContent = product.name;
            card.querySelector(".add-cart").onclick = () => addToCart(product.name, product.price, product.image);
            card.querySelector(".buy-now").onclick = () => buyNow(product.name, product.price, product.image);
            grid.prepend(card);
        });
    } catch (_) { /* Static file preview: saved products require the local server. */ }
})();
