// Iniciación de formularios
let forms = document.querySelectorAll("form")
for (let form of forms){
    form.addEventListener("submit", (e) => { e.preventDefault() })
}

// Declaración de clases
class Parte {
    constructor(razonSocial, domicilio, condicionIVA, tipoDocumento, documento){
        this.razonSocial = razonSocial
        this.domicilio = domicilio
        this.condicionIVA = condicionIVA
        this.tipoDocumento = tipoDocumento
        this.documento = documento
    }

    // SETTERS
    set_razonSocial(razonSocial){
        if (Number.isNaN(Number(razonSocial))) this.razonSocial = razonSocial
        else return "<p>Razón social no válida</p>"
    }

    set_domicilio(domicilio){
        if (Number.isNaN(Number(domicilio))) this.domicilio = domicilio
        else return "<p>Domicilio no válido</p>"
    }

    set_condicionIVA(condicionIVA){
        if (condicionIVA != "Condición frente al IVA"){
            this.condicionIVA = condicionIVA
        }
        else return "<p>Condición de respecto al IVA no válida</p>"
    }

    set_tipoDocumento(tipoDocumento){
        if (tipoDocumento != "Tipo Doc") this.tipoDocumento = tipoDocumento
        else return "<p>Tipo de documento no válido</p>"
    }

    set_documento(documento){
        if (documento > 0) this.documento = parseInt(documento)
        else return "<p>Documento no válido</p>"
    }    
}

class Cliente extends Parte{
    constructor(razonSocial, domicilio, condicionIVA, tipoDocumento, documento, email){
        super(razonSocial, domicilio, condicionIVA, tipoDocumento, documento)
        this.email = email
    }

    // SETTERS
    set_email(email){
        if (email == '') return "<p>Correo no válido</p>"
        else this.email = email.toLowerCase()
    }
}

class Vendedor extends Parte{
    constructor(razonSocial, domicilio, condicionIVA, tipoDocumento, documento, ingresosBrutos, inicioActividades){
        super(razonSocial, domicilio, condicionIVA, tipoDocumento, documento)
        this.ingresosBrutos = ingresosBrutos
        this.inicioActividades = inicioActividades
    }

    // SETTERS 
    set_ingresosBrutos(ingresosBrutos){
        ingresosBrutos = Number(ingresosBrutos)
        if (!Number.isNaN(ingresosBrutos)) this.ingresosBrutos = parseInt(ingresosBrutos)
        else return "<p>Ingresos Brutos no válido</p>"
    }

    set_inicioActividades(inicioActividades){
        let fecha = Date.parse(inicioActividades)
        if (isNaN(fecha)) return "<p>Fecha no válida</p>"
        else this.inicioActividades = fecha
    }
}

class Factura {
    constructor(proyecto, vendedor, cliente, tipo, fecha, puntoVenta, num, condicionVenta){
        this.proyecto = proyecto
        this.vendedor = vendedor
        this.cliente = cliente
        this.tipo = tipo
        this.fecha = fecha
        this.puntoVenta = puntoVenta
        this.num = num
        this.estado = "Borrador"
        this.condicionVenta = condicionVenta
        this.compra = []
        this.total_compra = 0
        this.impuestos = []
        this.total_impuestos = 0
        this.cuotas = []
        this.total_financiacion = 0
    }

    // SETTERS
    set_proyecto(proyecto){
        if (proyecto != '') this.proyecto = proyecto
        else return "<p>Proyecto no válida</p>"
    }

    set_vendedor(vendedor){
        if (vendedor instanceof Vendedor) this.vendedor = vendedor
        else return "<p>Vendedor no válida</p>"
    }
    set_cliente(cliente){
        if (cliente instanceof Cliente) this.cliente = cliente
        else return "<p>Cliente no válido</p>"
    }    
    set_tipo(tipo){
        if (tipo == "A" ||
            tipo == "B" ||
            tipo == "C") this.tipo = tipo.toUpperCase()
        else return "<p>Tipo de factura no válido</p>"
    }
    set_fecha(fecha){
        let fechaFact = Date.parse(fecha)
        let statement = isNaN(fechaFact)
        if (statement)  return "<p>Fecha no válida</p>"
        else this.fecha = Date(fechaFact)
    }
    set_estado(estado){
        estado = estado.toUpperCase
        if (estado == "BORRADOR" ||
            estado == "SIN ENVIAR" ||
            estado == "ENVIADA" ||
            estado == "PAGADA") this.estado = estado
        else return "<p>Estado de factura no válido</p>"
    }
    set_condicionVenta(condicionVenta){
        if (condicionVenta == null) condicionVenta=''

        condicionVenta = condicionVenta.toUpperCase()
        if (condicionVenta == "TRANSFERENCIA" ||
            condicionVenta == "EFECTIVO" ||
            condicionVenta == "TARJETA DE CRÉDITO" ||
            condicionVenta == "TARJETA DE DÉBITO"){
            this.condicionVenta = condicionVenta
        }
        else return "<p>Condición de Venta no válida</p>"
    }

