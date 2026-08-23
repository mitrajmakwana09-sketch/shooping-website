/* =====================================================
   MYSHOP - PRODUCTS.JS
   ===================================================== */


/* =====================================================
   PRODUCT DATA
   ===================================================== */

const products = [

    {
        id: 1,
        name: "Smart Watch",
        category: "electronics",
        price: 1499,
        oldPrice: 1999,
        image: "images/product1.jpg",
        rating: 4.5,
        description: "Smart watch with fitness tracking and notifications."
    },

    {
        id: 2,
        name: "Wireless Headphones",
        category: "electronics",
        price: 1299,
        oldPrice: 1799,
        image: "images/product2.jpg",
        rating: 4.6,
        description: "Comfortable wireless headphones with clear sound."
    },

    {
        id: 3,
        name: "Running Shoes",
        category: "fashion",
        price: 1999,
        oldPrice: 2499,
        image: "images/product3.jpg",
        rating: 4.4,
        description: "Lightweight running shoes for daily use."
    },

    {
        id: 4,
        name: "Backpack",
        category: "fashion",
        price: 899,
        oldPrice: 1299,
        image: "images/product4.jpg",
        rating: 4.3,
        description: "Stylish and durable backpack for everyday use."
    },

    {
        id: 5,
        name: "Bluetooth Speaker",
        category: "electronics",
        price: 999,
        oldPrice: 1499,
        image: "images/product5.jpg",
        rating: 4.5,
        description: "Portable Bluetooth speaker with powerful sound."
    },

    {
        id: 6,
        name: "Cotton T-Shirt",
        category: "fashion",
        price: 499,
        oldPrice: 799,
        image: "images/product6.jpg",
        rating: 4.2,
        description: "Comfortable premium cotton t-shirt."
    },

    {
        id: 7,
        name: "Laptop Stand",
        category: "electronics",
        price: 799,
        oldPrice: 1199,
        image: "images/product7.jpg",
        rating: 4.4,
        description: "Adjustable laptop stand for comfortable working."
    },

    {
        id: 8,
        name: "Travel Bottle",
        category: "home",
        price: 399,
        oldPrice: 599,
        image: "images/product8.jpg",
        rating: 4.1,
        description: "Reusable water bottle for travel and daily use."
    },

    {
        id: 9,
        name: "Gaming Mouse",
        category: "electronics",
        price: 699,
        oldPrice: 999,
        image: "images/product9.jpg",
        rating: 4.6,
        description: "High precision gaming mouse with RGB lighting."
    },

    {
        id: 10,
        name: "Sunglasses",
        category: "fashion",
        price: 599,
        oldPrice: 999,
        image: "images/product10.jpg",
        rating: 4.2,
        description: "Stylish sunglasses for everyday outdoor use."
    },

    {
        id: 11,
        name: "Desk Lamp",
        category: "home",
        price: 749,
        oldPrice: 999,
        image: "images/product11.jpg",
        rating: 4.3,
        description: "Modern LED desk lamp for study and office."
    },

    {
        id: 12,
        name: "Power Bank",
        category: "electronics",
        price: 1099,
        oldPrice: 1499,
        image: "images/product12.jpg",
        rating: 4.5,
        description: "Fast charging power bank for smartphones."
    }

];


/* =====================================================
   VARIABLES
   ===================================================== */

let currentProducts = [...products];

let currentCategory = "all";

let currentSearch = "";

let currentSort = "default";


/* =====================================================
   GET PRODUCT CONTAINER
   ===================================================== */

function getProductContainer() {

    return document.getElementById(
        "productsContainer"
    );

}


/* =====================================================
   DISPLAY PRODUCTS
   ===================================================== */

function displayProducts(productList = currentProducts) {

    const container =
        getProductContainer();


    if (!container) {

        return;

    }


    container.innerHTML = "";


    if (productList.length === 0) {

        container.innerHTML = `

            <div class="no-products">

                <div class="no-product-icon">
                    🔍
                </div>

                <h2>
                    No Products Found
                </h2>

                <p>
                    Try another search or category.
                </p>

                <button
                    onclick="resetProducts()">

                    Show All Products

                </button>

            </div>

        `;

        return;

    }


    productList.forEach(product => {

        container.innerHTML +=
            createProductCard(product);

    });


    updateProductCount(
        productList.length
    );

}


/* =====================================================
   CREATE PRODUCT CARD
   ===================================================== */

