// SEGUNDA ENTREGA - SIMULADOR FACTURACIÓN

// VARIABLES GLOBALES
let productos = new Set()
let clientes = new Set()
let facturas = new Set()

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
        else alert("Razón social no válida")
    }

    set_domicilio(domicilio){
        if (Number.isNaN(Number(domicilio))) this.domicilio = domicilio
        else alert("Domicilio no válido")
    }

    set_condicionIVA(condicionIVA){
        condicionIVA = condicionIVA.toUpperCase()
        if (condicionIVA == "CONSUMIDOR FINAL" ||
            condicionIVA == "MONOTRIBUTISTA" ||
            condicionIVA == "RESPONSABLE INSCRIPTO"){
            this.condicionIVA = condicionIVA
        }
        else alert("Condición de respecto al IVA no válida")
    }

    set_tipoDocumento(tipoDocumento){
        if (Number.isNaN(Number(tipoDocumento))) this.tipoDocumento = tipoDocumento
        else alert("Tipo de documento no válido")
    }

    set_documento(documento){
        documento = Number(documento)
        if (!Number.isNaN(documento)) this.documento = parseInt(documento)
        else alert("Documento no válido")
    }    
}

class Cliente extends Parte{
    constructor(razonSocial, domicilio, condicionIVA, tipoDocumento, documento, email){
        super(razonSocial, domicilio, condicionIVA, tipoDocumento, documento)
        this.email = email
    }

    // SETTERS
    set_email(email){
        email = email.toLowerCase()
        if (!email.includes('@')) alert("Correo no válido")
        else{

            let correo = email.split('@')

            if (correo[0] == '') alert("Correo no válido")
            else{

                if (!correo[1].includes('.')) alert("Correo no válido")
                else {

                    let finCorreo = correo[1].split('.')
                    if (finCorreo == '') alert("Correo no válido")
                    else{

                        if (!finCorreo.slice(1,).includes('com')) alert("Correo no válido")
                        else {
                            this.email = email
                        }
                    }
                }
            }
        }
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
        else alert("Ingresos Brutos no válido")
    }

    set_inicioActividades(inicioActividades){
        let fecha = Date.parse(inicioActividades)
        if (isNaN(fecha)) alert ("Fecha no válida")
        else this.inicioActividades = fecha
    }
}

class Factura {
    constructor(vendedor, cliente, tipo, fecha, puntoVenta, num, condicionVenta){
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
    set_vendedor(vendedor){
        if (vendedor instanceof Vendedor) this.vendedor = vendedor
        else alert("Vendedor no válido")
    }
    set_cliente(cliente){
        if (cliente instanceof Cliente) this.cliente = cliente
        else alert("Cliente no válido")
    }    
    set_tipo(tipo){
        if (tipo == "A" ||
            tipo == "B" ||
            tipo == "C") this.tipo = tipo.toUpperCase()
        else alert("Tipo de factura no válido")
    }
    set_fecha(fecha){
        let fechaFact = Date.parse(fecha)
        statement = isNaN(fechaFact)
        if (statement) alert ("Fecha no válida")
        else this.fecha = fechaFact
    }
    set_estado(estado){
        estado = estado.toUpperCase
        if (estado == "BORRADOR" ||
            estado == "SIN ENVIAR" ||
            estado == "ENVIADA" ||
            estado == "PAGADA") this.estado = estado
        else alert("Estado de factura no válido")
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
        else alert("Condición de Venta no válida")
    }

    // GETTER
    get_total_factura(){
        return this.total_compra + this.total_impuestos + this.total_financiacion
    }

    // MÉTODOS
    total_factura(){ 
        let total = 0
        if (this.compra.length == 0) {
            alert("Factura vacía")
        } else{
            this.compra.forEach(el => {
                total += el.subtotal
            })
        }

        this.total_compra = total

        return total
    }
    
    impuesto(nombre_impuesto,porcentaje_impuesto){
        if (this.total_compra == 0) alert("Compra no cargada")
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
                    alert("Solo 3, 6, 9 o 12 cuotas");
                    break
        }
        this.total_financiacion = interes

        return parseFloat(interes.toFixed(2))
    }
    
