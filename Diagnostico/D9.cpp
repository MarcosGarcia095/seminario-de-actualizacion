#include <iostream>
#include <string>
#include <cctype>
#include <map>
#include <vector>
#include <algorithm>

using namespace std;

enum class Rol {
    Administrador,
    Cliente,
    Vendedor,
    Deposito
};

enum class Accion {
    Listar,
    Agregar,
    Editar,
    Eliminar,
    Comprar
};

struct Usuario {
    string contrasenia;
    Rol rol;
};

struct Articulo {
    int id;
    string nombre;
    double precio;
    int stock;
};

bool esContraseniaSegura(const string &contrasenia) {
    if (contrasenia.length() < 8 || contrasenia.length() > 16) {
        return false;
    }
    bool tieneMayuscula = false;
    int contadorSimbolos = 0;
    for (char c : contrasenia) {
        if (isupper(c)) tieneMayuscula = true;
        if (ispunct(c)) contadorSimbolos++;
    }
    return tieneMayuscula && (contadorSimbolos >= 2);
}

vector<Accion> obtenerPermisosPorRol(Rol rol) {
    switch (rol) {
        case Rol::Administrador:
            return {Accion::Listar, Accion::Agregar, Accion::Editar, Accion::Eliminar};
        case Rol::Vendedor:
            return {Accion::Listar, Accion::Comprar};
        case Rol::Cliente:
            return {Accion::Listar, Accion::Comprar};
        case Rol::Deposito:
            return {Accion::Listar};
        default:
            return {};
    }
}

bool tienePermiso(Rol rol, Accion accion) {
    vector<Accion> permisos = obtenerPermisosPorRol(rol);
    return find(permisos.begin(), permisos.end(), accion) != permisos.end();
}

void listarArticulos(const vector<Articulo> &articulos) {
    cout << "\n--- Artículos Disponibles ---\n";
    for (const auto &art : articulos) {
        cout << "ID: " << art.id << " | Nombre: " << art.nombre 
             << " | Precio: $" << art.precio << " | Stock: " << art.stock << " unidades\n";
    }
}

void agregarArticulo(vector<Articulo> &articulos) {
    Articulo nuevo;
    cout << "Ingrese ID del artículo: ";
    cin >> nuevo.id;
    cin.ignore();
    cout << "Ingrese nombre del artículo: ";
    getline(cin, nuevo.nombre);
    cout << "Ingrese precio del artículo: ";
    cin >> nuevo.precio;
    cout << "Ingrese stock del artículo: ";
    cin >> nuevo.stock;
    articulos.push_back(nuevo);
    cout << "Artículo agregado exitosamente.\n";
}

void editarArticulo(vector<Articulo> &articulos) {
    int id;
    cout << "Ingrese ID del artículo a editar: ";
    cin >> id;
    for (auto &art : articulos) {
        if (art.id == id) {
            cout << "Nuevo nombre: ";
            cin.ignore();
            getline(cin, art.nombre);
            cout << "Nuevo precio: ";
            cin >> art.precio;
            cout << "Nuevo stock: ";
            cin >> art.stock;
            cout << "Artículo actualizado correctamente.\n";
            return;
        }
    }
    cout << "Artículo no encontrado.\n";
}

void eliminarArticulo(vector<Articulo> &articulos) {
    int id;
    cout << "Ingrese ID del artículo a eliminar: ";
    cin >> id;
    for (auto it = articulos.begin(); it != articulos.end(); ++it) {
        if (it->id == id) {
            articulos.erase(it);
            cout << "Artículo eliminado correctamente.\n";
            return;
        }
    }
    cout << "Artículo no encontrado.\n";
}

void comprarArticulo(vector<Articulo> &articulos) {
    int id, cantidad;
    cout << "Ingrese ID del artículo que desea comprar: ";
    cin >> id;
    for (auto &art : articulos) {
        if (art.id == id) {
            if (art.stock == 0) {
                cout << "No hay stock disponible de este artículo.\n";
                return;
            }
            cout << "Ingrese la cantidad que desea comprar: ";
            cin >> cantidad;
            if (cantidad > 0 && cantidad <= art.stock) {
                art.stock -= cantidad;
                cout << "Compra realizada con éxito. Ahora quedan " << art.stock << " unidades en stock.\n";
            } else {
                cout << "Cantidad inválida o insuficiente stock disponible.\n";
            }
            return;
        }
    }
    cout << "Artículo no encontrado.\n";
}

