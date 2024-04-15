const socket = io()

const productsContainer = document.getElementById("products-container");

socket.on('dataChanged', data => {
    loadProducts(data)
    console.log('data changed')
})

socket.on('dataLoad', data => {
    loadProducts(data)
    console.log('data load')
})

function loadProducts(data) {
    productsContainer.innerHTML = '';
    data.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("products");
        productDiv.innerHTML = 
        `
            <h2>${product.title}</h2>
            <p>${product.description}</p>
            <p>$${product.price}</p>
        `;

        productsContainer.appendChild(productDiv);
    });
}