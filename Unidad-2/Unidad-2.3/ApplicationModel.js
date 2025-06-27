let dbInstance = null;

function onDatabaseConnectionError(event) {
  console.error("Error al conectar con IndexedDB:", event);
}

function onDatabaseConnectionSuccess(event) {
  dbInstance = event.target.result;
  console.log("Conexión a IndexedDB exitosa.");
}

function onDatabaseUpgrade(event) {
  const db = event.target.result;
  if (!db.objectStoreNames.contains('productos')) {
    db.createObjectStore('productos', { keyPath: 'id' });
  }
}

const dbRequest = indexedDB.open("AppDB", 1);
dbRequest.onerror = onDatabaseConnectionError;
dbRequest.onsuccess = onDatabaseConnectionSuccess;
dbRequest.onupgradeneeded = onDatabaseUpgrade;

export class ApplicationModel {
  constructor() {
    this.storageUsuariosKey = 'app_authData';
    this.maxLoginFailedAttempts = 3;

    this.authData = this.loadFromStorage(this.storageUsuariosKey) || new Map();

    if (this.authData.size === 0) this.initUsuarios();
    this.saveToStorage(this.storageUsuariosKey, this.authData);
  }

  loadFromStorage(key) {
    const json = localStorage.getItem(key);
    if (!json) return null;
    try {
      const obj = JSON.parse(json);
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

  // === ABM DE ARTÍCULOS CON INDEXEDDB ===

  async listarArticulos() {
    return new Promise((resolve, reject) => {
      const tx = dbInstance.transaction("productos", "readonly");
      const store = tx.objectStore("productos");
      const request = store.getAll();

      request.onsuccess = () => {
        const articulos = request.result;
        if (articulos.length === 0) {
          resolve("No hay artículos cargados.");
        } else {
          let lista = "=== Artículos ===\n";
          articulos.forEach(art => {
            lista += `ID: ${art.id} | ${art.nombre} | $${art.precio.toFixed(2)} | Stock: ${art.stock}\n`;
          });
          resolve(lista);
        }
      };
      request.onerror = () => reject("Error al listar artículos.");
    });
  }

  nuevoArticulo(id, nombre, precio, stock) {
    return new Promise((resolve, reject) => {
      const tx = dbInstance.transaction("productos", "readwrite");
      const store = tx.objectStore("productos");
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        if (getRequest.result) {
          resolve({ success: false, message: "Ese ID ya existe." });
        } else {
          if (!nombre || isNaN(precio) || isNaN(stock)) {
            resolve({ success: false, message: "Datos inválidos." });
            return;
          }
          const articulo = { id, nombre, precio, stock };
          const addRequest = store.add(articulo);
          addRequest.onsuccess = () => resolve({ success: true, message: "Artículo creado." });
          addRequest.onerror = () => reject("Error al crear artículo.");
        }
      };
    });
  }

  editarArticulo(id, nuevoNombre, nuevoPrecio, nuevoStock) {
    return new Promise((resolve, reject) => {
      const tx = dbInstance.transaction("productos", "readwrite");
      const store = tx.objectStore("productos");
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const articulo = getRequest.result;
        if (!articulo) {
          resolve({ success: false, message: "Artículo no encontrado." });
          return;
        }

        const nombre = nuevoNombre || articulo.nombre;
        const precio = isNaN(nuevoPrecio) ? articulo.precio : nuevoPrecio;
        const stock = isNaN(nuevoStock) ? articulo.stock : nuevoStock;

        if (!nombre || isNaN(precio) || isNaN(stock)) {
          resolve({ success: false, message: "Datos inválidos." });
          return;
        }

        const updated = { id, nombre, precio, stock };
        const putRequest = store.put(updated);
        putRequest.onsuccess = () => resolve({ success: true, message: "Artículo editado." });
        putRequest.onerror = () => reject("Error al editar artículo.");
      };
    });
  }

  eliminarArticulo(id) {
    return new Promise((resolve, reject) => {
      const tx = dbInstance.transaction("productos", "readwrite");
      const store = tx.objectStore("productos");
      const deleteRequest = store.delete(id);

      deleteRequest.onsuccess = () => resolve({ success: true, message: "Artículo eliminado." });
      deleteRequest.onerror = () => reject("Error al eliminar artículo.");
    });
  }

  comprarArticulo(id, cantidad) {
    return new Promise((resolve, reject) => {
      const tx = dbInstance.transaction("productos", "readwrite");
      const store = tx.objectStore("productos");
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const art = getRequest.result;
        if (!art) {
          resolve({ success: false, message: "Artículo no encontrado." });
          return;
        }
        if (cantidad > art.stock) {
          resolve({ success: false, message: "Stock insuficiente." });
          return;
        }

        art.stock -= cantidad;
        const putRequest = store.put(art);
        putRequest.onsuccess = () =>
          resolve({ success: true, message: `Compra exitosa. Stock restante: ${art.stock}` });
        putRequest.onerror = () => reject("Error al actualizar stock.");
      };
    });
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