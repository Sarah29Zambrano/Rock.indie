const codigoSeguridad = "1234"

let modelos = [
    {
        id: "guitarra-electrica",
        nombre: "Guitarra Eléctrica Fender",
        precio: 500000
    },
    {
        id: "piano-digital",
        nombre: "Piano Digital Yamaha",
        precio: 830000
    },
    {
        id: "bateria",
        nombre: "Batería 5 cuerpos Yamaha",
        precio: 1300000
    }
]

let carrito = []

const adquirirYa = (id) => {
    const modelo = modelos.find(m => m.id == id)
    if (confirm("¿Desea adquirir " + modelo.nombre + "?")) {
        alert("Producto Adquirido")
    } else {
        alert("Adquisición Cancelada")
    }
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

const confirmarCarrito = () => {
    const badgeCounter = document.getElementById("badge-counter")
    if (badgeCounter.innerText.trim() == "0") {
        return;
    }
    if (!confirm("¿Desea confirmar su compra?\n\n" + mostrarYCalcularTotal())) {
        return;
    }

    while (true) {
        const codigo = prompt("Ingrese el código de seguridad: ")
        console.log("Código de seguridad ingresado: "+codigo)
        if (codigo == "1234") {
            alert("Compra Confirmada")
            badgeCounter.style.display = "none"
            badgeCounter.innerText = "0";
            break;
        } else {
            console.error("Código Inválido")
            alert("Código Incorrecto, intente nuevamente")
        }
    }
}

const mostrarYCalcularTotal = () => {
    let mensaje = ""
    let total = 0
    carrito.forEach(item => {
        mensaje += "Producto: "+item.nombre +", Precio: $" +item.precio + "\n"
        total += item.precio
    });
    mensaje += "\n ========================== \n\n"
    mensaje += "Total: $" + total
    return mensaje;
}