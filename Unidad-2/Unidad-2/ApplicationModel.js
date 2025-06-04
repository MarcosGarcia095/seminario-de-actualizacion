export class ApplicationModel {
  constructor() {
    this.authData = new Map();
    this.productos = new Map();
    this.maxLoginFailedAttempts = 3;
    this.initProductos();
    this.initUsuarios();
  }

  initProductos() {
    this.productos.set(1, { nombre: "Lavandina x 1L", precio: 875.25, stock: 3000 });
    this.productos.set(4, { nombre: "Detergente x 500mL", precio: 1102.45, stock: 2010 });
    this.productos.set(22, { nombre: "Jabón en polvo x 250g", precio: 650.22, stock: 407 });
  }

  initUsuarios() {
    this.authData.set("admin1", { password: "Admin@123!", tipo: "administrador", failedLoginCounter: 0, isLocked: false });
    this.authData.set("cliente1", { password: "Cliente@123!", tipo: "cliente", failedLoginCounter: 0, isLocked: false });
    this.authData.set("vendedor1", { password: "Vendedor@123!", tipo: "vendedor", failedLoginCounter: 0, isLocked: false });
    this.authData.set("deposito1", { password: "Deposito@123!", tipo: "deposito", failedLoginCounter: 0, isLocked: false });
  }

  validarPassword(password) {
    const esValida = /^[A-Za-z\d@$!%*?&]{8,16}$/.test(password)
      && /[A-Z]/.test(password)
      && /[^A-Za-z\d\s]{2,}/.test(password);
    return esValida;
  }

  crearCuenta(usuarioActual, username, password, tipo) {
    const admin = this.authData.get(usuarioActual);
    if (!admin || admin.tipo !== "administrador") {
      return { success: false, message: "Solo los administradores pueden crear cuentas." };
    }

    if (this.authData.has(username)) {
      return { success: false, message: "Ese nombre de usuario ya existe." };
    }

    const tiposValidos = ["administrador", "cliente", "vendedor", "deposito"];
    if (!tiposValidos.includes(tipo)) {
      return { success: false, message: "Tipo de usuario inválido." };
    }

    if (!this.validarPassword(password)) {
      return { success: false, message: "La contraseña no cumple con los requisitos." };
    }

    this.authData.set(username, {
      password,
      tipo,
      failedLoginCounter: 0,
      isLocked: false
    });

    return { success: true, message: "Cuenta creada exitosamente." };
  }

  login(username, password) {
    const user = this.authData.get(username);

    if (!user) {
      return { success: false, message: "Usuario no encontrado." };
    }

    if (user.isLocked) {
      return { success: false, message: "Usuario bloqueado. Contacte al administrador." };
    }

    if (user.password === password) {
      user.failedLoginCounter = 0;
      return { success: true, user };
    } else {
      user.failedLoginCounter++;
      if (user.failedLoginCounter >= this.maxLoginFailedAttempts) {
        user.isLocked = true;
        return { success: false, message: "Usuario bloqueado. Contacte al administrador." };
      } else {
        return { success: false, message: "Usuario y/o contraseña incorrecta." };
      }
    }
  }

  listarArticulos() {
    if (this.productos.size === 0) {
      return "No hay artículos cargados.";
    }

    let lista = "=== Artículos ===\n";
    this.productos.forEach((art, id) => {
      lista += `ID: ${id} | ${art.nombre} | $${art.precio.toFixed(2)} | Stock: ${art.stock}\n`;
    });
    return lista;
  }

  nuevoArticulo(id, nombre, precio, stock) {
    if (this.productos.has(id)) {
      return { success: false, message: "Ese ID ya existe." };
    }

    if (!nombre || isNaN(precio) || isNaN(stock)) {
      return { success: false, message: "Datos inválidos." };
    }

    this.productos.set(id, { nombre, precio, stock });
    return { success: true, message: "Artículo creado." };
  }

  editarArticulo(id, nuevoNombre, nuevoPrecio, nuevoStock) {
    if (!this.productos.has(id)) {
      return { success: false, message: "Artículo no encontrado." };
    }

    const articulo = this.productos.get(id);
    const nombre = nuevoNombre || articulo.nombre;
    const precio = isNaN(nuevoPrecio) ? articulo.precio : nuevoPrecio;
    const stock = isNaN(nuevoStock) ? articulo.stock : nuevoStock;

    if (!nombre || isNaN(precio) || isNaN(stock)) {
      return { success: false, message: "Datos inválidos." };
    }

    this.productos.set(id, { nombre, precio, stock });
    return { success: true, message: "Artículo editado." };
  }

  eliminarArticulo(id) {
    if (!this.productos.has(id)) {
      return { success: false, message: "Artículo no encontrado." };
    }

    this.productos.delete(id);
    return { success: true, message: "Artículo eliminado." };
  }

  comprarArticulo(id, cantidad) {
    if (!this.productos.has(id)) {
      return { success: false, message: "Artículo no encontrado." };
    }

    const articulo = this.productos.get(id);

    if (cantidad > articulo.stock) {
      return { success: false, message: "Stock insuficiente." };
    }

    articulo.stock -= cantidad;
    return { success: true, message: `Compra exitosa. Stock restante: ${articulo.stock}` };
  }

  cambiarPassword(usuario, nuevaPassword) {
    const user = this.authData.get(usuario);

    if (!this.validarPassword(nuevaPassword)) {
      return { success: false, message: "Contraseña no válida." };
    }

    user.password = nuevaPassword;
    return { success: true, message: "Contraseña actualizada." };
  }
}