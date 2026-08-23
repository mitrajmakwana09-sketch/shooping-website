/* =====================================================
   MYSHOP - CART.JS
   ===================================================== */


/* =====================================================
   CART DATA
   ===================================================== */

function normalizePrice(price) {

    return Number(
        String(price || "")
            .replace(/[^0-9.]/g, "")
    ) || 0;

}


let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];


cart = cart.map(item => ({
    ...item,
    price: normalizePrice(item.price)
}));


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
   NORMALIZE PRICE
   ===================================================== */

/* =====================================================
   FORMAT PRICE
   ===================================================== */

function formatPrice(price) {

    return "₹" +
        normalizePrice(price)
            .toLocaleString("en-IN");

}


/* =====================================================
   GET TOTAL ITEMS
   ===================================================== */

function getTotalItems() {

    return cart.reduce(
        (total, item) => {

            return total +
                Number(
                    item.quantity || 1
                );

        },
        0
    );

}


/* =====================================================
   GET SUBTOTAL
   ===================================================== */

function getSubtotal() {

    return cart.reduce(
        (total, item) => {

            const price =
                normalizePrice(item.price);

            const quantity =
                Number(item.quantity) || 1;


            return total +
                (price * quantity);

        },
        0
    );

}


/* =====================================================
   UPDATE CART COUNT
   ===================================================== */

