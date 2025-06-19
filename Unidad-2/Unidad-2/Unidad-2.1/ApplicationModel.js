export class ApplicationModel {
  constructor() {
    this.storageUsuariosKey = 'app_authData';
    this.storageProductosKey = 'app_productos';
    this.maxLoginFailedAttempts = 3;

    this.authData = this.loadFromStorage(this.storageUsuariosKey) || new Map();
    this.productos = this.loadFromStorage(this.storageProductosKey) || new Map();

    if (this.authData.size === 0) this.initUsuarios();
    if (this.productos.size === 0) this.initProductos();

    this.saveAll(); // Asegura consistency inicial
  }

  loadFromStorage(key) {
    const json = localStorage.getItem(key);
    if (!json) return null;
    try {
      const obj = JSON.parse(json);
      // Reconstruye Map desde array de entradas
      return new Map(obj);
    } catch {
      return null;
    }
  }

  saveToStorage(key, map) {
    try {
      const arr = Array.from(map.entries());
      localStorage.setItem(key, JSON.stringify(arr));
    } catch (e) {
      console.error('Error guardando en localStorage:', e);
    }
  }

  saveAll() {
    this.saveToStorage(this.storageUsuariosKey, this.authData);
    this.saveToStorage(this.storageProductosKey, this.productos);
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
    const tieneLongitud = /^[A-Za-z\d@$!%*?&]{8,16}$/.test(password);
    const tieneMayus = /[A-Z]/.test(password);
    const tiene2Especiales = /[^A-Za-z\d\s]{2,}/.test(password);
    return tieneLongitud && tieneMayus && tiene2Especiales;
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
      password, tipo, failedLoginCounter: 0, isLocked: false
    });
    this.saveToStorage(this.storageUsuariosKey, this.authData);

    return { success: true, message: "Cuenta creada exitosamente." };
  }

  login(username, password) {
    const user = this.authData.get(username);
    if (!user) return { success: false, message: "Usuario no encontrado." };
    if (user.isLocked) return { success: false, message: "Usuario bloqueado. Contacte al administrador." };

    if (user.password === password) {
      user.failedLoginCounter = 0;
      this.saveToStorage(this.storageUsuariosKey, this.authData);
      return { success: true, user };
    } else {
      user.failedLoginCounter++;
      if (user.failedLoginCounter >= this.maxLoginFailedAttempts) {
        user.isLocked = true;
        this.saveToStorage(this.storageUsuariosKey, this.authData);
        return { success: false, message: "Usuario bloqueado. Contacte al administrador." };
      } else {
        this.saveToStorage(this.storageUsuariosKey, this.authData);
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
    if (this.productos.has(id)) return { success: false, message: "Ese ID ya existe." };
    if (!nombre || isNaN(precio) || isNaN(stock)) return { success: false, message: "Datos inválidos." };

    this.productos.set(id, { nombre, precio, stock });
    this.saveToStorage(this.storageProductosKey, this.productos);
    return { success: true, message: "Artículo creado." };
  }

  editarArticulo(id, nuevoNombre, nuevoPrecio, nuevoStock) {
    if (!this.productos.has(id)) return { success: false, message: "Artículo no encontrado." };

    const art = this.productos.get(id);
    const nombre = nuevoNombre || art.nombre;
    const precio = isNaN(nuevoPrecio) ? art.precio : nuevoPrecio;
    const stock = isNaN(nuevoStock) ? art.stock : nuevoStock;

    if (!nombre || isNaN(precio) || isNaN(stock)) return { success: false, message: "Datos inválidos." };

    this.productos.set(id, { nombre, precio, stock });
    this.saveToStorage(this.storageProductosKey, this.productos);
    return { success: true, message: "Artículo editado." };
  }

  eliminarArticulo(id) {
    if (!this.productos.has(id)) return { success: false, message: "Artículo no encontrado." };

    this.productos.delete(id);
    this.saveToStorage(this.storageProductosKey, this.productos);
    return { success: true, message: "Artículo eliminado." };
  }

  comprarArticulo(id, cantidad) {
    if (!this.productos.has(id)) return { success: false, message: "Artículo no encontrado." };
    const art = this.productos.get(id);
    if (cantidad > art.stock) return { success: false, message: "Stock insuficiente." };

    art.stock -= cantidad;
    this.saveToStorage(this.storageProductosKey, this.productos);
    return { success: true, message: `Compra exitosa. Stock restante: ${art.stock}` };
  }

  cambiarPassword(usuario, nuevaPassword) {
    const user = this.authData.get(usuario);
    if (!this.validarPassword(nuevaPassword)) {
      return { success: false, message: "Contraseña no válida." };
    }
    user.password = nuevaPassword;
    this.saveToStorage(this.storageUsuariosKey, this.authData);
    return { success: true, message: "Contraseña actualizada." };
  }
}