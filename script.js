/* =====================================================
   MYSHOP - MAIN SCRIPT.JS
   ===================================================== */


/* =====================================================
   CART
   ===================================================== */

let cart = JSON.parse(localStorage.getItem("cart")) || [];


/* =====================================================
   SAVE CART
   ===================================================== */

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();
}


/* =====================================================
   ADD TO CART
   ===================================================== */

function addToCart(product) {

    if (!product) {
        return;
    }


    const existingProduct = cart.find(
        item => String(item.id) === String(product.id)
    );


    if (existingProduct) {

        existingProduct.quantity =
            Number(existingProduct.quantity || 1) + 1;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: Number(product.price) || 0,

            image: product.image || "",

            quantity: 1

        });

    }


    saveCart();


    showNotification(
        `${product.name} added to cart 🛒`
    );

}


/* =====================================================
   ADD PRODUCT USING HTML BUTTON
   ===================================================== */

function addProduct(
    id,
    name,
    price,
    image
) {

    const product = {

        id: id,

        name: name,

        price: Number(price),

        image: image

    };


    addToCart(product);

}


/* =====================================================
   BUY NOW
   ===================================================== */

window.buyNow = function(
    name,
    price,
    image
) {

    cart = [{

        name: name,

        price: Number(price) || 0,

        image: image || "",

        quantity: 1

    }];


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    window.location.href =
        "checkout.html?item=" +
        encodeURIComponent(
            JSON.stringify(cart[0])
        );

}


/* =====================================================
   WISHLIST
   ===================================================== */

window.addWishlist = function(button) {

    if (!button) {
        return;
    }

    const icon =
        button.querySelector("i");


    if (!icon) {
        return;
    }


    if (
        icon.classList.contains(
            "fa-regular"
        )
    ) {

        icon.classList.remove(
            "fa-regular"
        );

        icon.classList.add(
            "fa-solid"
        );

        button.style.color =
            "#ef4444";

    } else {

        icon.classList.remove(
            "fa-solid"
        );

        icon.classList.add(
            "fa-regular"
        );

        button.style.color =
            "#6b7280";

    }

}


/* =====================================================
   REMOVE FROM CART
   ===================================================== */

function removeFromCart(id) {

    const index = cart.findIndex(
        item => String(item.id) === String(id)
    );


    if (index === -1) {
        return;
    }


    const productName = cart[index].name;


    cart.splice(index, 1);


    saveCart();


    showNotification(
        `${productName} removed from cart`
    );


    if (
        typeof displayCart === "function"
    ) {

        displayCart();

    }

}


/* =====================================================
   CHANGE QUANTITY
   ===================================================== */

function updateQuantity(
    id,
    change
) {

    const product = cart.find(
        item => String(item.id) === String(id)
    );


    if (!product) {
        return;
    }


    product.quantity =
        Number(product.quantity || 1) + Number(change);


    if (product.quantity <= 0) {

        removeFromCart(id);

        return;

    }


    saveCart();


    if (
        typeof displayCart === "function"
    ) {

        displayCart();

    }

}


/* =====================================================
   SET QUANTITY
   ===================================================== */

function setQuantity(
    id,
    quantity
) {

    const product = cart.find(
        item => String(item.id) === String(id)
    );


    if (!product) {
        return;
    }


    quantity = Number(quantity);


    if (quantity <= 0) {

        removeFromCart(id);

        return;

    }


    product.quantity = quantity;


    saveCart();


    if (
        typeof displayCart === "function"
    ) {

        displayCart();

    }

}


/* =====================================================
   CLEAR CART
   ===================================================== */

function clearCart() {

    if (cart.length === 0) {

        showNotification(
            "Cart is already empty"
        );

        return;

    }


    const confirmClear = confirm(
        "Are you sure you want to clear your cart?"
    );


    if (!confirmClear) {
        return;
    }


    cart = [];


    localStorage.removeItem("cart");

    localStorage.removeItem("cartTotal");


    updateCartCount();


    showNotification(
        "Cart cleared successfully"
    );


    if (
        typeof displayCart === "function"
    ) {

        displayCart();

    }

}