    // GETTER
    get_total_factura(){
        return this.total_compra + this.total_impuestos + this.total_financiacion
    }

    // MÉTODOS
    total_factura(){ 
        let total = 0
        if (this.compra.length == 0) {
            return "<p>Factura vacía</p>"
        } else{
            this.compra.forEach(el => {
                total += el.subtotal
            })
        }

        this.total_compra = total

        return total
    }
    
    impuesto(nombre_impuesto,porcentaje_impuesto){
        if (this.total_compra == 0) return "<p>Compra no cargada</p>"
        else{
            let monto_impuesto = this.total_compra * (parseFloat(porcentaje_impuesto)/100)
            this.total_impuestos += monto_impuesto 
            this.impuestos.push([nombre_impuesto, monto_impuesto])
            return this.total_impuestos
        }
    }
    
    interes_cuotas(cuotas){
        let sub = this.total_compra + this.total_impuestos
        let interes = 0
            switch(cuotas) {
                case 1:
                    interes = 0
                    break
                case 3:
                    interes = sub * 0.15
                    break
                case 6:
                    interes = sub * 0.25
                    break
                case 9:
                    interes = sub * 0.35
                    break
                case 12:
                    interes = sub * 0.45
                    break
                default:
                    return "<p>Solo 3, 6, 9 o 12 cuotas</p>"
                    break
        }
        this.total_financiacion = parseFloat(interes.toFixed(2))
    }
    
    calculo_cuota(cuotas){
        let cuota = this.get_total_factura() / cuotas
        cuota = Math.floor(cuota * 100) / 100
        
        let cuotasValores = Array(cuotas).fill(cuota)

        if ((cuota * cuotas) < this.get_total_factura() ) {

            let cuota_uno = cuota + (this.get_total_factura() - (cuota * cuotas))
            cuota_uno = parseFloat(cuota_uno.toFixed(2))
            cuotasValores[0] = cuota_uno

        }

        this.cuotas = cuotasValores
        return cuotasValores
    }

    cargar_compra(listaCompra){
        let setCompra = new Set(listaCompra)
        let compra = []
        setCompra.forEach(product => {
            let cant = listaCompra.filter((el) => el == product).length
            let prod = {
                codigo: product.codigo,
                descripcion: product.descripcion,
                categoria: product.categoria,
                precio: product.precio,
                cantidad: cant,
                subtotal: (product.precio * cant)
            }
            compra.push(prod)
        });
        
        this.compra = compra
        this.total_factura()
        return compra
    }

