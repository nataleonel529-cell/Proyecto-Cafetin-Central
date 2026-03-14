// --- DATOS INICIALES ---
const PRODUCTOS_INICIALES = [
    { n: "Empanada Queso", p: 1.50, c: "Comida", i: "imagenes/empanada.jpg" },
    { n: "Cachito Jamón", p: 2.00, c: "Comida", i: "imagenes/cachito.jpg" },
    { n: "Café Marrón", p: 1.00, c: "Bebida", i: "imagenes/cafe.jpg" },
    { n: "Nestea Durazno", p: 1.20, c: "Bebida", i: "imagenes/nestea-durazno.jpg" },
    { n: "Dona Glaseada", p: 1.25, c: "Postre", i: "imagenes/donas-glaseadas.jpg" },
    { n: "Torta Chocolate", p: 2.50, c: "Postre", i: "imagenes/torta-chocolate.jpg" },
    { n: "Cheesecake", p: 3.00, c: "Postre", i: "imagenes/cheescake.jpg" },
    { n: "Dona Rellena", p: 1.50, c: "Postre", i: "imagenes/donas-rellenas.jpg" },
    { n: "Jugo de Fresa", p: 1.75, c: "Bebida", i: "imagenes/jugo-fresa.jpg" },
    { n: "Jugo de Parcha", p: 1.75, c: "Bebida", i: "imagenes/jugo.jpg" }
];

const RESENAS_INICIALES = [
    { u: "@perez_ucv", t: "¡Las empanadas son geniales!" },
    { u: "@maria_ciencias", t: "El café me salva la vida." }
];

const HISTORIAL_SOLO_CLIENTE = [
    { nombre: "ClienteUCV", monto: "$4.50", items: "2x Empanada Queso, 1x Café Marrón" },
    { nombre: "ClienteUCV", monto: "$3.00", items: "1x Cheesecake" }
];

// --- ESTADO ---
var prod_nombres = []; var prod_precios = []; var prod_categorias = []; var prod_imagenes = [];
var resena_usuarios = []; var resena_textos = [];
var car_nombres = []; var car_precios = []; var car_cantidades = [];
var hist_compras = [];
var datosCliente = { nombre: "", cedula: "", listo: false };

// --- REINICIO ---
function restaurarSistema() {
    prod_nombres = PRODUCTOS_INICIALES.map(x => x.n);
    prod_precios = PRODUCTOS_INICIALES.map(x => x.p);
    prod_categorias = PRODUCTOS_INICIALES.map(x => x.c);
    prod_imagenes = PRODUCTOS_INICIALES.map(x => x.i);
    resena_usuarios = RESENAS_INICIALES.map(x => x.u);
    resena_textos = RESENAS_INICIALES.map(x => x.t);
    hist_compras = [];
    car_nombres = []; car_precios = []; car_cantidades = [];
    datosCliente = { nombre: "", cedula: "", listo: false };
}

restaurarSistema();

// --- SISTEMA DE LOGIN ---
function intentarLogin() {
    var u = document.getElementById("user-field").value.trim();
    var p = document.getElementById("pass-field").value.trim();
    
    if (u == "ClienteUCV" && p == "Central_123") { 
        hist_compras = JSON.parse(JSON.stringify(HISTORIAL_SOLO_CLIENTE));
        irA("vista-cliente"); dibujarMenu(); dibujarResenas(); 
    } 
    else if (u == "caja_01" && p == "Cajero#123") { 
        datosCliente = { nombre: "Cliente", cedula: "12.345.678", listo: true };
        car_nombres = ["Empanada Queso", "Nestea Durazno"]; car_precios = [1.50, 1.20]; car_cantidades = [2, 1]; 
        irA("vista-caja"); dibujarCaja(); 
    } 
    else if (u == "adminRoot" && p == "cafetinAdmin") {
        irA("vista-admin"); dibujarAdminProds(); dibujarAdminResenas();
    }
    else { lanzarMensaje("ACCESO DENEGADO"); }
}

function cerrarSesion() {
    restaurarSistema();
    document.getElementById("user-field").value = "";
    document.getElementById("pass-field").value = "";
    irA("vista-login");
}

