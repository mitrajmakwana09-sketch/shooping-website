document.getElementById("productForm").addEventListener("submit", async event => {
    event.preventDefault();
    const form = event.currentTarget;
    const message = document.getElementById("message");
    const button = form.querySelector("button");
    button.disabled = true;
    message.className = "";
    message.textContent = "Saving image...";
    try {
        const response = await fetch("/api/products", { method: "POST", body: new FormData(form) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not save product.");
        form.reset();
        message.className = "success";
        message.textContent = "Product and image saved successfully in D:\\meetraj.";
    } catch (error) {
        message.className = "error";
        message.textContent = error.message;
    } finally { button.disabled = false; }
});