    imprimir_factura(){
        /* Estructura de la factura */
        let modal = document.createElement("div")
        modal.id = "modalFact"
        modal.setAttribute("data-bs-theme" , "dark" )
        modal.classList.add("fixed-top","modal","d-block","backblur","bg-body-tertiary","bg-opacity-50")
        modal.innerHTML = 
        `<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Factura: ${this.puntoVenta.toString().padStart(4,'0')}-${this.num.toString().padStart(8,'0')}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-black">
                    <div class="border A4 d-flex flex-column">
                        <header class="rounded-5 rounded-top-0 bg-warning position-relative pb-3 mb-5 text-white">
                            <div class="d-flex pb-3 px-4">
                                <div class="col d-flex flex-column justify-content-center align-items-end">Logo</div>
                                <div class="d-flex flex-column border border-white flex-shrink-1 text-center square justify-content-center mx-5">
                                    <p class="h1">${this.tipo}</p>
                                    <p class="fs-6">Cod. 06</p>
                                </div>
                                <div class="d-flex col flex-column justify-content-center">
                                    <p class="h6 lh-1">Factura</p>
                                    <p class="m-0"><span class="fw-semibold">N°</span> ${this.puntoVenta.toString().padStart(4,'0')}-${this.num.toString().padStart(8,'0')}</p>
                                    <p class="m-0"><span class="fw-semibold">Fecha:</span> ${new Date(this.fecha).toLocaleDateString(undefined,{year: 'numeric', month: 'numeric', day: 'numeric'})}</p>
                                </div>
                            </div>
                            <div class="px-4 row m-0">
                                <div class="col-7">
                                    <p class="m-0"><span class="fw-semibold">Razón Social:</span> ${this.vendedor.razonSocial}</p>
                                    <p class="m-0"><span class="fw-semibold">Domicilio:</span> ${this.vendedor.domicilio}</p>
                                    <p class="m-0"><span class="fw-semibold">Condición frente al IVA:</span> ${this.vendedor.condicionIVA}</p>
                                </div>
                                <div class="d-flex flex-column col">
                                    <p class="m-0"><span class="fw-semibold">${this.vendedor.tipoDocumento}</span> ${this.vendedor.documento}</p>
                                    <p class="m-0"><span class="fw-semibold">Ingresos Brutos:</span> ${this.vendedor.ingresosBrutos}</p>
                                    <p class="m-0"><span class="fw-semibold">Inicio de Actividades:</span> ${new Date(this.vendedor.inicioActividades).toLocaleDateString(undefined,{year: 'numeric', month: 'numeric', day: 'numeric'})}</p>
                                    <a href="https://www.coderhouse.com/" referrerpolicy="no-referrer" target="_blank" class="d-flex flex-grow-1 align-items-end">https://www.coderhouse.com/</a>
                                </div>
                            </div>
                        </header>
                        <section class="px-4 row m-0 mb-5">
                            <div class="col-7">
                                <p class="m-0"><span class="fw-semibold">Cliente:</span> ${this.cliente.razonSocial}</p>
                                <p class="m-0"><span class="fw-semibold">Domicilio:</span> ${this.cliente.domicilio}</p>
                                <p class="m-0"><span class="fw-semibold">Condición frente al IVA:</span> ${this.cliente.condicionIVA}</p>
                            </div>
                            <div class="col">
                                <p class="m-0"><span class="fw-semibold">Documento:</span> ${this.cliente.tipoDocumento} ${this.cliente.documento}</p>
                                <p class="m-0"><span class="fw-semibold">Email:</span> <a href="mailto:${this.cliente.email}">${this.cliente.email}</a></p>
                                <p class="m-0"><span class="fw-semibold">Condición de venta:</span> ${this.cliente.condicionVenta}</p>
                            </div>
                        </section>
                        <section class="flex-grow-1 d-flex flex-column">
                            <header class="d-flex row border border-start-0 border-end-0 border-warning px-4 m-0 fw-semibold">
                                <div class="col-1">CÓD</div>
                                <div class="col-6">DESCRIPCIÓN</div>
                                <div class="col-1">CANT</div>
                                <div class="col-2">PRECIO</div>
                                <div class="col-2">TOTAL</div>
                            </header>
                            <div id="tablaDetalle" class="flex-grow-1 border-bottom border-warning">
                                
                            </div>
                            <footer class="mb-5 pb-5">
                                <ul id="subtotales" class="m-0 p-0">
                                    <li class="row px-4 m-0 fw-semibold">
                                        <div class="col text-end">Subtotal</div>
                                        <div class="col-2 d-flex justify-content-between">
                                            <span>$</span>
                                            <p class="m-0">${this.total_compra.toFixed(2)}</p>
                                        </div>
                                    </li>
                                </ul>
                            </footer>
                        </section>
                    </div>
                </div>
            </div>
        </div>`

        document.querySelector("#main").append(modal)

        /* Impresión de los productos */
        let tabla = modal.querySelector("#tablaDetalle")

        for (let producto of this.compra){
            for (let key in producto){
                if (producto[key] == null){
                    producto[key] = ''
                }
            }
            let div = document.createElement("div")
            div.classList.add("d-flex","row","px-4","m-0","text-center")
            div.innerHTML = `
                <div class="col-1">${producto.codigo}</div>
                <div class="col-6 text-start">${producto.descripcion}</div>
                <div class="col-1">${producto.cantidad}</div>
                <div class="col-2 d-flex justify-content-between">
                    <span>$</span>
                    <p class="m-0">${producto.precio.toFixed(2)}</p>
                </div>
                <div class="col-2 d-flex justify-content-between">
                    <span>$</span>
                    <p class="m-0">${producto.subtotal.toFixed(2)}</p>
                </div>`
            tabla.append(div)
        }

        let subtotales = modal.querySelector("#subtotales")

        /* Impresión de los impuestos */
        if (this.total_impuestos) {
            for (let impuesto of this.impuestos){
                let li = document.createElement("li")
                li.classList.add("row","px-4","m-0")
                li.innerHTML = `
                    <div class="col text-end">${impuesto[0]}</div>
                    <div class="col-2 d-flex justify-content-between">
                        <span>$</span>
                        <p class="m-0">${impuesto[1].toFixed(2)}</p>
                    </div>`
                subtotales.append(li)
            }

            let li = document.createElement("li")
            li.classList.add("row","px-4","m-0","fw-semibold")
                li.innerHTML = `
                <div class="col text-end">Subtotal con impuestos</div>
                <div class="col-2 d-flex justify-content-between">
                    <span>$</span>
                    <p class="m-0">${(this.total_impuestos + this.total_compra).toFixed(2)}</p>
                </div>`
            subtotales.append(li)
        }
        
        /* Impresión de la financiación */
        if(this.total_financiacion){
            let li = document.createElement("li")
            li.classList.add("row","px-4","m-0")
            li.innerHTML = `
                <div class="col text-end">Interés por financiación</div>
                <div class="col-2 d-flex justify-content-between">
                    <span>$</span>
                    <p class="m-0">${this.total_financiacion.toFixed(2)}</p>
                </div>`
            subtotales.append(li)

            let footer = subtotales.parentNode
            footer.classList.remove("pb-5")

            let ul = document.createElement("ul")
            ul.classList.add("d-flex","flex-row","gap-3","px-4","h-5","m-0","align-items-end","font-monospace","fst-italic")
            for (let [i, cuota] of this.cuotas.entries()){
                let li = document.createElement("li")
                li.classList.add("d-flex","flex-row")
                li.innerHTML = `Cuota ${i+1}: $ ${cuota.toFixed(2)}`
                ul.append(li)
            }
            footer.append(ul)
            
        }

        /* Impresión del TOTAL */
        let li = document.createElement("li")
            li.classList.add("row","px-4","m-0","fw-bold")
            li.innerHTML = `
                <div class="col text-end">TOTAL</div>
                <div class="col-2 d-flex justify-content-between">
                    <span>$</span>
                    <p class="m-0">${this.get_total_factura().toFixed(2)}</p>
                </div>`
        subtotales.append(li)

        let btn_close = modal.querySelector(".btn-close")
        let modal_dialog = modal.querySelector(".modal-dialog")
        btn_close.addEventListener('click', function(){modal.remove()})
        document.addEventListener('keydown',(e) => { if(e.key === 'Escape') modal.remove() })
        modal.addEventListener('click', (e) =>{
            if (!modal_dialog.innerHTML.includes(e.target.outerHTML)){
                modal.remove()
            }
        })
    }
}