function updateCartCount() {

    const count =
        getTotalItems();


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
   DISPLAY CART
   ===================================================== */

function displayCart() {

    const container =
        document.getElementById(
            "cartItems"
        );


    if (!container) {

        return;

    }


    /* Empty Cart */

    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                <div class="empty-icon">
                    🛒
                </div>

                <h2>
                    Your Cart is Empty
                </h2>

                <p>
                    Add some products to your cart.
                </p>

                <a
                    href="products.html"
                    class="shop-btn">

                    Start Shopping

                </a>

            </div>

        `;


        updateSummary();

        return;

    }


    container.innerHTML = "";


    cart.forEach(
        (item, index) => {

            const price =
                normalizePrice(item.price);

            const quantity =
                Number(item.quantity) || 1;

            const itemTotal =
                price * quantity;


            container.innerHTML += `

                <div
                    class="cart-item"
                    data-index="${index}">


                    <!-- PRODUCT IMAGE -->

                    <div class="item-image">

                        <img
                            src="${item.image || "images/product1.jpg"}"
                            alt="${item.name}"
                            onerror="
                                this.src='images/product1.jpg'
                            ">

                    </div>


                    <!-- PRODUCT DETAILS -->

                    <div class="item-details">

                        <span class="item-category">
                            Product
                        </span>


                        <h3 class="item-name">

                            ${item.name}

                        </h3>

                        <p class="item-variant">

                            Color: ${item.color || "Default"} · Size: ${item.size || "Standard"}

                        </p>


                        <p class="item-price">

                            ${formatPrice(price)}
                            each

                        </p>


                        <!-- QUANTITY -->

                        <div class="quantity-box">


                            <button
                                class="qty-btn"
                                onclick="
                                    changeQuantity(
                                        ${index},
                                        -1
                                    )
                                ">

                                −

                            </button>


                            <span class="quantity">

                                ${quantity}

                            </span>


                            <button
                                class="qty-btn"
                                onclick="
                                    changeQuantity(
                                        ${index},
                                        1
                                    )
                                ">

                                +

                            </button>


                        </div>

                    </div>


                    <!-- TOTAL -->

                    <div class="item-right">


                        <div class="item-total">

                            ${formatPrice(itemTotal)}

                        </div>


                        <button
                            class="remove-btn"
                            onclick="
                                removeItem(${index})
                            ">

                            🗑 Remove

                        </button>


                    </div>


                </div>

            `;

        }
    );


    updateSummary();

}


/* =====================================================
   CHANGE QUANTITY
   ===================================================== */

function changeQuantity(
    index,
    change
) {

    if (!cart[index]) {

        return;

    }


    let quantity =
        Number(
            cart[index].quantity || 1
        );


    quantity +=
        Number(change);


    /* Remove if quantity becomes 0 */

    if (quantity <= 0) {

        removeItem(index);

        return;

    }


    cart[index].quantity =
        quantity;


    saveCart();


    displayCart();

}


/* =====================================================
   INCREASE QUANTITY
   ===================================================== */

function increaseQuantity(index) {

    changeQuantity(
        index,
        1
    );

}


/* =====================================================
   DECREASE QUANTITY
   ===================================================== */

function decreaseQuantity(index) {

    changeQuantity(
        index,
        -1
    );

}


/* =====================================================
   REMOVE ITEM
   ===================================================== */

function removeItem(index) {

    if (!cart[index]) {

        return;

    }


    const productName =
        cart[index].name;


    const confirmRemove =
        confirm(
            `Remove "${productName}" from your cart?`
        );


    if (!confirmRemove) {

        return;

    }


    cart.splice(
        index,
        1
    );


    saveCart();


    displayCart();


    showCartMessage(
        `${productName} removed from cart`
    );

}


/* =====================================================
   CLEAR CART
   ===================================================== */

function clearCart() {

    if (cart.length === 0) {

        showCartMessage(
            "Your cart is already empty."
        );

        return;

    }


    const confirmClear =
        confirm(
            "Are you sure you want to clear your cart?"
        );


    if (!confirmClear) {

        return;

    }


    cart = [];


    localStorage.removeItem(
        "cart"
    );


    localStorage.removeItem(
        "cartTotal"
    );


    updateCartCount();


    displayCart();


    showCartMessage(
        "Cart cleared successfully"
    );

}


/* =====================================================
   UPDATE SUMMARY
   ===================================================== */

function updateSummary() {

    const itemCount =
        getTotalItems();


    const subtotal =
        getSubtotal();


    /*
       Free delivery
    */

    const delivery =
        subtotal > 0
            ? 0
            : 0;


    const discount =
        0;


    const total =
        subtotal +
        delivery -
        discount;


    /* Items */

    const itemsElement =
        document.getElementById(
            "itemsCount"
        );


    if (itemsElement) {

        itemsElement.textContent =
            itemCount;

    }


    /* Subtotal */

    const subtotalElement =
        document.getElementById(
            "subtotal"
        );


    if (subtotalElement) {

        subtotalElement.textContent =
            formatPrice(subtotal);

    }


    /* Delivery */

    const deliveryElement =
        document.getElementById(
            "delivery"
        );


    if (deliveryElement) {

        deliveryElement.textContent =
            delivery === 0
                ? "FREE"
                : formatPrice(delivery);

    }


    /* Total */

    const totalElement =
        document.getElementById(
            "totalPrice"
        );


    if (totalElement) {

        totalElement.textContent =
            formatPrice(total);

    }


    /* Save total */

    localStorage.setItem(
        "cartTotal",
        total
    );


    /* Checkout button */

    const checkoutButton =
        document.getElementById(
            "checkoutBtn"
        );


    if (checkoutButton) {

        checkoutButton.style.display =
            cart.length === 0
                ? "none"
                : "block";

    }

}


/* =====================================================
   GO TO CHECKOUT
   ===================================================== */

function goToCheckout() {

    if (cart.length === 0) {

        showCartMessage(
            "Your cart is empty."
        );

        return;

    }


    const total =
        getSubtotal();


    if (total <= 0) {

        showCartMessage(
            "Invalid cart total."
        );

        return;

    }


    localStorage.setItem(
        "cartTotal",
        total
    );


    window.location.href =
        "checkout.html";

}


/* =====================================================
   CONTINUE SHOPPING
   ===================================================== */

function continueShopping() {

    window.location.href =
        "products.html";

}


/* =====================================================
   UPDATE CART ITEM QUANTITY
   ===================================================== */

function setQuantity(
    index,
    quantity
) {

    if (!cart[index]) {

        return;

    }


    quantity =
        parseInt(
            quantity
        );


    if (
        isNaN(quantity) ||
        quantity <= 0
    ) {

        removeItem(index);

        return;

    }


    cart[index].quantity =
        quantity;


    saveCart();


    displayCart();

}


/* =====================================================
   CART MESSAGE
   ===================================================== */

function showCartMessage(
    message
) {

    let messageBox =
        document.getElementById(
            "cartMessage"
        );


    if (!messageBox) {

        messageBox =
            document.createElement(
                "div"
            );


        messageBox.id =
            "cartMessage";


        messageBox.style.position =
            "fixed";

        messageBox.style.bottom =
            "20px";

        messageBox.style.left =
            "50%";

        messageBox.style.transform =
            "translateX(-50%)";

        messageBox.style.background =
            "#111827";

        messageBox.style.color =
            "#ffffff";

        messageBox.style.padding =
            "12px 20px";

        messageBox.style.borderRadius =
            "10px";

        messageBox.style.fontSize =
            "13px";

        messageBox.style.fontWeight =
            "600";

        messageBox.style.zIndex =
            "99999";

        messageBox.style.boxShadow =
            "0 10px 30px rgba(0,0,0,0.2)";


        document.body.appendChild(
            messageBox
        );

    }


    messageBox.textContent =
        message;


    messageBox.style.display =
        "block";


    clearTimeout(
        messageBox.timer
    );


    messageBox.timer =
        setTimeout(
            function () {

                messageBox.style.display =
                    "none";

            },
            2200
        );

}


/* =====================================================
   CHECK CART
   ===================================================== */

function isCartEmpty() {

    return cart.length === 0;

}


/* =====================================================
   GET CART
   ===================================================== */

function getCart() {

    return cart;

}


/* =====================================================
   REFRESH CART
   ===================================================== */

function refreshCart() {

    cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    displayCart();


    updateCartCount();

}


/* =====================================================
   PAGE LOAD
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        cart =
            JSON.parse(
                localStorage.getItem("cart")
            ) || [];


        displayCart();


        updateCartCount();


        updateSummary();

    }
);