int main() {
    map<string, Usuario> usuarios = {
        {"admin", {"Admin@123!", Rol::Administrador}},
        {"cliente", {"Cliente@123!", Rol::Cliente}},
        {"vendedor", {"Vendedor@123!", Rol::Vendedor}},
        {"deposito", {"Deposito@123!", Rol::Deposito}}
    };

    vector<Articulo> articulos = {
        {1, "Lavandina x 1L", 875.25, 3000},
        {4, "Detergente x 500mL", 1102.45, 2010},
        {22, "Jabon en polvo x 250g", 650.22, 407}
    };

    while (true) {
        int opcionMenu;
        cout << "\n--- Menú Principal ---\n";
        cout << "1. Iniciar sesión\n";
        cout << "2. Crear cuenta de usuario\n";
        cout << "3. Salir\n";
        cout << "Seleccione una opción: ";
        cin >> opcionMenu;

        if (opcionMenu == 1) {
            string nombreUsuario, clave;
            cout << "Nombre de usuario: ";
            cin >> nombreUsuario;
            cout << "Contraseña: ";
            cin >> clave;

            auto it = usuarios.find(nombreUsuario);
            if (it != usuarios.end() && it->second.contrasenia == clave) {
                Rol rolActual = it->second.rol;

                cout << "Bienvenido, " << nombreUsuario << " (Rol: ";
                switch (rolActual) {
                    case Rol::Administrador: cout << "Administrador"; break;
                    case Rol::Cliente: cout << "Cliente"; break;
                    case Rol::Vendedor: cout << "Vendedor"; break;
                    case Rol::Deposito: cout << "Depósito"; break;
                }
                cout << ")\n";

                int opcionCRUD;
                do {
                    cout << "\n--- Gestión de Artículos ---\n";
                    cout << "1. Listar artículos\n";
                    cout << "2. Agregar artículo\n";
                    cout << "3. Editar artículo\n";
                    cout << "4. Eliminar artículo\n";
                    cout << "5. Comprar artículo\n";
                    cout << "6. Volver al menú principal\n";
                    cout << "Seleccione una opción: ";
                    cin >> opcionCRUD;

                    switch (opcionCRUD) {
                        case 1:
                            if (tienePermiso(rolActual, Accion::Listar)) listarArticulos(articulos);
                            else cout << "No tiene permiso para listar artículos.\n";
                            break;
                        case 2:
                            if (tienePermiso(rolActual, Accion::Agregar)) agregarArticulo(articulos);
                            else cout << "No tiene permiso para agregar artículos.\n";
                            break;
                        case 3:
                            if (tienePermiso(rolActual, Accion::Editar)) editarArticulo(articulos);
                            else cout << "No tiene permiso para editar artículos.\n";
                            break;
                        case 4:
                            if (tienePermiso(rolActual, Accion::Eliminar)) eliminarArticulo(articulos);
                            else cout << "No tiene permiso para eliminar artículos.\n";
                            break;
                        case 5:
                            if (tienePermiso(rolActual, Accion::Comprar)) comprarArticulo(articulos);
                            else cout << "No tiene permiso para comprar artículos.\n";
                            break;
                        case 6:
                            cout << "Volviendo al menú principal...\n";
                            break;
                        default:
                            cout << "Opción inválida. Intente nuevamente.\n";
                    }
                } while (opcionCRUD != 6);
            } else {
                cout << "Usuario o contraseña incorrectos.\n";
            }

        } else if (opcionMenu == 2) {
            string nuevoUsuario, nuevaClave;
            int tipoRol;
            cout << "Ingrese nuevo nombre de usuario: ";
            cin >> nuevoUsuario;
            cout << "Ingrese nueva contraseña: ";
            cin >> nuevaClave;

            if (!esContraseniaSegura(nuevaClave)) {
                cout << "La contraseña no cumple los requisitos de seguridad.\n";
                continue;
            }

            cout << "Seleccione el rol:\n";
            cout << "0. Administrador\n1. Cliente\n2. Vendedor\n3. Depósito\n";
            cin >> tipoRol;

            usuarios[nuevoUsuario] = {nuevaClave, static_cast<Rol>(tipoRol)};
            cout << "Usuario creado exitosamente.\n";

        } else if (opcionMenu == 3) {
            cout << "Saliendo del sistema...\n";
            break;
        } else {
            cout << "Opción inválida. Intente nuevamente.\n";
        }
    }

    return 0;
}