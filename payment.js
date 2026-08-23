/* =====================================================
   MYSHOP - PAYMENT.JS
   Razorpay Payment Integration
   ===================================================== */


/* =====================================================
   RAZORPAY KEY
   ===================================================== */

/*
   અહીં તમારો Razorpay TEST KEY ID નાખવો.

   Example:
   const RAZORPAY_KEY = "rzp_test_xxxxxxxxxx";

   Secret Key ક્યારેય અહીં ન નાખવી.
*/

window.RAZORPAY_KEY = "YOUR_RAZORPAY_TEST_KEY_ID";
const RAZORPAY_KEY = window.RAZORPAY_KEY;


/* =====================================================
   GET CART
   ===================================================== */

let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];


/* =====================================================
   GET CART TOTAL
   ===================================================== */

function normalizePrice(price) {

    return Number(
        String(price || "")
            .replace(/[^0-9.]/g, "")
    ) || 0;

}


function getPaymentTotal() {

    // Prefer checkoutData total (includes discounts) when available
    const checkoutData = JSON.parse(localStorage.getItem("checkoutData") || "null");

    if (checkoutData && typeof checkoutData.total === 'number') {
        return checkoutData.total;
    }

    let total = 0;

    cart.forEach(item => {

        const price =
            normalizePrice(item.price);

        const quantity =
            Number(item.quantity) || 1;

        total +=
            price * quantity;

    });

    return total;

}


/* =====================================================
   FORMAT PRICE
   ===================================================== */

function formatPaymentPrice(price) {

    return "₹" +
        normalizePrice(price)
            .toLocaleString("en-IN");

}


/* =====================================================
   UPDATE PAYMENT PAGE
   ===================================================== */

function updatePaymentPage() {

    const total = getPaymentTotal();

    const totalElement = document.getElementById("paymentTotal") || document.getElementById("productTotal");
    const amountElement = document.getElementById("amount") || document.getElementById("totalPrice");
    const discountElement = document.getElementById("discount");

    // If checkoutData present, show subtotal and discount when possible
    const checkoutData = JSON.parse(localStorage.getItem("checkoutData") || "null");

    if (totalElement) {
        const displayValue = (checkoutData && typeof checkoutData.subtotal === 'number') ? checkoutData.subtotal : total;
        totalElement.textContent = formatPaymentPrice(displayValue);
    }

    if (discountElement) {
        const discountValue = (checkoutData && typeof checkoutData.discount === 'number') ? checkoutData.discount : 0;
        discountElement.textContent = (discountValue > 0) ? ("- " + formatPaymentPrice(discountValue)) : "₹0";
    }

    if (amountElement) {
        amountElement.textContent = formatPaymentPrice(total);
    }

    localStorage.setItem("cartTotal", total);

}


/* =====================================================
   GET CUSTOMER DETAILS
   ===================================================== */

function getCustomerDetails() {

    return JSON.parse(
        localStorage.getItem(
            "customerDetails"
        )
    ) || {};

}


/* =====================================================
   OPEN RAZORPAY
   ===================================================== */

window.startRazorpayPayment = function() {

    cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        window.location.href =
            "products.html";

        return;

    }


    const total =
        getPaymentTotal();


    if (total <= 0) {

        alert(
            "Invalid payment amount."
        );

        return;

    }


    if (
        !RAZORPAY_KEY ||
        RAZORPAY_KEY ===
        "YOUR_RAZORPAY_TEST_KEY_ID"
    ) {

        alert(
            "Please add your Razorpay TEST Key ID in payment.js"
        );

        return;

    }


    const customer =
        getCustomerDetails();


    /*
       Razorpay amount is always
       in smallest currency unit.

       ₹100 = 10000 paise
    */

    const amountInPaise =
        Math.round(
            total * 100
        );


    const options = {

        key: RAZORPAY_KEY,

        amount: amountInPaise,

        currency: "INR",

        name: "MyShop",

        description:
            "Shopping Website Order",

        image:
            "images/logo.png",


        prefill: {

            name:
                customer.name || "",

            email:
                customer.email || "",

            contact:
                customer.phone || ""

        },


        notes: {

            order_type:
                "Online Shopping",

            customer_name:
                customer.name || ""

        },


        theme: {

            color: "#4f46e5"

        },


        handler: function(response) {

            paymentSuccess(
                response,
                total
            );

        },


        modal: {

            ondismiss: function() {

                showPaymentMessage(
                    "Payment cancelled"
                );

            }

        }

    };


    try {

        const razorpay =
            new Razorpay(
                options
            );


        razorpay.on(
            "payment.failed",
            function(response) {

                paymentFailed(
                    response
                );

            }
        );


        razorpay.open();

    }

    catch(error) {

        console.error(
            "Razorpay Error:",
            error
        );


        alert(
            "Unable to open Razorpay. Check your Razorpay Key ID."
        );

    }

};

