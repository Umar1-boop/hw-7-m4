 const API_URL = "https://dummyjson.com/products";

        const form = document.getElementById("productForm");
        const titleInput = document.getElementById("title");
        const priceInput = document.getElementById("price");
        const productsContainer = document.getElementById("products");

        function getProducts() {
            fetch(API_URL)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Ошибка загрузки товаров");
                    }

                    return response.json();
                })
                .then(data => {
                    renderProducts(data.products);
                })
                .catch(error => {
                    console.error(error);
                    productsContainer.textContent =
                        "Не удалось загрузить товары";
                });
        }

        function renderProducts(products) {
            productsContainer.innerHTML = "";

            if (products.length === 0) {
                productsContainer.textContent = "Товаров нет";
                return;
            }

            products.forEach(product => {
                const productEl = document.createElement("div");

                productEl.innerHTML = `
                    <h3>${product.title}</h3>
                    <p>Цена: ${product.price}</p>
                    <button class="deleteBtn">Удалить</button>
                `;

                const deleteBtn =
                    productEl.querySelector(".deleteBtn");

                deleteBtn.addEventListener("click", () => {
                    deleteProduct(product, productEl, deleteBtn);
                });

                productsContainer.append(productEl);
            });
        }

        function createProduct(event) {
            event.preventDefault();

            const title = titleInput.value.trim();
            const price = priceInput.value.trim();

            if (!title || !price) {
                alert("Заполните поля");
                return;
            }

            fetch(`${API_URL}/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title,
                    price: Number(price)
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Ошибка добавления товара");
                    }

                    return response.json();
                })
                .then(product => {
                    const productEl = document.createElement("div");

                    productEl.innerHTML = `
                        <h3>${product.title}</h3>
                        <p>Цена: ${product.price}</p>
                        <button class="deleteBtn">Удалить</button>
                    `;

                    const deleteBtn =
                        productEl.querySelector(".deleteBtn");

                    deleteBtn.addEventListener("click", () => {
                        deleteProduct(product, productEl, deleteBtn);
                    });

                    if (productsContainer.textContent === "Товаров нет") {
                        productsContainer.innerHTML = "";
                    }

                    productsContainer.prepend(productEl);

                    form.reset();
                })
                .catch(error => {
                    console.error(error);
                    alert("Не удалось добавить товар");
                })
                .finally(() => {
                    console.log("Запрос на добавление завершён");
                });
        }

        function deleteProduct(product, productEl, deleteBtn) {
            if (!confirm("Точно удалить?")) {
                return;
            }

            deleteBtn.disabled = true;
            deleteBtn.textContent = "Удаление...";

            fetch(`${API_URL}/${product.id}`, {
                method: "DELETE"
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Ошибка удаления товара");
                    }

                    return response.json();
                })
                .then(data => {
                    productEl.remove();

                    if (productsContainer.children.length === 0) {
                        productsContainer.textContent = "Товаров нет";
                    }
                })
                .catch(error => {
                    console.error(error);
                    alert("Не удалось удалить товар");
                })
                .finally(() => {
                    deleteBtn.disabled = false;
                    deleteBtn.textContent = "Удалить";
                });
        }

        form.addEventListener("submit", createProduct);

        getProducts()





        // ${product.id} добавляется в конец URL в запросе DELETE, чтобы указать, какой именно товар нужно удалить. //