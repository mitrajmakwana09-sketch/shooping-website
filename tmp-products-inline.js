


        /* =========================
           CART
        ========================== */

        let cart =
            JSON.parse(
                localStorage.getItem("cart")
            ) || [];


        updateCartCount();


        function updateCartCount() {

            const count =
                cart.reduce(
                    (total, item) =>
                        total + item.quantity,
                    0
                );


            document.getElementById(
                "cartCount"
            ).textContent = count;

        }



        /* =========================
           ADD TO CART
        ========================== */

        function addToCart(
            name,
            price,
            image
        ) {


            const existing =
                cart.find(
                    item =>
                        item.name === name
                );


            if (existing) {

                existing.quantity++;

            } else {

                cart.push({

                    name: name,

                    price: price,

                    image: image,

                    quantity: 1

                });

            }


            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );


            updateCartCount();


            alert(
                name +
                " added to cart! 🛒"
            );

        }



        /* =========================
           BUY NOW
        ========================== */

        function buyNow(
            name,
            price,
            image
        ) {


            cart = [{

                name: name,

                price: price,

                image: image,

                quantity: 1

            }];


            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );


            window.location.href =
                "checkout.html";

        }



        /* =========================
           WISHLIST
        ========================== */

        function addWishlist(button) {

            const icon =
                button.querySelector("i");


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



        /* =========================
           SEARCH
        ========================== */

        const searchInput =
            document.getElementById(
                "searchInput"
            );


        const productCards =
            document.querySelectorAll(
                ".product-card"
            );


        const productCount =
            document.getElementById(
                "productCount"
            );


        const noProducts =
            document.getElementById(
                "noProducts"
            );


        let activeCategory = "all";


        searchInput.addEventListener(
            "input",
            filterProducts
        );



        /* =========================
           CATEGORY FILTER
        ========================== */

        document
            .querySelectorAll(".category-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function () {


                        document
                            .querySelectorAll(
                                ".category-btn"
                            )
                            .forEach(btn =>
                                btn.classList.remove(
                                    "active"
                                )
                            );


                        this.classList.add(
                            "active"
                        );


                        activeCategory =
                            this.dataset.category;


                        filterProducts();

                    }
                );

            });



        /* =========================
           FILTER FUNCTION
        ========================== */

        function filterProducts() {


            const search =
                searchInput.value
                    .toLowerCase()
                    .trim();


            let visibleCount = 0;


            productCards.forEach(card => {


                const name =
                    card.dataset.name
                        .toLowerCase();


                const category =
                    card.dataset.category;


                const matchesSearch =
                    name.includes(search);


                const matchesCategory =
                    activeCategory === "all" ||
                    category === activeCategory;


                if (
                    matchesSearch &&
                    matchesCategory
                ) {

                    card.style.display =
                        "block";

                    visibleCount++;

                } else {

                    card.style.display =
                        "none";

                }

            });


            productCount.textContent =
                visibleCount +
                (
                    visibleCount === 1
                        ? " Product"
                        : " Products"
                );


            noProducts.style.display =
                visibleCount === 0
                    ? "block"
                    : "none";

        }


    
