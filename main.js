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
    const confirmLabel = document.getElementById("modalConfirmLabel")
    confirmLabel.innerText = `¿Desea adquirir ${modelo.nombre} ?`
    document.getElementById("modal-confirm-body").innerText = `Precio: $${modelo.precio}`

    const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'))
    confirmModal.show()
    carrito = [modelo]
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

const abrirModalCarrito = () => {
    if (mostrarYCalcularTotal()) {
        const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'))
        confirmModal.show()
    }
}

const mostrarYCalcularTotal = () => {
    const badgeCounter = document.getElementById("badge-counter")
    if (badgeCounter.innerText.trim() == "0" || carrito.length == 0) {
        swal("Carrito vacío", "No hay productos en el carrito", "info")
        return false;
    }

    let mensaje = ""
    let total = 0
    carrito.forEach(item => {
        mensaje += "Producto: " + item.nombre + ", Precio: $" + item.precio + "\n"
        total += item.precio
    });
    mensaje += "\n --------------------------- \n\n"
    mensaje += "Total: $" + total
    document.getElementById("modal-confirm-body").innerText = mensaje
    return true;
}

const capturarCodigoSeguridad = () => {
    const input = document.getElementById("code-number").value.trim()

    if (!input) {
        swal("Error", "Debe ingresar un código de seguridad", "error")
        return;
    }

    if (input !== codigoSeguridad) {
        swal("Código incorrecto", "El código ingresado es incorrecto. Intente nuevamente", "error")
        document.getElementById("code-number").value = ""
        return;
    }

    confirmarCompra()
}

const confirmarCompra = () => {
    // Guardar la compra en localStorage
    const compras = JSON.parse(localStorage.getItem('compras') || '[]')
    const nuevaCompra = {
        fecha: new Date().toISOString(),
        productos: [...carrito],
        total: carrito.reduce((sum, item) => sum + item.precio, 0)
    }
    compras.push(nuevaCompra)
    localStorage.setItem('compras', JSON.stringify(compras))

    swal("¡Compra confirmada!", "Su compra ha sido procesada exitosamente", "success")

    vaciarCarrito()

    cerrarModales()
}

const vaciarCarrito = () => {
    carrito = []
    const badgeCounter = document.getElementById("badge-counter")
    badgeCounter.style.display = "none"
    badgeCounter.innerText = "0"
}

const cerrarModales = () => {
    const confirmModal = document.getElementById('confirmModal')
    const confirmModalInstance = bootstrap.Modal.getInstance(confirmModal)
    if (confirmModalInstance) {
        confirmModalInstance.hide()
    }

    const promptModal = document.getElementById('promptModal')
    const promptModalInstance = bootstrap.Modal.getInstance(promptModal)
    if (promptModalInstance) {
        promptModalInstance.hide()
    }

    document.getElementById("code-number").value = ""
}

const cancelarCompra = () => {
    swal("Compra cancelada", "Su compra ha sido cancelada", "info")
    vaciarCarrito()
    cerrarModales()
}

document.addEventListener('DOMContentLoaded', function () {
    const confirmModal = document.getElementById('confirmModal')
    const cancelButtons = confirmModal.querySelectorAll('.btn-secondary')
    cancelButtons.forEach(button => {
        button.addEventListener('click', cancelarCompra)
    })

    const promptModal = document.getElementById('promptModal')
    const cancelButtonsPrompt = promptModal.querySelectorAll('.btn-secondary')
    cancelButtonsPrompt.forEach(button => {
        button.addEventListener('click', cancelarCompra)
    })

    document.getElementById("code-number").addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            capturarCodigoSeguridad()
        }
    })

    promptModal.addEventListener('shown.bs.modal', function () {
        document.getElementById("code-number").value = ""
        document.getElementById("code-number").focus()
    })
})