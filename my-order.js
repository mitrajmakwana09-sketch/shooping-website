// ================= FILTER ORDERS =================

function filterOrders(status, button) {

    const orders = document.querySelectorAll(".order-card");
    const buttons = document.querySelectorAll(".filter-btn");
    const emptyOrders = document.getElementById("emptyOrders");

    // Remove active class
    buttons.forEach(btn => {
        btn.classList.remove("active");
    });

    // Add active class
    button.classList.add("active");

    let visibleOrders = 0;

    orders.forEach(order => {

        const orderStatus = order.dataset.status;

        if (status === "all" || orderStatus === status) {

            order.style.display = "block";
            visibleOrders++;

        } else {

            order.style.display = "none";

        }
    });

    // Show empty message
    if (visibleOrders === 0) {
        emptyOrders.style.display = "block";
    } else {
        emptyOrders.style.display = "none";
    }
}


// ================= VIEW ORDER =================

function viewOrder(orderId) {

    alert(
        "Order Details\n\n" +
        "Order ID: #" + orderId +
        "\n\nYour order details will be displayed here."
    );

}


// ================= TRACK ORDER =================

function trackOrder(orderId) {

    alert(
        "Tracking Order\n\n" +
        "Order ID: #" + orderId +
        "\n\nYour order is on the way 🚚"
    );

}


// ================= BUY AGAIN =================

function buyAgain(productName) {

    const confirmBuy = confirm(
        "Add " + productName + " to your cart?"
    );

    if (confirmBuy) {

        // Get existing cart
        let cart = JSON.parse(
            localStorage.getItem("cart")
        ) || [];

        // Add product
        cart.push({
            name: productName,
            quantity: 1
        });

        // Save cart
        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

        alert(
            productName +
            " has been added to your cart 🛒"
        );

    }
}


// ================= CANCEL ORDER =================

function cancelOrder(orderId) {

    const confirmCancel = confirm(
        "Are you sure you want to cancel Order #" +
        orderId +
        "?"
    );

    if (confirmCancel) {

        alert(
            "Order #" +
            orderId +
            " has been cancelled."
        );

        location.reload();

    }
}


// ================= MOBILE MENU =================

function toggleMenu() {

    const nav = document.querySelector(".navbar nav");

    nav.classList.toggle("show");

}


// ================= PAGE LOAD =================

document.addEventListener("DOMContentLoaded", function () {

    console.log("My Orders page loaded successfully.");

});