window.startPayment = function() {
    return window.startRazorpayPayment();
};

document.addEventListener("DOMContentLoaded", updatePaymentPage);


/* =====================================================
   PAYMENT SUCCESS
   ===================================================== */

function paymentSuccess(
    response,
    total
) {


    const orderId =
        "ORD-" +
        Date.now();


    const paymentData = {

        orderId:
            orderId,

        razorpayPaymentId:
            response.razorpay_payment_id || "",

        amount:
            total,

        currency:
            "INR",

        status:
            "success",

        date:
            new Date().toISOString(),

        items:
            cart

    };


    /*
       Save payment information locally.

       IMPORTANT:
       Real production verification
       must happen on backend.
    */

    localStorage.setItem(
        "paymentData",
        JSON.stringify(
            paymentData
        )
    );


    localStorage.setItem(
        "orderId",
        orderId
    );


    /*
       Clear cart after successful
       frontend demo payment.
    */

    localStorage.removeItem(
        "cart"
    );


    localStorage.setItem(
        "cartTotal",
        "0"
    );


    showPaymentMessage(
        "Payment Successful ✓"
    );


    setTimeout(
        function() {

            window.location.href =
                "success.html";

        },
        800
    );

}


/* =====================================================
   PAYMENT FAILED
   ===================================================== */

function paymentFailed(
    response
) {

    console.error(
        "Payment Failed:",
        response
    );


    let errorMessage =
        "Payment failed. Please try again.";


    if (
        response &&
        response.error &&
        response.error.description
    ) {

        errorMessage =
            response.error.description;

    }


    localStorage.setItem(
        "paymentStatus",
        "failed"
    );


    localStorage.setItem(
        "paymentError",
        errorMessage
    );


    showPaymentMessage(
        errorMessage
    );

}


/* =====================================================
   PAYMENT MESSAGE
   ===================================================== */

function showPaymentMessage(
    message
) {

    let messageBox =
        document.getElementById(
            "paymentMessage"
        );


    if (!messageBox) {

        messageBox =
            document.createElement(
                "div"
            );


        messageBox.id =
            "paymentMessage";


        messageBox.style.position =
            "fixed";

        messageBox.style.left =
            "50%";

        messageBox.style.bottom =
            "25px";

        messageBox.style.transform =
            "translateX(-50%)";

        messageBox.style.background =
            "#111827";

        messageBox.style.color =
            "#ffffff";

        messageBox.style.padding =
            "13px 22px";

        messageBox.style.borderRadius =
            "10px";

        messageBox.style.fontSize =
            "13px";

        messageBox.style.fontWeight =
            "600";

        messageBox.style.zIndex =
            "99999";

        messageBox.style.boxShadow =
            "0 10px 30px rgba(0,0,0,0.25)";


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
            function() {

                messageBox.style.display =
                    "none";

            },
            3000
        );

}


/* =====================================================
   GO BACK TO CHECKOUT
   ===================================================== */

function backToCheckout() {

    window.location.href =
        "checkout.html";

}


/* =====================================================
   GO BACK TO CART
   ===================================================== */

function backToCart() {

    window.location.href =
        "cart.html";

}


/* =====================================================
   PAGE LOAD
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updatePaymentPage();


        const payButton =
            document.getElementById(
                "payNowBtn"
            );


        if (payButton) {

            payButton.addEventListener(
                "click",
                startRazorpayPayment
                
            );

        }

    }
);
function makePayment() {

    const method = document.getElementById("paymentMethod").value;

    if (method === "upi") {

        const upi = document.getElementById("upiId").value.trim();

        if (!upi) {
            alert("Please enter a demo UPI ID.");
            return;
        }
    }

    // Demo payment only
    localStorage.setItem("paymentStatus", "success");

    window.location.href = "success.html";
}


document.getElementById("paymentMethod").addEventListener("change", function () {

    const method = this.value;

    const upiBox = document.getElementById("upiBox");
    const cardBox = document.getElementById("cardBox");

    if (method === "upi") {

        upiBox.style.display = "block";
        cardBox.style.display = "none";

    } else if (method === "card") {

        upiBox.style.display = "none";
        cardBox.style.display = "block";

    } else {

        upiBox.style.display = "none";
        cardBox.style.display = "none";
    }
});