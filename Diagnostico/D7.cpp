#include <iostream>
#include <string>
#include <cctype>
#include <map>
#include <vector>

using namespace std;

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
        if (isupper(c)) {
            tieneMayuscula = true;
        }
        if (ispunct(c)) {
            contadorSimbolos++;
        }
    }

    return tieneMayuscula && (contadorSimbolos >= 2);
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
    map<string, string> usuarios;
    usuarios["Alberto"] = "Abc@1234";

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
        cout << "3. Gestionar artículos\n";
        cout << "4. Salir\n";
        cout << "Seleccione una opción: ";
        cin >> opcionMenu;

        if (opcionMenu == 3) {
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
                        listarArticulos(articulos);
                        break;
                    case 2:
                        agregarArticulo(articulos);
                        break;
                    case 3:
                        editarArticulo(articulos);
                        break;
                    case 4:
                        eliminarArticulo(articulos);
                        break;
                    case 5:
                        comprarArticulo(articulos);
                        break;
                    case 6:
                        cout << "Volviendo al menú principal...\n";
                        break;
                    default:
                        cout << "Opción inválida. Intente nuevamente.\n";
                }
            } while (opcionCRUD != 6);
        } else if (opcionMenu == 4) {
            cout << "Saliendo del sistema...\n";
            break;
        } else {
            cout << "Opción inválida. Intente nuevamente.\n";
        }
    }

    return 0;
}