// --- ADMINISTRADOR ---
function dibujarAdminProds() {
    var h = "";
    for (var i = 0; i < prod_nombres.length; i++) {
        h += `<div style="display:flex; justify-content:space-between; background:#f0f0f0; padding:8px; margin-bottom:5px; border-radius:8px; font-size:0.75rem;">
                <span>${prod_nombres[i]} ($${prod_precios[i].toFixed(2)})</span>
                <button onclick="eliminarProducto(${i})" style="color:red; border:none; background:none; cursor:pointer;">X</button>
              </div>`;
    }
    document.getElementById("admin-lista").innerHTML = h;
}

function crearProducto() {
    var n = document.getElementById("adm-nombre").value.trim();
    var p = parseFloat(document.getElementById("adm-precio").value);
    if (n && !isNaN(p)) {
        prod_nombres.push(n); prod_precios.push(p); prod_categorias.push("Comida"); prod_imagenes.push("imagenes/default.jpg");
        dibujarAdminProds();
    }
    document.getElementById("adm-nombre").value = ""; document.getElementById("adm-precio").value = "";
}

function eliminarProducto(idx) {
    prod_nombres.splice(idx, 1); prod_precios.splice(idx, 1);
    dibujarAdminProds();
}

function dibujarAdminResenas() {
    var h = "";
    for (var i = 0; i < resena_usuarios.length; i++) {
        h += `<div style="background:white; padding:8px; margin-bottom:5px; border-radius:8px; font-size:0.7rem; border-left:3px solid #000;">
                <b>${resena_usuarios[i]}</b>: ${resena_textos[i]}<br>
                <button onclick="eliminarResena(${i})" style="color:red; border:none; background:none; cursor:pointer;">[Eliminar]</button>
              </div>`;
    }
    document.getElementById("admin-resenas").innerHTML = h;
}

function eliminarResena(idx) {
    resena_usuarios.splice(idx, 1); resena_textos.splice(idx, 1);
    dibujarAdminResenas();
}

// --- CLIENTE ---
function dibujarMenu() {
    var cont = document.getElementById("contenedor-menu");
    var html = ""; var cats = ["Comida", "Bebida", "Postre"];
    cats.forEach(cat => {
        html += `<h3 style="border-left:5px solid #2C2C2C; padding-left:10px; margin-top:15px; font-size:0.8rem;">${cat.toUpperCase()}</h3><div class="grid-menu">`;
        prod_nombres.forEach((n, i) => {
            if (prod_categorias[i] === cat) {
                html += `<div class='card-item'>
                    <img src="${prod_imagenes[i]}" onerror="this.src='https://via.placeholder.com/150'" style="width:100%; height:110px; object-fit:cover; border-radius:8px;">
                    <p><b>${n}</b></p><p>$${prod_precios[i].toFixed(2)}</p>
                    <button class='btn-dark full' onclick='agregar(${i})'>AÑADIR</button>
                </div>`;
            }
        });
        html += "</div>";
    });
    cont.innerHTML = html;
}

function agregar(idx) {
    var pos = car_nombres.indexOf(prod_nombres[idx]);
    if (pos != -1) car_cantidades[pos]++; 
    else { car_nombres.push(prod_nombres[idx]); car_precios.push(prod_precios[idx]); car_cantidades.push(1); }
    actualizarCarritoUI();
}

function actualizarCarritoUI() {
    var t = 0; var qc = 0; var h = "";
    car_nombres.forEach((n, i) => {
        var sub = car_precios[i] * car_cantidades[i];
        h += `<p style='font-size:0.75rem;'>${n} x${car_cantidades[i]} ($${sub.toFixed(2)})</p>`;
        t += sub; qc += car_cantidades[i];
    });
    if(document.getElementById("lista-carrito")) document.getElementById("lista-carrito").innerHTML = h || "Carrito vacío";
    document.getElementById("total-monto").innerText = "$" + t.toFixed(2);
    document.getElementById("cart-qty").innerText = qc;
}