/* =====================================================
   GET CART TOTAL
   ===================================================== */

function getCartTotal() {

    return cart.reduce(
        (total, item) => {

            const price =
                Number(item.price) || 0;

            const quantity =
                Number(item.quantity) || 1;


            return total +
                (price * quantity);

        },

        0
    );

}


/* =====================================================
   GET TOTAL ITEMS
   ===================================================== */

function getCartItemCount() {

    return cart.reduce(
        (total, item) => {

            return total +
                (Number(item.quantity) || 1);

        },

        0
    );

}


/* =====================================================
   UPDATE CART COUNT
   ===================================================== */

function updateCartCount() {

    const count =
        getCartItemCount();


    const cartCounters =
        document.querySelectorAll(
            "#cartCount, .cart-count, [data-cart-count]"
        );


    cartCounters.forEach(
        counter => {

            counter.textContent =
                count;

        }
    );

}


/* =====================================================
   FORMAT PRICE
   ===================================================== */

function formatPrice(price) {

    return "₹" +
        Number(price || 0)
            .toLocaleString("en-IN");

}


/* =====================================================
   UPDATE TOTAL ELEMENT
   ===================================================== */

function updateTotal() {

    const total =
        getCartTotal();


    const totalElements =
        document.querySelectorAll(
            "#totalPrice, #cartTotal, #total"
        );


    totalElements.forEach(
        element => {

            element.textContent =
                formatPrice(total);

        }
    );


    localStorage.setItem(
        "cartTotal",
        total
    );

}


/* =====================================================
   CART ITEM COUNT
   ===================================================== */

function updateItemsCount() {

    const count =
        getCartItemCount();


    const elements =
        document.querySelectorAll(
            "#itemsCount"
        );


    elements.forEach(
        element => {

            element.textContent =
                count;

        }
    );

}


/* =====================================================
   CHECKOUT
   ===================================================== */

function goToCheckout() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty. Please add a product first."
        );

        return;

    }


    localStorage.setItem(
        "cartTotal",
        getCartTotal()
    );


    window.location.href =
        "checkout.html";

}


/* =====================================================
   GO TO CART
   ===================================================== */

function goToCart() {

    window.location.href =
        "cart.html";

}


/* =====================================================
   CONTINUE SHOPPING
   ===================================================== */

function continueShopping() {

    window.location.href =
        "products.html";

}


/* =====================================================
   SEARCH PRODUCTS
   ===================================================== */

function searchProducts() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    if (!searchInput) {
        return;
    }


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const products =
        document.querySelectorAll(
            ".product-card"
        );


    products.forEach(
        product => {

            const text =
                product.textContent
                    .toLowerCase();


            if (
                text.includes(searchText)
            ) {

                product.style.display =
                    "";

            } else {

                product.style.display =
                    "none";

            }

        }
    );

}


/* =====================================================
   SEARCH ENTER KEY
   ===================================================== */

function handleSearchKey(event) {

    if (
        event.key === "Enter"
    ) {

        searchProducts();

    }

}


/* =====================================================
   PRODUCT FILTER
   ===================================================== */

function filterProducts(category) {

    const products =
        document.querySelectorAll(
            ".product-card"
        );


    products.forEach(
        product => {

            const productCategory =
                (
                    product.dataset.category ||
                    ""
                ).toLowerCase();


            if (
                category === "all" ||
                productCategory ===
                    category.toLowerCase()
            ) {

                product.style.display =
                    "";

            } else {

                product.style.display =
                    "none";

            }

        }
    );

}


/* =====================================================
   SORT PRODUCTS
   ===================================================== */