class Producto {
    constructor(codigo, descripcion, categoria, precio){
        this.codigo = codigo
        this.descripcion = descripcion
        this.categoría = categoria
        this.precio = precio
    }

    // SETTER
    
    set_precio(precio){
        if (!isNaN(Number(precio))) this.precio = parseFloat(precio)
    }

    set_codigo(codigo){
        if (!(codigo == null || codigo == '')) this.codigo = codigo
    }

    set_descripcion(descripcion){
        if (!(descripcion == null || descripcion == '' || isNaN(Number(this.descripcion)))) this.descripcion = descripcion
    }

    set_categoria(categoria){
        if (!(categoria == null || categoria == '' || isNaN(Number(this.categoria)))) this.categoria = categoria
    }

}

// Declaración de funciones

/* Funciones de clientes */
function crear_cliente(event){
    let form = event.target
    let object = {}

    form.querySelector("#validationMessage") && form.querySelector("#validationMessage").remove()

    for (let elemento of form){
        if (elemento.parentElement.id == "newClientForm") {
            object[elemento.id] = elemento.value
        }
    }
    
    let cliente = new Cliente(null, null, null, null, null, null, null)

    let validation = ''
    validation += cliente.set_razonSocial(object.razonSocial) || '' 
    validation += cliente.set_domicilio(object.domicilio) || '' 
    validation += cliente.set_condicionIVA(object.condicionIVA) || '' 
    validation += cliente.set_tipoDocumento(object.tipoDocumento) || ''
    validation += cliente.set_documento(object.documento) || ''
    validation += cliente.set_email(object.email) || '' 

    if (validation != ''){
        Swal.fire({
            title: '¡Error en el formulario!',
            html: validation,
            icon: 'error',
            confirmButtonText: 'Corregir'
        })
    }
    else return cliente
}
function guardar_cliente(cliente){
    // creo la función guardar cliente porque puede pasar que no quiera guardar el cliente al momento de crearlo
    cliente && clientes.add(cliente)
}

