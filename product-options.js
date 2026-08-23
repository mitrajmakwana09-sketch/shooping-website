/* Product colour, size and customer-review controls. */
(function () {
    const optionData = {
        "Wireless Headphones": { colors: ["Black", "Red", "White"], sizes: ["Standard"] },
        "Premium T-Shirt": { colors: ["Red", "Black", "Green", "White"], sizes: ["S", "M", "L", "XL"] },
        "Running Shoes": { colors: ["White", "Black", "Blue"], sizes: ["6", "7", "8", "9", "10"] },
        "Beauty Care Kit": { colors: ["Pink", "Gold", "Black"], sizes: ["Standard"] },
        "Smart Watch": { colors: ["Black", "Silver", "Orange"], sizes: ["42 mm", "44 mm", "49 mm"] },
        "Bluetooth Speaker": { colors: ["Black", "Blue", "Red"], sizes: ["Standard"] },
        "Casual Hoodie": { colors: ["Green", "Black", "Grey"], sizes: ["S", "M", "L", "XL"] },
        "Premium Backpack": { colors: ["Black", "Blue", "Grey"], sizes: ["Standard"] }
    };
    const colorHex = { Black: "#161616", Red: "#dc2626", White: "#ffffff", Green: "#2f855a", Blue: "#2563eb", Pink: "#ec4899", Gold: "#d4a72c", Silver: "#9ca3af", Orange: "#f97316", Grey: "#6b7280" };
    const imageFilters = {
        Black: "grayscale(1) brightness(.48)",
        Red: "sepia(1) saturate(7) hue-rotate(318deg)",
        White: "grayscale(1) brightness(1.32)",
        Green: "sepia(1) saturate(5) hue-rotate(78deg)",
        Blue: "sepia(1) saturate(5) hue-rotate(165deg)",
        Pink: "sepia(1) saturate(5) hue-rotate(285deg)",
        Gold: "sepia(1) saturate(4) hue-rotate(350deg)",
        Silver: "grayscale(1) brightness(1.08)",
        Orange: "sepia(1) saturate(7) hue-rotate(342deg)",
        Grey: "grayscale(1) brightness(.8)"
    };
    const style = document.createElement("style");
    style.textContent = `.product-options{margin:11px 0 12px;font-size:10px;color:#5c6478}.option-row{display:flex;align-items:center;gap:6px;margin-top:7px;flex-wrap:wrap}.option-label{min-width:35px;font-weight:700;color:#343a4b}.option-choice{border:1px solid #dce1ec;background:#fff;border-radius:6px;padding:4px 7px;font:inherit;cursor:pointer;color:#364153}.option-choice.selected{border-color:#4f46e5;background:#eef2ff;color:#4338ca;font-weight:700}.colour-dot{display:inline-block;width:13px;height:13px;border-radius:50%;padding:0;box-shadow:0 0 0 1px #cbd5e1;vertical-align:middle;margin-right:3px}.review-summary{display:flex;align-items:center;justify-content:space-between;gap:7px;margin:6px 0;color:#687189;font-size:10px}.write-review{border:0;background:none;color:#4f46e5;font:inherit;font-weight:700;cursor:pointer;padding:2px}.review-summary .stars{color:#f59e0b;letter-spacing:1px}.product .product-options,.product .review-summary{font-size:11px}`;
    document.head.appendChild(style);
    const productName = card => card.dataset.name || card.querySelector(".product-name")?.textContent.trim();
    const reviewCount = name => JSON.parse(localStorage.getItem("productReviews:" + name) || "[]").length;
    function refreshReviews(card) { const target = card.querySelector(".review-count"), count = reviewCount(productName(card)); if (target) target.textContent = count ? `${count} customer review${count === 1 ? "" : "s"}` : "No reviews yet"; }
    function makeChoice(value, kind, selected) {
        const button = document.createElement("button"); button.type = "button"; button.className = "option-choice" + (selected ? " selected" : ""); button.dataset.kind = kind; button.dataset.value = value;
        if (kind === "color") { const dot = document.createElement("span"); dot.className = "colour-dot"; dot.style.background = colorHex[value] || value; button.append(dot, document.createTextNode(value)); } else button.textContent = value;
        button.addEventListener("click", () => {
            button.parentElement.querySelectorAll(".option-choice").forEach(choice => choice.classList.remove("selected"));
            button.classList.add("selected");
            if (kind === "color") {
                const card = button.closest(".product-card, .product");
                const image = card?.querySelector(".product-image img");
                if (image) {
                    image.style.transition = "filter .25s ease";
                    image.style.filter = imageFilters[value] || "none";
                }
            }
        }); return button;
    }
    window.getProductOptions = function (name) { const card = Array.from(document.querySelectorAll(".product-card, .product")).find(item => productName(item) === name); return { color: card?.querySelector('[data-kind="color"].selected')?.dataset.value || "Default", size: card?.querySelector('[data-kind="size"].selected')?.dataset.value || "Standard" }; };
    document.querySelectorAll(".product-card, .product").forEach(card => {
        const name = productName(card), settings = optionData[name], info = card.querySelector(".product-info"); if (!settings || !info || info.querySelector(".product-options")) return;
        const review = document.createElement("div"); review.className = "review-summary"; review.innerHTML = '<span><span class="stars">★★★★★</span> <span class="review-count"></span></span><button type="button" class="write-review">Write review</button>';
        review.querySelector(".write-review").addEventListener("click", () => { const rating = Number(window.prompt(`Rate ${name} from 1 to 5 stars:`)); if (!Number.isInteger(rating) || rating < 1 || rating > 5) return; const key = "productReviews:" + name, reviews = JSON.parse(localStorage.getItem(key) || "[]"); reviews.push({ rating, comment: window.prompt("Write a short review (optional):") || "", createdAt: new Date().toISOString() }); localStorage.setItem(key, JSON.stringify(reviews)); refreshReviews(card); window.alert("Thank you for your review!"); });
        const options = document.createElement("div"); options.className = "product-options";
        [["Color", "color", settings.colors], ["Size", "size", settings.sizes]].forEach(([label, kind, values]) => { const row = document.createElement("div"); row.className = "option-row"; row.innerHTML = `<span class="option-label">${label}:</span>`; values.forEach((value, index) => row.appendChild(makeChoice(value, kind, index === 0))); options.appendChild(row); });
        const buttons = info.querySelector(".product-buttons, .add-btn"); info.insertBefore(review, buttons || null); info.insertBefore(options, buttons || null); refreshReviews(card);
    });
})();