function sortProducts(type) {

    const container =
        document.querySelector(
            ".products-grid"
        );


    if (!container) {
        return;
    }


    const products =
        Array.from(
            container.querySelectorAll(
                ".product-card"
            )
        );


    products.sort(
        (a, b) => {

            const priceA =
                parseFloat(
                    a.dataset.price || 0
                );


            const priceB =
                parseFloat(
                    b.dataset.price || 0
                );


            if (
                type === "low-high"
            ) {

                return priceA - priceB;

            }


            if (
                type === "high-low"
            ) {

                return priceB - priceA;

            }


            return 0;

        }
    );


    products.forEach(
        product => {

            container.appendChild(
                product
            );

        }
    );

}


/* =====================================================
   NOTIFICATION
   ===================================================== */

function showNotification(message) {

    let notification =
        document.getElementById(
            "shopNotification"
        );


    if (!notification) {

        notification =
            document.createElement(
                "div"
            );


        notification.id =
            "shopNotification";


        notification.style.position =
            "fixed";

        notification.style.bottom =
            "20px";

        notification.style.left =
            "50%";

        notification.style.transform =
            "translateX(-50%)";

        notification.style.background =
            "#111827";

        notification.style.color =
            "#ffffff";

        notification.style.padding =
            "12px 20px";

        notification.style.borderRadius =
            "10px";

        notification.style.fontSize =
            "13px";

        notification.style.fontWeight =
            "600";

        notification.style.zIndex =
            "99999";

        notification.style.boxShadow =
            "0 10px 30px rgba(0,0,0,0.2)";


        document.body.appendChild(
            notification
        );

    }


    notification.textContent =
        message;


    notification.style.opacity =
        "1";


    clearTimeout(
        notification.hideTimer
    );


    notification.hideTimer =
        setTimeout(
            () => {

                notification.style.opacity =
                    "0";

            },

            2000
        );

}


/* =====================================================
   SAVE CUSTOMER INFORMATION
   ===================================================== */

function saveCustomerDetails(data) {

    if (!data) {
        return;
    }


    localStorage.setItem(
        "customerDetails",
        JSON.stringify(data)
    );

}


/* =====================================================
   GET CUSTOMER INFORMATION
   ===================================================== */

function getCustomerDetails() {

    return JSON.parse(
        localStorage.getItem(
            "customerDetails"
        )
    ) || {};

}


/* =====================================================
   SAVE ORDER
   ===================================================== */

function saveOrder(order) {

    if (!order) {
        return;
    }


    const orders =
        JSON.parse(
            localStorage.getItem(
                "orders"
            )
        ) || [];


    orders.push(order);


    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

}


/* =====================================================
   GET ORDERS
   ===================================================== */

function getOrders() {

    return JSON.parse(
        localStorage.getItem(
            "orders"
        )
    ) || [];

}


/* =====================================================
   MOBILE MENU
   ===================================================== */

function toggleMenu() {

    const menu =
        document.querySelector(
            ".nav-menu"
        );


    if (!menu) {
        return;
    }


    menu.classList.toggle(
        "active"
    );

}


/* =====================================================
   CLOSE MOBILE MENU
   ===================================================== */

function closeMenu() {

    const menu =
        document.querySelector(
            ".nav-menu"
        );


    if (!menu) {
        return;
    }


    menu.classList.remove(
        "active"
    );

}


/* =====================================================
   PAGE LOAD
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

        updateTotal();

        updateItemsCount();


        /* Search */

        const searchInput =
            document.getElementById(
                "searchInput"
            );


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                searchProducts
            );


            searchInput.addEventListener(
                "keydown",
                handleSearchKey
            );

        }


        /* Mobile menu links */

        const menuLinks =
            document.querySelectorAll(
                ".nav-menu a"
            );


        menuLinks.forEach(
            link => {

                link.addEventListener(
                    "click",
                    closeMenu
                );

            }
        );

    }
);