/* Funciones de facturas */
function crear_factura(event, cliente, vendedor){
    let form = event.target
    let object = {}
    let cant = facturas.size + 1

    for (let elemento of form){
        if (elemento.parentElement.id == "invoiceInfo") {
            object[elemento.id] = elemento.value
        }
    }
    
    let factura = new Factura(null, null, null, null, Date(Date.now()), 1, cant)

    // Crear factura
    let validation = ''
    validation += factura.set_proyecto(object.proyecto) || ''
    validation += factura.set_vendedor(vendedor) || '' 
    validation += factura.set_cliente(cliente) || '' 
    if (vendedor.condicionIVA == "Monotributista") factura.set_tipo("B")
    else if (vendedor.condicionIVA == "Responsable Inscripto" && cliente.condicionIVA == "Responsable Inscripto") factura.set_tipo("B")
    else factura.set_tipo("C")
    validation += factura.set_condicionVenta(object.condicionVenta) || '' 
    validation += factura.set_fecha(object.fecha) || '' 

    // Imprimir validación
    if (validation != ''){
        let messageDiv = document.getElementById("swal2-html-container")
        if(messageDiv){
            messageDiv.innerHTML += validation
        }
        else {
            Swal.fire({
                title: '¡Error en el formulario!',
                html: validation,
                icon: 'error',
                confirmButtonText: 'Corregir'
            })
        }
    }
    else {
        facturas.add(factura) //siempre se van a guardar las facturas cuando se crean
        return factura
    }
}
function cargar_impuestos(factura){
    // Ingresar impuestos
    let lista_impuestos = document.querySelector("#impuestosInput")
    lista_impuestos ? lista_impuestos = lista_impuestos.children : lista_impuestos = ''
    if (lista_impuestos) {
        for (let impuesto of lista_impuestos){
            let elementos = impuesto.children
            let nombre_impuesto = elementos[0].value
            let valor_impuesto = elementos[1].value
    
            factura.impuesto(nombre_impuesto, valor_impuesto)
        }
    }
}
function cargar_cuotas(factura){
    // Ingresar cuotas
    let cuotas = document.querySelector('#cantidadCuotas')
    let form = document.querySelector("#newInvoiceForm")
    let validation = ''

    if (cuotas){
        cuotas = parseInt(cuotas.value)
        validation = factura.interes_cuotas(cuotas) || ''
        validation == '' && factura.calculo_cuota(cuotas)
    }

    if (validation != ''){
        let messageDiv = document.getElementById("validationMessage") || document.createElement("div")
        messageDiv.id = "validationMessage"
        messageDiv.innerHTML += validation
        messageDiv.classList.add("border","border-danger","mt-5","rounded","rounded-2")
        form.append(messageDiv)
    }
}
function linea_DOM(factura){
    let section = document.querySelector("#invoices")
    let div = document.createElement("div")
    div.classList.add("linea_factura", "row", "pointer")
    div.innerHTML = `<div class="col-5">${factura.proyecto}</div>
                     <div class="col-1">${factura.cliente.razonSocial}</div>
                     <div class="col d-flex">$<span class="flex-grow-1 text-end">${parseFloat(factura.get_total_factura()).toFixed(2)}</span></div>
                     <div class="col-3">${new Date(factura.fecha).toLocaleDateString("es-AR",{year: 'numeric', month: 'short', day: 'numeric' }).replaceAll(" de ","-")}</div>`

    div.tabIndex = 0
    section.append(div)

    div.addEventListener('click',function(e){
        factura.imprimir_factura()
    })
    div.addEventListener('keydown', function(e) {
        if (e.key == "Enter") {
            factura.imprimir_factura()
        }
    })
    div.addEventListener('keydown', function(e) {
        if (e.key == " ") {
            factura.imprimir_factura()
        }
    })
}