function irADatos() {
    if (car_nombres.length == 0) return lanzarMensaje("EL CARRITO ESTÁ VACÍO");
    irA_Interna("seccion-datos-usuario");
}

function animarCancelar() {
    car_nombres = []; car_precios = []; car_cantidades = [];
    actualizarCarritoUI();
    lanzarMensaje("CARRITO VACIADO");
}

function enviarPedidoFinal() {
    var campoNombre = document.getElementById("pago-nombre");
    var campoCedula = document.getElementById("pago-cedula");
    
    var n = campoNombre.value.trim();
    var c = campoCedula.value.trim();
    
    if (n && c) {
        // Guardamos los datos para el cajero
        datosCliente = { nombre: n, cedula: c, listo: true };
        
        // LIMPIEZA: Borramos los datos solicitados en el formulario
        campoNombre.value = "";
        campoCedula.value = "";
        
        lanzarMensaje("¡PEDIDO ENVIADO!");
        volverAlCarrito();
    } else { 
        lanzarMensaje("FALTAN DATOS"); 
    }
}

// --- CAJA ---
function dibujarCaja() {
    var info = document.getElementById("caja-info-cliente");
    var t = 0; var h = "";
    if (datosCliente.listo) {
        info.innerText = "CLIENTE: " + datosCliente.nombre;
        car_nombres.forEach((n, i) => {
            var sub = car_precios[i] * car_cantidades[i];
            h += `<p>${car_cantidades[i]}x ${n} - $${sub.toFixed(2)}</p>`;
            t += sub;
        });
        document.getElementById("btn-emitir-recibo").classList.remove("hidden");
    } else {
        info.innerText = "ESPERANDO PEDIDO...";
        h = "";
        document.getElementById("btn-emitir-recibo").classList.add("hidden");
    }
    document.getElementById("caja-resumen").innerHTML = h;
    document.getElementById("caja-total").innerText = "$" + t.toFixed(2);
}

function finalizarAtencion() {
    lanzarMensaje("COBRADO");
    datosCliente.listo = false; car_nombres = []; car_precios = []; car_cantidades = [];
    dibujarCaja();
}

// --- HISTORIAL Y RESEÑAS ---
function verHistorial(abrir) {
    if (abrir) {
        irA_Interna("seccion-historial");
        var h = "";
        for (var i = hist_compras.length - 1; i >= 0; i--) {
            h += `<div style="background:white; padding:10px; margin-bottom:5px; border-radius:10px; font-size:0.7rem; border-left:4px solid #FF69B4;">
                <b>${hist_compras[i].nombre}</b><br>${hist_compras[i].items}<br>Total: ${hist_compras[i].monto}</div>`;
        }
        document.getElementById("lista-historial-detallado").innerHTML = h || "Sin historial.";
    } else { volverAlCarrito(); }
}

function dibujarResenas() {
    var h = "";
    for (var i = resena_usuarios.length - 1; i >= 0; i--) {
        h += `<div class='resena-item'><b>${resena_usuarios[i]}:</b> ${resena_textos[i]}</div>`;
    }
    document.getElementById("contenedor-resenas").innerHTML = h;
}

function publicarResena() {
    var t = document.getElementById("input-resena").value.trim();
    if (t) { resena_usuarios.push("@Estudiante_UCV"); resena_textos.push(t); }
    document.getElementById("input-resena").value = "";
    dibujarResenas();
}

// --- NAVEGACIÓN ---
function irA(id) {
    document.querySelectorAll(".pantalla").forEach(p => p.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
}

function lanzarMensaje(t) {
    document.getElementById("modal-mensaje").innerText = t;
    document.getElementById("custom-modal").classList.remove("hidden");
}

function cerrarModal() { document.getElementById("custom-modal").classList.add("hidden"); }

function volverAlCarrito() { irA_Interna("seccion-carrito"); }

function irA_Interna(id) {
    ["seccion-carrito", "seccion-datos-usuario", "seccion-historial"].forEach(s => {
        document.getElementById(s).classList.add("hidden");
    });
    document.getElementById(id).classList.remove("hidden");
}