    calculo_cuota(cuotas){
        if (this.total_financiacion != this.interes_cuotas(cuotas)) {
            this.total_financiacion = this.interes_cuotas(cuotas)
        }
        
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
        
        return compra
    }

    imprimir_factura(){
        console.log("\n\nFACTURA DE " + this.cliente.razonSocial.toUpperCase() + "\n\n\n")

        console.log(` Cód  |   Descripción   | Cant |   Precio   |  Subtotal `)
        this.compra.forEach(prod => {
            let codigo
            let descripcion
            let cant
            let precio
            let subtotal

            if (prod.codigo == null) {codigo = ' '} else {codigo = prod.codigo} 
            if (prod.descripcion == null) {descripcion = ' '} else {descripcion = prod.descripcion} 
            if (prod.cantidad == null) {cant = 0} else {cant = prod.cantidad} 
            if (prod.precio == null) {precio = 0} else {precio = parseFloat(prod.precio).toFixed(2)} 
            if (prod.subtotal == null) {subtotal = 0} else {subtotal = parseFloat(prod.subtotal).toFixed(2)} 

            console.log(`${codigo.toString().padStart(5,' ')} | ${descripcion.toString().padEnd(15)} | ${cant.toString().padStart(4)} | $${precio.toString().padStart(9,' ')} | $${subtotal.toString().padStart(9,' ')}`)
        })

        console.log('-'.repeat(56))
        
        console.log('Total factura '.padStart(46,' ')+`$${parseFloat(this.total_compra).toFixed(2).toString().padStart(9,' ')}`)
        
        this.impuestos.forEach(imp => {
            let impuesto
            let monto

            if (imp[0] == null) {impuesto = ' '} else {impuesto = imp[0]}
            if (imp[1] == null) {monto = 0} else {monto = imp[1]}

            console.log(`${impuesto.toString().toUpperCase().padStart(45,' ')} $${parseFloat(monto).toFixed(2).toString().padStart(9,' ')}`)
        })

        console.log('Total con impuestos '.padStart(46,' ')+`$${parseFloat(this.total_compra + this.total_impuestos).toFixed(2).toString().padStart(9,' ')}`)

        if (this.total_financiacion > 0){
            console.log('Interés '.padStart(46,' ')+`$${parseFloat(this.total_financiacion).toFixed(2).toString().padStart(9,' ')}`)

            console.log('\n')

            console.log('TOTAL '.padStart(46,' ')+`$${parseFloat(this.get_total_factura()).toFixed(2).toString().padStart(9,' ')}`)

            console.log('\n')

            for (let i = 0; i < this.cuotas.length; i++){
                console.log('Cuota '.padStart(43,' ')+`${(i+1).toString().padStart(2,' ')} $${(this.cuotas[i]).toString().padStart(9,' ')}`)
            }
        }
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
        if (isNaN(Number(precio))) alert("Precio no válido")
        else this.precio = parseFloat(precio)
    }

    set_codigo(codigo){
        if (codigo == null || codigo == '') prompt("Código no válido")
        else this.codigo = codigo
    }

    set_descripcion(descripcion){
        if (descripcion == null || descripcion == '' || isNaN(Number(this.descripcion))) {
            alert("Descripción no válida")
        }
        else this.descripcion = descripcion
    }

    set_categoria(categoria){
        if (categoria == null || categoria == '' || isNaN(Number(this.categoria))) {
            alert("Categoría no válida")
        }
        else this.categoria = categoria
    }

}

// Declaración de funciones