/* Funciones de productos */
function crear_producto(nombre, precio){
    let producto = new Producto(null, null, null, null)
    producto.set_descripcion(nombre)
    producto.set_precio(precio)

    productos.add(producto)

    return producto
}
function buscar_producto(nombre){
    for (let producto of productos){ 
        if (nombre != null && producto.descripcion.toUpperCase() == nombre.toUpperCase()){
            return producto
        }
    }
}
function iniciar_compra(event) {
    let form = event.target
    let productos = []

    let elementos = form.querySelectorAll("#listaCompra li")
    for (let elemento of elementos){
        let n = parseInt(elemento.querySelector('input').value)
        let prod = elemento.querySelector('select').value
        let producto = buscar_producto(prod)
        productos = productos.concat(new Array(n).fill(producto))
    }

    return productos
}

/* Funciones de formulario */
function submit_form(e){
    let cliente = crear_cliente(e)
    guardar_cliente(cliente)
    let factura = crear_factura(e,cliente,vendedor) 
    if (factura){
        factura.cargar_compra(iniciar_compra(e))
        cargar_impuestos(factura)
        cargar_cuotas(factura)
        linea_DOM(factura)
    }

    sessionStorage.removeItem('cant_cuotas')
    localStorage.setItem("clientes", JSON.stringify(Array.from(clientes)))
    localStorage.setItem("facturas", JSON.stringify(Array.from(facturas)))
}
function borrar_linea(event){
    event.target.parentNode.remove()
}

/* Funciones de lista de Detalle */
function crear_linea_compra(){
    let lista = document.querySelector("#newInvoiceForm #listaCompra ul")

    let li = document.createElement("li")
    li.innerHTML = `<select>
                        <option>Descripción</option>
                    </select>
                    <input type="number" id="cantProd" placeholder="Cantidad">
                    <button type="button" class="add">+</button>
                    <button type="button" class="borrar">x</button>`
    lista.append(li)

    let btn_add = li.querySelector('.add')
    let btn_borrar = li.querySelector('.borrar')
    let selection = li.querySelector('select')

    btn_add.addEventListener('click', crear_linea_compra)
    btn_borrar.addEventListener('click', borrar_linea)
    selection.addEventListener('click',cargar_productos, {once: true})
}
function cargar_productos(event){
    let selection = event.target
    for (let producto of productos){
        let option = document.createElement("option")
        option.innerText = producto.descripcion
        selection.append(option)
    }
}

/* Funciones de sección pagos */
function crear_linea_impuestos(){
    let lista = document.querySelector("#newInvoiceForm #impuestosInput")

    let li = document.createElement("li")
    li.className = "impuestoItem"
    li.innerHTML = `<input type="text" class="impuestoNombre" placeholder="Impuesto">
                    <input type="number" class="impuestoPorcentaje" placeholder="Porcentaje">
                    <button type="button" class="add">+</button>
                    <button type="button" class="borrar">x</button>`
    lista.append(li)

    let btn_add = li.querySelector('.add')
    let btn_borrar = li.querySelector('.borrar')

    btn_add.addEventListener('click', crear_linea_impuestos)
    btn_borrar.addEventListener('click', borrar_linea)
}
function mostrar_opcion_impuestos(event){
    let elemento = event.target
    let pagaImpuestos = elemento.checked
    let impuestos = sessionStorage.getItem("impuestos")

    let section = document.querySelector("#newInvoiceForm #impuestosSection")
    let inputs_div = document.createElement("ul")
    inputs_div.id = "impuestosInput"
    inputs_div.innerHTML = `<li class="impuestoItem">
                                <input type="text" class="impuestoNombre" placeholder="Impuesto">
                                <input type="number" class="impuestoPorcentaje" placeholder="Porcentaje">
                                <button type="button" class="add">+</button>
                            </li>`


    if (pagaImpuestos){
        section.append(inputs_div)

        let boton = document.querySelector("#impuestosInput button")

        boton.addEventListener('click', crear_linea_impuestos)
    }
    else{
        let div = document.querySelector("#impuestosInput")
        div && div.remove()
    }
}
function mostrar_opcion_cuotas(event){
    let cant_cuotas = sessionStorage.getItem("cant_cuotas")
    let value = cant_cuotas
    cant_cuotas ? ((parseInt(cant_cuotas)) && (value = cant_cuotas)) : (value = '')
    
    let section_impuestos = document.querySelector("#impuestosSection")
    let payment_section = section_impuestos.parentNode
    let inputs_div = document.createElement("section")
    inputs_div.id = "cuotasInput"
    inputs_div.innerHTML = `<label for="cantidadCuotas">Ingrese la cantidad de cuotas</label>
                            <input type="number" id="cantidadCuotas" placeholder="Cant" value=${value}>`

    if (event.target.value == "Tarjeta de Crédito"){
        payment_section.insertBefore(inputs_div,section_impuestos)

        let cant_element = document.querySelector("#cuotasInput #cantidadCuotas")

        cant_element.addEventListener('input',function(e){
            sessionStorage.setItem("cant_cuotas",e.target.value)
        })
    }
    else{
        let div = document.querySelector("#cuotasInput")
        div && div.remove()
    }
}

