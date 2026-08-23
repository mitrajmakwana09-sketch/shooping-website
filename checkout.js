/* =====================================================
   MYSHOP - CHECKOUT.JS
   ===================================================== */


/* =====================================================
   LOAD CART
   ===================================================== */

cart =
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


function getCheckoutTotal() {

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


let appliedCouponCode = "";


function getCouponDiscount(subtotal) {

    const code =
        String(
            document.getElementById(
                "couponCode"
            )?.value || ""
        ).trim().toUpperCase();


    if (code === "WELCOME50") {

        appliedCouponCode = "WELCOME50";

        return Math.min(50, subtotal);

    }

    if (code === "MEETRAJ60") {

        appliedCouponCode = "MEETRAJ60";

        return Math.min(60, subtotal);

    }


    appliedCouponCode = "";

    return 0;

}


function applyCoupon() {

    const subtotal =
        getCheckoutTotal();

    const discount =
        getCouponDiscount(subtotal);

    const message =
        document.getElementById(
            "couponMessage"
        );

    if (discount > 0) {

        if (message) {

            message.textContent =
                "Coupon applied: ₹" +
                discount.toLocaleString(
                    "en-IN"
                );
            message.style.color =
                "#16a34a";

        }

    } else {

        if (message) {

            message.textContent =
                "Invalid coupon code.";
            message.style.color =
                "#dc2626";

        }

    }

    updateCouponDisplay();

}


function updateCouponDisplay() {

    const subtotal =
        getCheckoutTotal();

    const discount =
        getCouponDiscount(subtotal);


    const discountElement =
        document.getElementById(
            "checkoutDiscount"
        );

    const totalElement =
        document.getElementById(
            "checkoutTotal"
        );


    if (discountElement) {

        discountElement.textContent =
            "- ₹" +
            discount.toLocaleString(
                "en-IN"
            );

    }


    if (totalElement) {

        totalElement.textContent =
            "₹" +
            (subtotal - discount)
                .toLocaleString("en-IN");

    }


    return discount;

}


/* =====================================================
   FORMAT PRICE
   ===================================================== */

function formatPrice(price) {

    return "₹" +
        normalizePrice(price)
            .toLocaleString("en-IN");

}


/* =====================================================
   UPDATE CHECKOUT SUMMARY
   ===================================================== */

function updateCheckoutSummary() {

    const itemsCount =
        cart.reduce(
            (total, item) => {

                return total +
                    Number(
                        item.quantity || 1
                    );

            },
            0
        );


    const subtotal =
        getCheckoutTotal();


    const discount =
        getCouponDiscount(subtotal);


    const delivery =
        subtotal > 0 ? 0 : 0;


    const total =
        subtotal - discount + delivery;


    const itemsElement =
        document.getElementById(
            "checkoutItems"
        );


    const subtotalElement =
        document.getElementById(
            "checkoutSubtotal"
        );


    const deliveryElement =
        document.getElementById(
            "checkoutDelivery"
        );


    const totalElement =
        document.getElementById(
            "checkoutTotal"
        );


    if (itemsElement) {

        itemsElement.textContent =
            itemsCount;

    }


    if (subtotalElement) {

        subtotalElement.textContent =
            formatPrice(subtotal);

    }


    if (deliveryElement) {

        deliveryElement.textContent =
            delivery === 0
                ? "FREE"
                : formatPrice(delivery);

    }


    if (totalElement) {

        totalElement.textContent =
            formatPrice(total);

    }


    localStorage.setItem(
        "cartTotal",
        total
    );

}


/* =====================================================
   DISPLAY CHECKOUT PRODUCTS
   ===================================================== */

function displayCheckoutProducts() {

    const container =
        document.getElementById(
            "checkoutProducts"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty-checkout">

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Please add products before checkout.
                </p>

                <a href="products.html">
                    Start Shopping
                </a>

            </div>

        `;


        return;

    }


    cart.forEach(item => {

        const price =
            normalizePrice(item.price);

        const quantity =
            Number(item.quantity) || 1;

        const total =
            price * quantity;


        container.innerHTML += `

            <div class="checkout-product">


                <div class="checkout-product-image">

                    <img
                        src="${item.image || 'images/product1.jpg'}"
                        alt="${item.name}"
                        onerror="this.src='images/product1.jpg'">

                </div>


                <div class="checkout-product-info">

                    <h3>
                        ${item.name}
                    </h3>

                    <p>
                        Quantity: ${quantity}
                    </p>

                    <p>
                        Color: ${item.color || "Default"} · Size: ${item.size || "Standard"}
                    </p>

                    <strong>
                        ${formatPrice(total)}
                    </strong>

                </div>


            </div>

        `;

    });

}


/* =====================================================
   GET INPUT VALUE
   ===================================================== */

function getValue(id) {

    const element =
        document.getElementById(id);


    if (!element) {

        return "";

    }


    return element.value.trim();

}


function getSelectedPaymentMethod() {

    const selected =
        document.querySelector(
            'input[name="paymentMethod"]:checked'
        );


    return selected ? selected.value : "online";

}


/* =====================================================
   VALIDATE CUSTOMER FORM
   ===================================================== */

function validateCheckoutForm() {

    const name =
        getValue("fullName");


    const email =
        getValue("email");


    let phone =
        getValue("phone");


    const address =
        getValue("address");


    const city =
        getValue("city");


    const state =
        getValue("state");


    let pincode =
        getValue("pincode");


    phone = phone.replace(/\D/g, "");
    pincode = pincode.replace(/\D/g, "");

    const phoneInput =
        document.getElementById(
            "phone"
        );

    const pincodeInput =
        document.getElementById(
            "pincode"
        );

    if (phoneInput) {
        phoneInput.value = phone;
    }

    if (pincodeInput) {
        pincodeInput.value = pincode;
    }


    /* Name */

    if (name.length < 3) {

        showCheckoutMessage(
            "Please enter your full name."
        );

        focusInput("fullName");

        return false;

    }


    /* Email */

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
        !emailPattern.test(email)
    ) {

        showCheckoutMessage(
            "Please enter a valid email address."
        );

        focusInput("email");

        return false;

    }


    /* Phone */

    const phonePattern =
        /^(?:\+91[\-\s]?|0)?[6-9][0-9]{9}$/;


    if (
        !phonePattern.test(phone)
    ) {

        showCheckoutMessage(
            "Please enter a valid 10-digit mobile number."
        );

        focusInput("phone");

        return false;

    }


    /* Address */

    if (address.length < 5) {

        showCheckoutMessage(
            "Please enter your complete address."
        );

        focusInput("address");

        return false;

    }


    /* City */

    if (city.length < 2) {

        showCheckoutMessage(
            "Please enter your city."
        );

        focusInput("city");

        return false;

    }


    /* State */

    if (state.length < 2) {

        showCheckoutMessage(
            "Please enter your state."
        );

        focusInput("state");

        return false;

    }


    /* Pincode */

    const pincodePattern =
        /^[1-9][0-9]{5}$/;


    if (
        !pincodePattern.test(pincode)
    ) {

        showCheckoutMessage(
            "Please enter a valid 6-digit pincode."
        );

        focusInput("pincode");

        return false;

    }


    return true;

}


/* =====================================================
   FOCUS INPUT
   ===================================================== */

function focusInput(id) {

    const input =
        document.getElementById(id);


    if (input) {

        input.focus();

    }

}


/* =====================================================
   SAVE CUSTOMER DETAILS
   ===================================================== */

function saveCustomerDetails() {

    const customer = {

        name:
            getValue("fullName"),

        email:
            getValue("email"),

        phone:
            getValue("phone"),

        address:
            getValue("address"),

        city:
            getValue("city"),

        state:
            getValue("state"),

        pincode:
            getValue("pincode")

    };


    localStorage.setItem(
        "customerDetails",
        JSON.stringify(customer)
    );

    localStorage.setItem(
        "customerName",
        customer.name
    );

    localStorage.setItem(
        "customerEmail",
        customer.email
    );

    localStorage.setItem(
        "customerPhone",
        customer.phone
    );

    localStorage.setItem(
        "customerAddress",
        customer.address
    );

    localStorage.setItem(
        "customerCity",
        customer.city
    );

    localStorage.setItem(
        "customerPincode",
        customer.pincode
    );

    localStorage.setItem(
        "customerState",
        customer.state
    );


    return customer;

}


/* =====================================================
   LOAD CUSTOMER DETAILS
   ===================================================== */

function loadCustomerDetails() {

    const customer =
        JSON.parse(
            localStorage.getItem(
                "customerDetails"
            )
        ) || {};


    if (
        customer.name &&
        document.getElementById("fullName")
    ) {

        document.getElementById(
            "fullName"
        ).value =
            customer.name;

    }


    if (
        customer.email &&
        document.getElementById("email")
    ) {

        document.getElementById(
            "email"
        ).value =
            customer.email;

    }


    if (
        customer.phone &&
        document.getElementById("phone")
    ) {

        document.getElementById(
            "phone"
        ).value =
            customer.phone;

    }


    if (
        customer.address &&
        document.getElementById("address")
    ) {

        document.getElementById(
            "address"
        ).value =
            customer.address;

    }


    if (
        customer.city &&
        document.getElementById("city")
    ) {

        document.getElementById(
            "city"
        ).value =
            customer.city;

    }


    if (
        customer.state &&
        document.getElementById("state")
    ) {

        document.getElementById(
            "state"
        ).value =
            customer.state;

    }


    if (
        customer.pincode &&
        document.getElementById("pincode")
    ) {

        document.getElementById(
            "pincode"
        ).value =
            customer.pincode;

    }

}


/* =====================================================
   PROCEED TO PAYMENT
   ===================================================== */

window.proceedToPayment = function(event) {

    if (event) {
        event.preventDefault();
    }

    /* Check cart */

    cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    if (cart.length === 0) {

        showCheckoutMessage(
            "Your cart is empty."
        );


        setTimeout(
            () => {

                window.location.href =
                    "products.html";

            },
            1200
        );


        return;

    }


    /* Validate */

    if (
        !validateCheckoutForm()
    ) {

        return;

    }


    /* Save customer */

    const customer =
        saveCustomerDetails();


    /* Payment method */

    const paymentMethod =
        getSelectedPaymentMethod();

    const paymentLabel =
        paymentMethod === "cod"
            ? "Cash on Delivery"
            : "Razorpay";


    /* Calculate total */

    const subtotal =
        getCheckoutTotal();

    const discount =
        getCouponDiscount(subtotal);

    const total =
        subtotal - discount;


    if (total <= 0) {

        showCheckoutMessage(
            "Invalid order amount."
        );

        return;

    }


    /* Save checkout information */

    const checkoutData = {

        customer:
            customer,

        items:
            cart,

        subtotal:
            subtotal,

        discount:
            discount,

        total:
            total,

        delivery:
            0,

        total:
            total,

        paymentMethod:
            paymentLabel,

        date:
            new Date().toISOString()

    };


    localStorage.setItem(
        "checkoutData",
        JSON.stringify(
            checkoutData
        )
    );


    localStorage.setItem(
        "cartTotal",
        total
    );

    localStorage.setItem(
        "paymentMethod",
        paymentLabel
    );


    /* Go payment page */

    if (paymentMethod === "cod") {

        localStorage.removeItem("cart");

        window.location.href =
            "success.html";

    } else {

        window.location.href =
            "payment-demo.html";

    }

}


/* =====================================================
   CHECKBOX - SAME ADDRESS
   ===================================================== */

function toggleAddress() {

    const checkbox =
        document.getElementById(
            "sameAddress"
        );


    const addressBox =
        document.getElementById(
            "addressBox"
        );


    if (
        !checkbox ||
        !addressBox
    ) {

        return;

    }


    if (checkbox.checked) {

        addressBox.style.display =
            "none";

    } else {

        addressBox.style.display =
            "block";

    }

}


/* =====================================================
   INPUT VALIDATION
   ===================================================== */

function setupInputValidation() {

    const phone =
        document.getElementById(
            "phone"
        );


    if (phone) {

        phone.addEventListener(
            "input",
            function () {

                this.value =
                    this.value
                        .replace(
                            /[^0-9]/g,
                            ""
                        )
                        .slice(0, 10);

            }
        );

    }


    const pincode =
        document.getElementById(
            "pincode"
        );


    if (pincode) {

        pincode.addEventListener(
            "input",
            function () {

                this.value =
                    this.value
                        .replace(
                            /[^0-9]/g,
                            ""
                        )
                        .slice(0, 6);

            }
        );

    }


    const name =
        document.getElementById(
            "fullName"
        );


    if (name) {

        name.addEventListener(
            "input",
            function () {

                this.value =
                    this.value.replace(
                        /[^a-zA-Z\s]/g,
                        ""
                    );

            }
        );

    }

}


/* =====================================================
   CHECKOUT MESSAGE
   ===================================================== */

function showCheckoutMessage(
    message
) {

    let box =
        document.getElementById(
            "checkoutMessage"
        );


    if (!box) {

        box =
            document.createElement(
                "div"
            );


        box.id =
            "checkoutMessage";


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
            "#ffffff";

        box.style.padding =
            "13px 20px";

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
            function () {

                box.style.display =
                    "none";

            },
            2500
        );

}


/* =====================================================
   GO BACK TO CART
   ===================================================== */

function goBackToCart() {

    window.location.href =
        "cart.html";

}


/* =====================================================
   PAGE LOAD
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
           Load cart again in case
           user came from cart page.
        */

        cart =
            JSON.parse(
                localStorage.getItem("cart")
            ) || [];

            /*
               Buy Now sends the selected product
               directly to checkout as a fallback.
            */
            let fromBuyNow = false;

            const params =
                new URLSearchParams(
                    window.location.search
                );

            const itemParam =
                params.get("item");

            if (itemParam) {

                try {

                    const item =
                        JSON.parse(
                            itemParam
                        );

                    if (
                        item &&
                        item.name &&
                        item.price !== undefined
                    ) {

                        cart = [
                            {
                                ...item,
                                price: normalizePrice(
                                    item.price
                                ),
                                quantity:
                                    Number(item.quantity) || 1
                            }
                        ];

                        localStorage.setItem(
                            "cart",
                            JSON.stringify(cart)
                        );

                        fromBuyNow = true;

                    }

                } catch (error) {

                    console.warn(
                        "Could not parse checkout item",
                        error
                    );

                }

            }

        updateCheckoutSummary();
        updateCouponDisplay();
        displayCheckoutProducts();

        if (fromBuyNow) {
            const paymentButton = document.getElementById("proceedPaymentBtn");
            if (paymentButton) {
                paymentButton.textContent = "Pay Now →";
            }
        }

        /* Coupon apply button */

        const applyCouponBtn =
            document.getElementById(
                "applyCouponBtn"
            );

        const couponCodeInput =
            document.getElementById(
                "couponCode"
            );

        if (applyCouponBtn) {

            applyCouponBtn.addEventListener(
                "click",
                applyCoupon
            );

        }

        if (couponCodeInput) {

            couponCodeInput.addEventListener(
                "keyup",
                function (event) {

                    if (event.key === "Enter") {
                        applyCoupon();
                    }

                }
            );

        }

        /* Same address checkbox */

        const sameAddress =
            document.getElementById(
                "sameAddress"
            );


        if (sameAddress) {

            sameAddress.addEventListener(
                "change",
                toggleAddress
            );

        }


        /* Checkout button */

        const paymentButton =
            document.getElementById(
                "proceedPaymentBtn"
            );

        const checkoutForm =
            document.getElementById(
                "checkoutForm"
            );


        if (checkoutForm) {

            checkoutForm.addEventListener(
                "submit",
                function(event) {

                    event.preventDefault();

                    proceedToPayment();

                }
            );

        }

    }
);
