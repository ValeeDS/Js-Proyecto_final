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
        modal.setAttribute("data-modal-placement","top-center")
        modal.setAttribute("aria-hidden","true")
        modal.tabIndex = -1
        modal.classList.add("fixed","top-0","left-0","right-0","z-50","w-full","p-4","overflow-x-hidden","overflow-y-auto","md:inset-0","h-[calc(100%-1rem)]","md:h-full","backblur","justify-center","items-top","flex")
        modal.innerHTML = 
        `<div class="modal-dialog relative h-full w-fit md:h-auto">
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow max-h-[calc(100vh-2rem)] overflow-y-scroll">
                <button type="button" class="btn-close absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-hide="crypto-modal">
                    <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
                    <span class="sr-only">Close modal</span>
                </button>
                <!-- Modal header -->
                <div class="px-6 py-4 border-b rounded-t sticky top-0 bg-white z-20  shadow-sm"><h4 class="text-base font-semibold text-gray-900 lg:text-xl">Factura: ${this.puntoVenta.toString().padStart(4,'0')}-${this.num.toString().padStart(8,'0')}</h4></div>
                <!-- Modal body -->
                <div class="p-4">
                    <div class="border A4 flex flex-col shadow-inner">
                        <header class="rounded-3xl rounded-t-none bg-orange-400 relative pb-4 mb-12 text-white z-0">
                            <div class="flex pb-4 px-6">
                                <div class="flex flex-[1_1_0%] justify-center items-end">Logo</div>
                                <div class="flex flex-col border border-white shrink text-center square justify-center mx-12">
                                    <p class="text-4xl leading-tight font-medium mb-2">${this.tipo}</p>
                                    <p class="text-base">Cod. 06</p>
                                </div>
                                <div class="flex flex-[1_1_0%] flex-col content-center">
                                    <p class="text-base leading-4 font-medium mb-2">Factura</p>
                                    <p class="m-0"><span class="font-semibold">N°</span> ${this.puntoVenta.toString().padStart(4,'0')}-${this.num.toString().padStart(8,'0')}</p>
                                    <p class="m-0"><span class="font-semibold">Fecha:</span> ${new Date(this.fecha).toLocaleDateString(undefined,{year: 'numeric', month: 'numeric', day: 'numeric'})}</p>
                                </div>
                            </div>
                            <div class="px-6 flex flex-row m-0">
                                <div class="w-7/12">
                                    <p class="m-0"><span class="font-semibold">Razón Social:</span> ${this.vendedor.razonSocial}</p>
                                    <p class="m-0"><span class="font-semibold">Domicilio:</span> ${this.vendedor.domicilio}</p>
                                    <p class="m-0"><span class="font-semibold">Condición frente al IVA:</span> ${this.vendedor.condicionIVA}</p>
                                </div>
                                <div class="flex flex-col w-5/12">
                                    <p class="m-0"><span class="font-semibold">${this.vendedor.tipoDocumento}</span> ${this.vendedor.documento}</p>
                                    <p class="m-0"><span class="font-semibold">Ingresos Brutos:</span> ${this.vendedor.ingresosBrutos}</p>
                                    <p class="m-0"><span class="font-semibold">Inicio de Actividades:</span> ${new Date(this.vendedor.inicioActividades).toLocaleDateString(undefined,{year: 'numeric', month: 'numeric', day: 'numeric'})}</p>
                                    <a href="https://www.coderhouse.com/" referrerpolicy="no-referrer" target="_blank" class="flex grow items-end">https://www.coderhouse.com/</a>
                                </div>
                            </div>
                        </header>
                        <section class="px-6 flex flex-row m-0 mb-12">
                            <div class="w-7/12">
                                <p class="m-0"><span class="font-semibold">Cliente:</span> ${this.cliente.razonSocial}</p>
                                <p class="m-0"><span class="font-semibold">Domicilio:</span> ${this.cliente.domicilio}</p>
                                <p class="m-0"><span class="font-semibold">Condición frente al IVA:</span> ${this.cliente.condicionIVA}</p>
                            </div>
                            <div class="w-5/12">
                                <p class="m-0"><span class="font-semibold">Documento:</span> ${this.cliente.tipoDocumento} ${this.cliente.documento}</p>
                                <p class="m-0"><span class="font-semibold">Email:</span> <a href="mailto:${this.cliente.email}">${this.cliente.email}</a></p>
                                <p class="m-0"><span class="font-semibold">Condición de venta:</span> ${this.cliente.condicionVenta}</p>
                            </div>
                        </section>
                        <section class="grow flex flex-col">
                            <header class="flex flex-row border border-l-0 border-r-0 border-orange-400 px-6 m-0 font-semibold">
                                <div class="w-1/12">CÓD</div>
                                <div class="w-6/12">DESCRIPCIÓN</div>
                                <div class="w-1/12">CANT</div>
                                <div class="w-2/12">PRECIO</div>
                                <div class="w-2/12">TOTAL</div>
                            </header>
                            <div id="tablaDetalle" class="grow border-b border-orange-400">
                                
                            </div>
                            <footer class="mb-12 pb-12">
                                <ul id="subtotales" class="m-0 p-0">
                                    <li class="flex flex-row px-6 m-0 font-semibold">
                                        <div class="w-10/12 px-4 text-end">Subtotal</div>
                                        <div class="w-2/12 flex content-between">
                                            <span>$</span>
                                            <p class="m-0 grow px-2 text-end">${this.total_compra.toFixed(2)}</p>
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
            div.classList.add("flex","flex-row","px-6","m-0","text-center")
            div.innerHTML = `
                <div class="w-1/12">${producto.codigo}</div>
                <div class="w-6/12 text-start">${producto.descripcion}</div>
                <div class="w-1/12">${producto.cantidad}</div>
                <div class="w-2/12 flex content-between">
                    <span>$</span>
                    <p class="m-0 grow px-2 text-end">${producto.precio.toFixed(2)}</p>
                </div>
                <div class="w-2/12 flex content-between">
                    <span>$</span>
                    <p class="m-0 grow px-2 text-end">${producto.subtotal.toFixed(2)}</p>
                </div>`
            tabla.append(div)
        }

        let subtotales = modal.querySelector("#subtotales")

        /* Impresión de los impuestos */
        if (this.total_impuestos) {
            for (let impuesto of this.impuestos){
                let li = document.createElement("li")
                li.classList.add("flex","flex-row","px-6","m-0")
                li.innerHTML = `
                    <div class="w-10/12 px-4 text-end">${impuesto[0]}</div>
                    <div class="w-2/12 flex content-between">
                        <span>$</span>
                        <p class="m-0 grow px-2 text-end">${impuesto[1].toFixed(2)}</p>
                    </div>`
                subtotales.append(li)
            }

            let li = document.createElement("li")
            li.classList.add("flex","flex-row","px-6","m-0","fw-semibold")
                li.innerHTML = `
                <div class="w-10/12 px-4 text-end">Subtotal con impuestos</div>
                <div class="w-2/12 flex content-between">
                    <span>$</span>
                    <p class="m-0 grow px-2 text-end">${(this.total_impuestos + this.total_compra).toFixed(2)}</p>
                </div>`
            subtotales.append(li)
        }
        
        /* Impresión de la financiación */
        if(this.total_financiacion){
            let li = document.createElement("li")
            li.classList.add("flex","flex-row","px-6","m-0")
            li.innerHTML = `
                <div class="w-10/12 px-4 text-end">Interés por financiación</div>
                <div class="w-2/12 flex content-between">
                    <span>$</span>
                    <p class="m-0 grow px-2 text-end">${this.total_financiacion.toFixed(2)}</p>
                </div>`
            subtotales.append(li)

            let footer = subtotales.parentNode
            footer.classList.remove("pb-12")

            let ul = document.createElement("ul")
            ul.classList.add("flex","flex-row","gap-4","px-6","min-h-[3rem]","m-0","items-end","font-mono","italic")
            for (let [i, cuota] of this.cuotas.entries()){
                let li = document.createElement("li")
                li.classList.add("flex","flex-row")
                li.innerHTML = `Cuota ${i+1}: $ ${cuota.toFixed(2)}`
                ul.append(li)
            }
            footer.append(ul)
            
        }

        /* Impresión del TOTAL */
        let li = document.createElement("li")
            li.classList.add("flex","flex-row","px-6","m-0","font-bold")
            li.innerHTML = `
                <div class="w-10/12 px-4 text-end">TOTAL</div>
                <div class="w-2/12 flex content-between">
                    <span>$</span>
                    <p class="m-0 grow px-2 text-end">${this.get_total_factura().toFixed(2)}</p>
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
        if (elemento.parentElement.id == "newClientForm" || elemento.parentElement.parentElement.id == "newClientForm" ) {
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
        if (elemento.parentElement.parentElement.id == "invoiceInfo") {
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
        return factura
    }
}
function linea_DOM(factura){
    facturas.add(factura)

    let section = document.querySelector("#invoices")
    let li = document.createElement("li")
    li.classList.add("linea_factura","flex","flex-row","px-4","w-full","gap-4","py-3","items-center","border-t-2","border-orange-50","first:border-0","cursor-pointer")
    li.innerHTML = `<div class="grow">${factura.proyecto}</div>
                     <div class="min-w-fit max-w-[10rem]">${factura.cliente.razonSocial}</div>
                     <div class="w-20 flex">$<span class="grow text-end">${parseFloat(factura.get_total_factura()).toFixed(2)}</span></div>
                     <div class="w-24 text-center">${new Date(factura.fecha).toLocaleDateString("es-AR",{year: 'numeric', month: 'short', day: 'numeric' }).replaceAll(" de ","-")}</div>`

    li.tabIndex = 0
    section.append(li)

    li.addEventListener('click',function(e){
        factura.imprimir_factura()
    })
    li.addEventListener('keydown', function(e) {
        if (e.key == "Enter") {
            factura.imprimir_factura()
        }
    })
    li.addEventListener('keydown', function(e) {
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
        if (cargar_cuotas(factura)) linea_DOM(factura)
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
    li.classList.add("max-w-full","flex","gap-2")
    li.innerHTML = `<select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 py-1">
                        <option>Descripción</option>
                    </select>
                    <input type="number" placeholder="Cantidad" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-orange-500 focus:border-orange-500 block w-20 p-2.5 py-1">
                    <button type="button" class="add h-8 w-8 shrink-0 rounded-full bg-orange-400 hover:bg-orange-500 focus:ring-3 focus:bg-orange-500 focus:ring-orange-600">+</button>
                    <button type="button" class="borrar h-8 w-8 shrink-0 rounded-full bg-red-500 hover:bg-red-600">x</button>`
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
    li.classList.add("max-w-full","flex","gap-2")
    li.innerHTML = `<input type="text" class="impuestoNombre bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-orange-500 focus:border-orange-500 block w-50 p-2.5 py-1" placeholder="Impuesto">
                    <input type="number" class="impuestoPorcentaje bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-orange-500 focus:border-orange-500 block w-20 p-2.5 py-1" placeholder="Porcentaje">
                    <button type="button" class="add h-8 w-8 shrink-0 rounded-full bg-orange-400 hover:bg-orange-500 focus:ring-3 focus:bg-orange-500 focus:ring-orange-600">+</button>
                    <button type="button" class="borrar h-8 w-8 shrink-0 rounded-full bg-red-500 hover:bg-red-600">x</button>`
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
    inputs_div.classList.add("flex","max-w-full","flex-col","gap-1")
    inputs_div.id = "impuestosInput"
    inputs_div.innerHTML = `<li class="impuestoItem max-w-full flex gap-2">
                                <input type="text" class="impuestoNombre bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-orange-500 focus:border-orange-500 block w-50 p-2.5 py-1" placeholder="Impuesto">
                                <input type="number" class="impuestoPorcentaje bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-orange-500 focus:border-orange-500 block w-20 p-2.5 py-1" placeholder="Porcentaje">
                                <button type="button" class="add h-8 w-8 shrink-0 rounded-full bg-orange-400 hover:bg-orange-500 focus:ring-3 focus:bg-orange-500 focus:ring-orange-600">+</button>
                                <button type="button" class="borrar h-8 w-8 shrink-0 rounded-full bg-transparent" disabled></button>
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
    inputs_div.classList.add("max-w-full","flex","gap-2","items-center")
    inputs_div.innerHTML = `<label for="cantidadCuotas" class="text-sm font-medium text-gray-900">Ingrese la cantidad de cuotas</label>
                            <input type="number" id="cantidadCuotas" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-orange-500 focus:border-orange-500 block w-20 p-2.5 py-1" placeholder="Cant" value=${value}>`

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

fetch('https://dummyjson.com/products')
        .then(res => res.json())
        .then(data => data.products.forEach( 
            elem => {
                let prod = crear_producto(elem.title, elem.price)
                prod.set_categoria(elem.category)
                prod.set_codigo(elem.id)}))

crear_producto("Manzana", 800)
crear_producto("Banana", 300)
crear_producto("Pera", 280)
crear_producto("Uva", 600)
crear_producto("Durazno", 700)
crear_producto("Naranja", 400)

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