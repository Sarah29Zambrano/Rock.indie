const codigoSeguridad = "1234"

let modelos = [];
let carrito = [];

window.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("./modelos.json");
        if (!response.ok) throw new Error("Error al cargar los modelos");
        modelos = await response.json();
        renderizarProductos(modelos);
    } catch (error) {
        console.error("No se pudieron cargar los modelos:", error);
        Swal.fire({
            title: "Error",
            text: "No se pudieron cargar los productos.",
            icon: "error"
        });
    }
});

function renderizarProductos(lista) {
    const contenedor = document.getElementById("productos-container");
    contenedor.innerHTML = "";

    lista.forEach(producto => {
        const card = document.createElement("div");
        card.className = "col";
        card.innerHTML = `
            <div class="card shadow-sm h-100">
                <img src="./assets/img/${producto.imagen}" class="card-img-fit mb-3" style="max-height: 200px;" alt="${producto.nombre}">
                <div class="card-body d-flex flex-column justify-content-between align-items-center text-center">
                    <h3 class="mb-1 card-title">${producto.nombre}</h3>
                    <h4 class="mb-3 precio-texto">$${producto.precio.toLocaleString()}</h4>
                    <p class="card-text mb-4">${producto.descripcion}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <button type="button" class="btn btn-outline-success" id="${producto.id}" onclick="adquirirYa(this.id)">Adquirir ya</button>
                            <button type="button" class="btn btn-outline-info" id="${producto.id}" onclick="agregarCarrito(this.id)">Agregar a carrito</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

const adquirirYa = (id) => {
    const modelo = modelos.find(m => m.id == id)
    Swal.fire({
        title: "¿Desea adquirir " + modelo.nombre + "?",
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "¡Producto Adquirido!",
                confirmButtonText: "Aceptar",
                icon: "success",
            });
        } else {
            Swal.fire({
                title: "Adquisición Cancelada",
                confirmButtonText: "Aceptar",
                icon: "error",
            });
        }
    });
}

const agregarCarrito = (id) => {
    const badgeCounter = document.getElementById("badge-counter")
    badgeCounter.style.display = "block"
    let intCounter = badgeCounter.innerText;
    intCounter = parseInt(intCounter)
    intCounter += 1

    const item = modelos.find(m => m.id == id)
    carrito.push(item)

    document.getElementById("badge-counter").innerText = intCounter.toString()

}

const confirmarCarrito = async () => {
    const badgeCounter = document.getElementById("badge-counter")
    if (badgeCounter.innerText.trim() == "0") {
        return;
    }
    Swal.fire({
        title: "¿Desea confirmar su compra?",
        html: `${mostrarYCalcularTotal()}`,
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            manejarDialogoCodigoSeguridad();
        }
    });

}

const manejarDialogoCodigoSeguridad = async () => {
    const badgeCounter = document.getElementById("badge-counter")
    const { value: codigo } = await Swal.fire({
        title: "Ingrese el código de seguridad",
        input: "number",
        inputLabel: "Código",
        inputPlaceholder: "Inserte código",
        inputValidator: (value) => {
            if (value !== "1234") {
                return "Código Incorrecto, intente nuevamente";
            }
        }
    });
    if (codigo == "1234") {
        Swal.fire({
            title: "¡Compra confirmada!",
            confirmButtonText: "Aceptar",
            icon: "success",
        });
        badgeCounter.style.display = "none";
        badgeCounter.innerText = "0";
    }
}

const mostrarYCalcularTotal = () => {
    let mensaje = ""
    let total = 0
    carrito.forEach(item => {
        mensaje += "Producto: " + item.nombre + ", Precio: $" + item.precio + "<br>"
        total += item.precio
    });
    mensaje += "<br/>================================<br/><br/>"
    mensaje += "Total: $" + total
    return mensaje;
}