function createProductCard(product) {

    const discount =
        product.oldPrice > product.price
            ? Math.round(
                (
                    (product.oldPrice - product.price) /
                    product.oldPrice
                ) * 100
            )
            : 0;


    const stars =
        createStars(
            product.rating
        );


    return `

        <div
            class="product-card"
            data-id="${product.id}"
            data-category="${product.category}"
            data-price="${product.price}">


            <!-- IMAGE -->

            <div class="product-image">

                ${
                    discount > 0
                    ? `
                        <span class="discount">
                            ${discount}% OFF
                        </span>
                    `
                    : ""
                }


                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                    onerror="this.src='images/product1.jpg'">


                <button
                    class="wishlist-btn"
                    onclick="toggleWishlist(${product.id})"
                    aria-label="Add to wishlist">

                    ♡

                </button>

            </div>


            <!-- DETAILS -->

            <div class="product-info">


                <span class="product-category">

                    ${capitalize(
                        product.category
                    )}

                </span>


                <h3 class="product-name">

                    ${product.name}

                </h3>


                <div class="rating">

                    ${stars}

                    <span>
                        ${product.rating}
                    </span>

                </div>


                <p class="product-description">

                    ${product.description}

                </p>


                <!-- PRICE -->

                <div class="price-box">

                    <span class="product-price">

                        ₹${product.price.toLocaleString("en-IN")}

                    </span>


                    ${
                        product.oldPrice > product.price
                        ? `
                            <span class="old-price">

                                ₹${product.oldPrice.toLocaleString("en-IN")}

                            </span>
                        `
                        : ""
                    }

                </div>


                <!-- BUTTON -->

                <button
                    class="add-cart-btn"
                    onclick="addProductToCart(${product.id})">

                    <span>
                        🛒
                    </span>

                    Add to Cart

                </button>


            </div>

        </div>

    `;

}


/* =====================================================
   CREATE STARS
   ===================================================== */

function createStars(rating) {

    let stars = "";


    for (
        let i = 1;
        i <= 5;
        i++
    ) {

        if (rating >= i) {

            stars += "★";

        } else if (rating >= i - 0.5) {

            stars += "★";

        } else {

            stars += "☆";

        }

    }


    return stars;

}


/* =====================================================
   ADD PRODUCT TO CART
   ===================================================== */

function addProductToCart(productId) {

    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!product) {

        return;

    }


    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    const existingProduct =
        cart.find(
            item =>
                String(item.id) ===
                String(product.id)
        );


    if (existingProduct) {

        existingProduct.quantity =
            Number(
                existingProduct.quantity || 1
            ) + 1;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            image: product.image,

            quantity: 1

        });

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    updateCartCount();


    showProductMessage(
        `${product.name} added to cart 🛒`
    );

}


/* =====================================================
   CART COUNT
   ===================================================== */

function updateCartCount() {

    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    const count =
        cart.reduce(
            (total, item) => {

                return total +
                    Number(
                        item.quantity || 1
                    );

            },
            0
        );


    document
        .querySelectorAll(
            "#cartCount, .cart-count, [data-cart-count]"
        )
        .forEach(
            element => {

                element.textContent =
                    count;

            }
        );

}


/* =====================================================
   CATEGORY FILTER
   ===================================================== */

function filterCategory(category) {

    currentCategory =
        category.toLowerCase();


    applyFilters();

}


/* =====================================================
   SEARCH
   ===================================================== */

function searchProducts() {

    const input =
        document.getElementById(
            "searchInput"
        );


    if (!input) {

        return;

    }


    currentSearch =
        input.value
            .toLowerCase()
            .trim();


    applyFilters();

}


/* =====================================================
   APPLY FILTERS
   ===================================================== */

function applyFilters() {

    let filtered =
        [...products];


    /* Category */

    if (
        currentCategory !== "all"
    ) {

        filtered =
            filtered.filter(
                product =>
                    product.category.toLowerCase() ===
                    currentCategory
            );

    }


    /* Search */

    if (currentSearch !== "") {

        filtered =
            filtered.filter(
                product => {

                    const text =
                        (
                            product.name +
                            " " +
                            product.category +
                            " " +
                            product.description
                        ).toLowerCase();


                    return text.includes(
                        currentSearch
                    );

                }
            );

    }


    /* Sort */

    filtered =
        sortProductList(
            filtered,
            currentSort
        );


    currentProducts =
        filtered;


    displayProducts(
        filtered
    );

}


/* =====================================================
   SORT PRODUCTS
   ===================================================== */

function sortProducts(type) {

    currentSort =
        type;


    applyFilters();

}


/* =====================================================
   SORT FUNCTION
   ===================================================== */

function sortProductList(
    list,
    type
) {

    const sorted =
        [...list];


    if (
        type === "low-high"
    ) {

        sorted.sort(
            (a, b) =>
                a.price - b.price
        );

    }


    else if (
        type === "high-low"
    ) {

        sorted.sort(
            (a, b) =>
                b.price - a.price
        );

    }


    else if (
        type === "rating"
    ) {

        sorted.sort(
            (a, b) =>
                b.rating - a.rating
        );

    }


    else if (
        type === "name"
    ) {

        sorted.sort(
            (a, b) =>
                a.name.localeCompare(
                    b.name
                )
        );

    }


    return sorted;

}


/* =====================================================
   RESET PRODUCTS
   ===================================================== */

