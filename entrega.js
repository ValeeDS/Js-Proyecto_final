// PRIMERA ENTREGA - SIMULADOR FACTURACIÓN

//Declaración de variables
let cliente = "Juan"
let nombre_producto = "Producto"
let precio_producto = 0
let total_productos = 0
let total_impuestos = 0
let total_interes = 0
let total_factura = 0
let cuota_monto = 0
let cant_cuota = 0


//Declaración de funciones
function validar_precio(precio){
    while (isNaN(parseInt(precio))) {
        precio = prompt("Precio no válido, ingreselo nuevamente")
    }
    return parseFloat(precio)
}

function input_producto(nombre,precio){
    nombre_producto= nombre
    precio_producto = validar_precio(precio)
    console.log("Ingresó: " + nombre_producto + " a $" + precio_producto)
}

function suma_producto(precio){
    total_productos += precio
    return total_productos
}

function impuesto(nombre_impuesto,porcentaje_impuesto){
    let monto_impuesto = total_factura * porcentaje_impuesto/100
    total_impuestos += monto_impuesto
    console.log(nombre_impuesto + ": $" + monto_impuesto)
    return total_impuestos
}

function interes_cuotas(cuotas, total){
    let interes = 0
    {
        while(cuotas !== 3 && cuotas !== 6 && cuotas !== 9 && cuotas !== 12) {
            alert("Solo 3, 6, 9 o 12 cuotas");
            cuotas = parseInt(prompt("Intente nuevamente"));
        }
        switch(cuotas) {
            case 3:
                interes = total * 0.15;
                break;
            case 6:
                interes = total * 0.25;
                break;
            case 9:
                interes = total * 0.35;
                break;
            case 12:
                interes = total * 0.45;
                break;
        }
    }
    return parseFloat(interes.toFixed(2))
}

function calculo_cuota(monto, cuotas){
    let cuota = monto / cuotas
    cuota = parseFloat(cuota.toFixed(2))

    if ((cuota * cuotas) < monto ) {
        for (let i = 1 ; i <= cuotas ; i++) {
            if(i == 1){
                let cuota_uno = cuota + (monto - (cuota * cuotas))
                cuota_uno = parseFloat(cuota_uno.toFixed(2))
                console.log(`Cuota ${i} de \$${cuota_uno}`)
            } else{
                console.log(`Cuota ${i} de \$${cuota}`)
            }
        }
    }
    return cuota
}

// EJECUCIÓN
console.log("\n\nFACTURA DE " + cliente.toUpperCase() + "\n\n\n")

do{
    input_producto(
        prompt("Ingrese el nombre del producto"),
        prompt("Ingrese el precio del producto"))
    
    suma_producto(precio_producto)
    otro = prompt("Ingrese 'S' si de desea ingresar otro producto").toUpperCase()
} while(otro == "S")

total_factura += total_productos

console.log(`\n\nTotal de la factura: \$${total_factura}`)

/* Impuestos */
paga_impuesto = prompt("¿Paga impuestos? Ingrese 'S").toUpperCase()

if (paga_impuesto == "S"){
    do{
        impuesto(
            prompt("Ingrese el nombre del impuesto"),
            prompt("Ingrese el porcentaje del impuesto"))
        
        otro = prompt("Ingrese 'S' si de desea ingresar otro impuesto").toUpperCase()
    } while(otro == "S")

    total_factura += total_impuestos

    total_factura = parseFloat((Math.floor(total_factura * 100) / 100).toFixed(2))

    console.log(`Total con impuestos: \$${total_factura}`)
}

paga_cuotas = prompt("¿Paga en cuotas?").toUpperCase()

if (paga_cuotas == "SÍ" ||
    paga_cuotas == "SI" ||
    paga_cuotas == "S"){
    cant_cuota = parseInt(prompt("Ingrese la cantidad de cuotas"))

    total_interes = interes_cuotas(cant_cuota,total_factura)

    total_factura += parseFloat((Math.floor(total_interes * 100) / 100).toFixed(2))

    console.log(`\n\nTotal en cuotas: \$${total_factura}`)
    cuota_monto = calculo_cuota(total_factura, cant_cuota)
}