var arrayProducts = [];
fetch("./Json/products.json")
    .then((response) => response.json())
    .then((products) => {
        loadProducts(products);
    });

const loadProducts = (products) => {
    arrayProducts = products;
    const container = document.getElementById("product-container");
    arrayProducts.forEach((product, index) => {
        var productCard = document.createElement("div");
        productCard.classList.add("card", "bg-dark", "col-6", "col-sm-3", "col-lg-2")
        var contentCard = ` <img src="${product.image}" class="card-img-top" alt="${product.name}">
    <div class="card-body">
      <h5 class="card-title" style= "color: white; text-align: center">${product.name}</h5>
      <p class="card-text" style= "color: white; text-align: center">${product.text}</p>
      <p class="card-text" style= "color: white; text-align: center">$${product.price}</p>
      <a href="#" class="btn btn-warning" onClick="addToCart(${index})">Comprar</a>
    </div>`;
        productCard.innerHTML += contentCard;
        container.appendChild(productCard);
    });

}

var total = 0;
itemscarrito.innerHTML = "";
var carrito = JSON.parse(localStorage.getItem("carrito")) || [];
actualizarCarrito();


function addToCart(index) {
    // const producto = products.find((product) => product.id === products[index].id);
    const producto = arrayProducts.findIndex((elemento) => {
        return elemento.id === arrayProducts[index].id;
    });
    if (!carrito.some((producto) => producto.id === arrayProducts[index].id)) {
        const addProduct = arrayProducts[index];
        addProduct.cantidad = 1;
        carrito.push(addProduct);
        actualizarCarrito();
    } else {
        arrayProducts[producto].cantidad += 1;
        actualizarCarrito();
    }
}

function storageUpdate(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function actualizarCarrito() {
    actualizarItems();
    storageUpdate(carrito);
}

function actualizarItems() {
    itemscarrito.innerHTML = "";
    if (carrito.length > 0) {

        carrito.forEach((producto, index) => {
            total += producto.price * producto.cantidad;
            contenedorcarrito = document.getElementById("itemscarrito");
            var itemscarrito = document.createElement("div");
            itemscarrito.className = "items-carrito";
            contentitems = `
        <div class="info-item">
            <img src="${producto.image}" class="img-carrito" alt="${producto.name}">
            <div class="name">${producto.name}</div>
            </div>
            <div class="precio-item">
                <div class="price">$${producto.price}
                </div>
            </div>
            <div class="cantidad-item">
                <div class="quantity">${producto.cantidad}
                </div>
            </div>
            <div class ="eliminar-item">
                <button class="btn btn-danger" id="remover-item" onClick="removeItemAlert(${index})">Eliminar item</button>
            </div>
        </div>
        `;
            itemscarrito.innerHTML += contentitems;
            contenedorcarrito.appendChild(itemscarrito);
        })

    } else {
        itemscarrito.classList.remove("items-carrito");
    }
    sumarPrecioItems();
}


function removeItem(index) {
    carrito.splice(index, 1);
    storageUpdate(carrito);
    actualizarCarrito();
}


function sumarPrecioItems() {

    var containerTotal = document.getElementById("total-container");
    const totalCarrito = document.createElement("div");
    totalCarrito.classList.add("precio-total");
    var contentTotal = `
    <div class="total-carrito">
            <div class="total">
                <div id = "precio-total">
                 $${total}
                </div>
            </div>
            <button class = "btn btn-dark" finCompra id="finCompra" onClick="finCompra()">Realizar compra
            </button>
    </div>`;
    containerTotal.innerHTML = contentTotal;

    // Inicializo una nueva variable en 0 y luego la defino a total
    //para que me sume correctamente los precios.
    var nuevototal = 0;
    total = nuevototal;
}

function removeItemAlert() {
    const deleteItemBTN = document.querySelector('#remover-item');
    deleteItemBTN.addEventListener('click', () => {
        Swal.fire({
            title: "¿Estas seguro que quieres eliminar el artículo?",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "No",
            confirmButtonText: "Si",
        }).then((result) => {

            if (result.isConfirmed) {
                removeItem();
                Swal.fire({
                    title: '¡Eliminado!',
                    text: 'El artículo fue eliminado del carrito',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                })
            }
        })
    })
}

function finCompra() {
    const totalCompra = document.getElementById("precio-total").innerHTML;
    const borrarHeaders = document.getElementById("header-container");
    const borrartotal = document.getElementById("total-container");

    borrartotal.innerHTML = '';
    borrarHeaders.innerHTML = '';
    itemscarrito.innerHTML = '';

    Swal.fire({
        title: "Muchas gracias por su compra!",
        text: "Su total ha sido de " + totalCompra,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
    })

    var msg = `<div class = "endMsg">¡Esperamos que vuelva pronto!</div>`;
    itemscarrito.innerHTML = msg;
    localStorage.clear();
}