/* Funciones de clientes */
function crear_cliente(razonSocial, domicilio, condicionIVA, tipoDocumento, documento, email){
    let cliente = new Cliente(null, null, null, null, null, null, null)
    cliente.set_razonSocial(razonSocial)
    cliente.set_domicilio(domicilio)
    cliente.set_condicionIVA(condicionIVA)
    cliente.set_tipoDocumento(tipoDocumento)
    cliente.set_documento(documento)
    cliente.set_email(email)

    return cliente
}
function guardar_cliente(cliente){
    // creo la función guardar cliente porque puede pasar que no quiera guardar el cliente al momento de crearlo
    clientes.add(cliente)
}

/* Funciones de facturas */
function crear_factura(vendedor, cliente, tipo, condicionVenta){
    cant = facturas.size + 1

    let factura = new Factura(null, null, null, Date(Date.now()), 1, cant)
    factura.set_vendedor(vendedor)
    factura.set_cliente(cliente)
    factura.set_tipo(tipo)
    switch(parseInt(condicionVenta)){
        case 1:
            condicionVenta = "TRANSFERENCIA"
            break
        case 2:
            condicionVenta = "EFECTIVO"
            break
        case 3:
            condicionVenta = "TARJETA DE CRÉDITO"
            break
        case 4:
            condicionVenta = "TARJETA DE DÉBITO"
            break
        default:
            break
    }
    factura.set_condicionVenta(condicionVenta)

    facturas.add(factura) //siempre se van a guardar las facturas cuando se crean

    return factura
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
    for (producto of productos){ 
        if (nombre != null && producto.descripcion.toUpperCase() == nombre.toUpperCase()){
            return producto
        }
    }
}
function iniciar_compra() {
    let lista = []
    do{
        prod = prompt("Ingrese el producto que desea comprar")
        producto = buscar_producto(prod)
        if (producto){
            lista.push(producto)
        } 
    } while (prod != '' && prod != null)
    return lista
}

// Iniciación de objetos
crear_producto("Manzana", 800)
crear_producto("Banana", 300)
crear_producto("Pera", 280)
crear_producto("Uva", 600)
crear_producto("Durazno", 700)
crear_producto("Naranja", 400)

let vendedor = new Vendedor("CoderHouse SRL", "El Salvador 5212 - Oficina 308 - Palermo Ciudad Autónoma de Buenos Aires CP 1414","RESPONSABLE INSCRIPTO", "CUIT", 30714528749, 30714528749, new Date('01/09/2014'))

let cliente = crear_cliente(
    prompt("Ingrese Razon Social"),
    prompt("Ingrese Domicilio"),
    prompt("Ingrese Condicion frente al IVA"),
    prompt("Ingrese Tipo de Documento"),
    prompt("Ingrese N° de Documento"),
    prompt("Ingrese email"))

guardar_cliente(cliente)

let listaCompra = iniciar_compra()

let factura1 = crear_factura(vendedor,cliente,"B", prompt("Ingrese la condición de venta\n1- TRANSFERENCIA\n2- EFECTIVO\n3- TARJETA DE CRÉDITO\n4- TARJETA DE DÉBITO"))
    factura1.cargar_compra(listaCompra)
    factura1.total_factura()

/* Impuestos */
impuesto = prompt("¿Paga impuestos? Ingrese 'S'").toUpperCase()

if (impuesto == "S"){
    do{
        factura1.impuesto(prompt ("Ingrese el nombre del impuesto"),prompt ("Ingrese el porcentaje del impuesto"))
        otro = prompt("Ingrese 'S' si de desea ingresar otro impuesto").toUpperCase()
    } while(otro == "S")
}

/* Financiación */
if (factura1.condicionVenta == "TARJETA DE CRÉDITO") {
    financiacion = prompt("¿Paga en cuotas? Ingrese 'S'").toUpperCase()
    
    if (financiacion == "S"){
        do{
            cuotas = parseInt(prompt("¿En cuántas cuotas abona?"))
            interes = factura1.interes_cuotas(cuotas)
            valores = factura1.calculo_cuota(cuotas)
        } while (interes == 0 && cuotas != 1)
    }
}

factura1.imprimir_factura()