// VARIABLES GLOBALES
let productos = new Set()
let clientes = new Set()
let facturas = new Set()
let vendedor = new Vendedor("CoderHouse SRL", "El Salvador 5212 - Oficina 308 - Palermo Ciudad Autónoma de Buenos Aires CP 1414","RESPONSABLE INSCRIPTO", "CUIT", 30714528749, 30714528749, new Date('01/09/2014'))

// Iniciación de objetos
fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(data => data.forEach( 
            elem => {
                let prod = crear_producto(elem.title, elem.price)
                prod.set_categoria(elem.category)
                prod.set_codigo(elem.id)}))

// Ejecución
let data_fact = localStorage.getItem('facturas')
if (data_fact) {
    let facturasArray = JSON.parse(data_fact)
    facturas = new Set(facturasArray.map(factura => {
        let fact = new Factura(factura.proyecto, factura.vendedor, factura.cliente, factura.tipo, factura.fecha, factura.puntoVenta, factura.num, factura.condicionVenta)
        
        fact.estado = factura.estado
        fact.compra = factura.compra
        fact.total_compra = factura.total_compra
        fact.impuestos = factura.impuestos
        fact.total_impuestos = factura.total_impuestos
        fact.cuotas = factura.cuotas
        fact.total_financiacion = factura.total_financiacion

        let cliente = new Cliente(factura.cliente.razonSocial, factura.cliente.domicilio, factura.cliente.condicionIVA, factura.cliente.tipoDocumento, factura.cliente.documento, factura.cliente.email)
        fact.cliente = cliente

        return fact
    }))
}

let data_client = localStorage.getItem('clientes')
if (data_client) {
    let clientesArray = JSON.parse(data_client)
    clientes = new Set(clientesArray.map(cliente => {
        let cli = new Cliente(cliente.razonSocial, cliente.domicilio, cliente.condicionIVA, cliente.tipoDocumento, cliente.documento, cliente.email)

        cli.estado = cliente.estado
        cli.compra = cliente.compra
        cli.total_compra = cliente.total_compra
        cli.impuestos = cliente.impuestos
        cli.total_impuestos = cliente.total_impuestos
        cli.cuotas = cliente.cuotas
        cli.total_financiacion = cliente.total_financiacion

        return cli
    }))
}

for (let factura of facturas){
    linea_DOM(factura)
}

let btn_add = document.querySelector("#newInvoiceForm .add")
btn_add.addEventListener('click', crear_linea_compra)

let newInvoiceForm = document.querySelector("#newInvoiceForm")
newInvoiceForm.addEventListener('submit', submit_form)

let selection = document.querySelector("#newInvoiceForm #listaCompra select")
selection.addEventListener('focus', cargar_productos, {once: true})

let financiadoInput = document.querySelector("#condicionVenta")
financiadoInput.addEventListener('change', mostrar_opcion_cuotas)

let pagaImpuestosCheckbox = document.querySelector("#pagaImpuestos")
pagaImpuestosCheckbox.addEventListener('click',mostrar_opcion_impuestos)