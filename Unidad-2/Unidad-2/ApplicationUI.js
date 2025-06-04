export class ApplicationUI {
  constructor(model) {
    this.model = model;
  }

  mainMenu() {
    let opcion;
    do {
      opcion = prompt(
        "=== Menú Principal ===\n" +
        "1. Iniciar sesión\n" +
        "2. Salir"
      );

      switch (opcion) {
        case "1":
          this.login();
          break;
        case "2":
          alert("Saliendo del sistema...");
          break;
        default:
          alert("Opción inválida.");
      }
    } while (opcion !== "2");
  }

  login() {
    const username = prompt("Nombre de usuario:");
    const password = prompt("Contraseña:");
    const result = this.model.login(username, password);

    if (result.success) {
      alert(`¡Bienvenido/a ${username} (${result.user.tipo})!`);
      this.menuPorRol(username);
    } else {
      alert(result.message);
    }
  }

  menuPorRol(usuario) {
    const user = this.model.authData.get(usuario);
    const tipo = user.tipo;

    let opcion;
    do {
      let opciones = `=== Menú (${tipo}) ===\n`;
      let disponibles = [];

      opciones += "1. Listar artículos\n";
      disponibles.push("1");

      opciones += "2. Comprar artículo\n";
      disponibles.push("2");

      if (tipo === "administrador" || tipo === "deposito") {
        opciones += "3. Nuevo artículo\n4. Editar artículo\n5. Eliminar artículo\n";
        disponibles.push("3", "4", "5");
      }

      opciones += "6. Cambiar contraseña\n";
      disponibles.push("6");

      if (tipo === "administrador") {
        opciones += "7. Crear cuenta de usuario\n";
        disponibles.push("7");
      }

      opciones += "8. Cerrar sesión";

      opcion = prompt(opciones);

      switch (opcion) {
        case "1":
          alert(this.model.listarArticulos());
          break;
        case "2":
          this.comprarArticulo();
          break;
        case "3":
          if (disponibles.includes("3")) this.nuevoArticulo();
          else alert("Acceso denegado.");
          break;
        case "4":
          if (disponibles.includes("4")) this.editarArticulo();
          else alert("Acceso denegado.");
          break;
        case "5":
          if (disponibles.includes("5")) this.eliminarArticulo();
          else alert("Acceso denegado.");
          break;
        case "6":
          this.cambiarPassword(usuario);
          break;
        case "7":
          if (tipo === "administrador") this.crearCuenta(usuario);
          else alert("Acceso denegado.");
          break;
        case "8":
          alert("Cerrando sesión...");
          break;
        default:
          alert("Opción inválida.");
      }
    } while (opcion !== "8");
  }

  crearCuenta(usuarioActual) {
    const username = prompt("Ingrese nuevo nombre de usuario:");
    const password = prompt("Ingrese contraseña:");
    const tipo = prompt("Ingrese tipo de usuario (administrador/cliente/vendedor/deposito):");

    const result = this.model.crearCuenta(usuarioActual, username, password, tipo);
    alert(result.message);
  }

  comprarArticulo() {
    const id = parseInt(prompt("Ingrese el ID del artículo a comprar:"));
    const cantidad = parseInt(prompt("Ingrese la cantidad a comprar:"));

    const result = this.model.comprarArticulo(id, cantidad);
    alert(result.message);
  }

  nuevoArticulo() {
    const id = parseInt(prompt("Ingrese el ID del nuevo artículo:"));
    const nombre = prompt("Ingrese el nombre del artículo:");
    const precio = parseFloat(prompt("Ingrese el precio del artículo:"));
    const stock = parseInt(prompt("Ingrese el stock inicial del artículo:"));

    const result = this.model.nuevoArticulo(id, nombre, precio, stock);
    alert(result.message);
  }

  editarArticulo() {
    const id = parseInt(prompt("Ingrese el ID del artículo a editar:"));
    const nuevoNombre = prompt("Ingrese el nuevo nombre del artículo (deje en blanco para mantener):");
    const nuevoPrecioInput = prompt("Ingrese el nuevo precio del artículo (deje en blanco para mantener):");
    const nuevoStockInput = prompt("Ingrese el nuevo stock del artículo (deje en blanco para mantener):");

    const nuevoPrecio = nuevoPrecioInput ? parseFloat(nuevoPrecioInput) : NaN;
    const nuevoStock = nuevoStockInput ? parseInt(nuevoStockInput) : NaN;

    const result = this.model.editarArticulo(id, nuevoNombre, nuevoPrecio, nuevoStock);
    alert(result.message);
  }

  eliminarArticulo() {
    const id = parseInt(prompt("Ingrese el ID del artículo a eliminar:"));
    const result = this.model.eliminarArticulo(id);
    alert(result.message);
  }

  cambiarPassword(usuario) {
    const nuevaPassword = prompt("Ingrese la nueva contraseña:");
    const result = this.model.cambiarPassword(usuario, nuevaPassword);
    alert(result.message);
  }
}