function resetProducts() {

    currentCategory =
        "all";


    currentSearch =
        "";


    currentSort =
        "default";


    const searchInput =
        document.getElementById(
            "searchInput"
        );


    if (searchInput) {

        searchInput.value =
            "";

    }


    const categoryButtons =
        document.querySelectorAll(
            ".category-btn"
        );


    categoryButtons.forEach(
        button => {

            button.classList.remove(
                "active"
            );

        }
    );


    displayProducts(
        products
    );


    updateProductCount(
        products.length
    );

}


/* =====================================================
   PRODUCT COUNT
   ===================================================== */

function updateProductCount(count) {

    document
        .querySelectorAll(
            "#productCount, .product-count"
        )
        .forEach(
            element => {

                element.textContent =
                    `${count} Products`;

            }
        );

}


/* =====================================================
   WISHLIST
   ===================================================== */

function getWishlist() {

    return JSON.parse(
        localStorage.getItem(
            "wishlist"
        )
    ) || [];

}


/* =====================================================
   TOGGLE WISHLIST
   ===================================================== */

function toggleWishlist(productId) {

    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!product) {

        return;

    }


    let wishlist =
        getWishlist();


    const exists =
        wishlist.some(
            item =>
                String(item.id) ===
                String(productId)
        );


    if (exists) {

        wishlist =
            wishlist.filter(
                item =>
                    String(item.id) !==
                    String(productId)
            );


        showProductMessage(
            "Removed from wishlist"
        );

    } else {

        wishlist.push(product);


        showProductMessage(
            "Added to wishlist ❤️"
        );

    }


    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );


    updateWishlistButtons();

}


/* =====================================================
   UPDATE WISHLIST BUTTONS
   ===================================================== */

function updateWishlistButtons() {

    const wishlist =
        getWishlist();


    document
        .querySelectorAll(
            ".wishlist-btn"
        )
        .forEach(
            button => {

                const card =
                    button.closest(
                        ".product-card"
                    );


                if (!card) {
                    return;
                }


                const id =
                    Number(
                        card.dataset.id
                    );


                const exists =
                    wishlist.some(
                        item =>
                            Number(item.id) === id
                    );


                if (exists) {

                    button.innerHTML =
                        "♥";

                    button.classList.add(
                        "active"
                    );

                } else {

                    button.innerHTML =
                        "♡";

                    button.classList.remove(
                        "active"
                    );

                }

            }
        );

}


/* =====================================================
   PRODUCT MESSAGE
   ===================================================== */

function showProductMessage(
    message
) {

    let box =
        document.getElementById(
            "productMessage"
        );


    if (!box) {

        box =
            document.createElement(
                "div"
            );


        box.id =
            "productMessage";


        box.style.position =
            "fixed";

        box.style.bottom =
            "20px";

        box.style.left =
            "50%";

        box.style.transform =
            "translateX(-50%)";

        box.style.background =
            "#111827";

        box.style.color =
            "#fff";

        box.style.padding =
            "12px 20px";

        box.style.borderRadius =
            "10px";

        box.style.fontSize =
            "13px";

        box.style.fontWeight =
            "600";

        box.style.zIndex =
            "99999";

        box.style.boxShadow =
            "0 10px 30px rgba(0,0,0,0.2)";


        document.body.appendChild(
            box
        );

    }


    box.textContent =
        message;


    box.style.display =
        "block";


    clearTimeout(
        box.timer
    );


    box.timer =
        setTimeout(
            () => {

                box.style.display =
                    "none";

            },
            2000
        );

}


/* =====================================================
   CAPITALIZE
   ===================================================== */

function capitalize(text) {

    if (!text) {

        return "";

    }


    return text
        .charAt(0)
        .toUpperCase() +
        text.slice(1);

}


/* =====================================================
   VIEW PRODUCT
   ===================================================== */

function viewProduct(productId) {

    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!product) {

        return;

    }


    localStorage.setItem(
        "selectedProduct",
        JSON.stringify(product)
    );


    window.location.href =
        "product-details.html";

}


/* =====================================================
   SEARCH ENTER
   ===================================================== */

function searchEnter(event) {

    if (
        event.key === "Enter"
    ) {

        searchProducts();

    }

}


/* =====================================================
   PAGE LOAD
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* Display products */

        if (
            getProductContainer()
        ) {

            displayProducts(
                products
            );

        }


        /* Cart count */

        updateCartCount();


        /* Wishlist */

        updateWishlistButtons();


        /* Search input */

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
                searchEnter
            );

        }


        /* Category buttons */

        document
            .querySelectorAll(
                ".category-btn"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        function () {

                            document
                                .querySelectorAll(
                                    ".category-btn"
                                )
                                .forEach(
                                    btn =>
                                        btn.classList.remove(
                                            "active"
                                        )
                                );


                            this.classList.add(
                                "active"
                            );


                            filterCategory(
                                this.dataset.category
                            );

                        }
                    );

                }
            );


        /* Sort dropdown */

        const sortSelect =
            document.getElementById(
                "sortProducts"
            );


        if (sortSelect) {

            sortSelect.addEventListener(
                "change",
                function () {

                    sortProducts(
                        this.value
                    );

                }
            );

        }

    }
);