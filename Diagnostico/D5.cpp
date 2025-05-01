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

int main() {
    map<string, string> usuarios;  // Mapa para almacenar usuarios y contraseñas
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
        cout << "3. Ver artículos disponibles\n";
        cout << "4. Salir\n";
        cout << "Seleccione una opción: ";
        cin >> opcionMenu;

        if (opcionMenu == 1) {  
            string cliente, contrasenia;
            int intentos = 0;
            const int bloqueo = 3;

            while (intentos < bloqueo) {
                cout << "Cliente: ";
                cin >> cliente;
                cout << "Contraseña: ";
                cin >> contrasenia;

                if (usuarios.find(cliente) != usuarios.end() && usuarios[cliente] == contrasenia) {
                    cout << "Bienvenido " << cliente << ", realice su pedido!" << endl;
                    break;
                } else {
                    intentos++;
                    cout << "Usuario y/o contraseña incorrecta. Intento " << intentos << " de " << bloqueo << ".\n";
                }
            }

            if (intentos == bloqueo) {
                cout << "Usuario bloqueado. Contacte al administrador.\n";
            }

        } else if (opcionMenu == 2) {  
            string nuevoUsuario, nuevaClave;
            cout << "Ingrese nuevo nombre de usuario: ";
            cin >> nuevoUsuario;

            if (usuarios.find(nuevoUsuario) != usuarios.end()) {
                cout << "Error: El usuario ya existe. Intente con otro nombre.\n";
                continue;
            }

            do {
                cout << "Ingrese nueva contraseña (8-16 caracteres, al menos 1 mayúscula y 2 símbolos especiales): ";
                cin >> nuevaClave;

                if (!esContraseniaSegura(nuevaClave)) {
                    cout << "Error: La contraseña no cumple con los requisitos de seguridad. Intente nuevamente.\n";
                }
            } while (!esContraseniaSegura(nuevaClave));

            usuarios[nuevoUsuario] = nuevaClave;
            cout << "Cuenta creada exitosamente. Ahora puede iniciar sesión.\n";

        } else if (opcionMenu == 3) {  
            cout << "\n--- Artículos Disponibles ---\n";
            for (const auto &art : articulos) {
                cout << "ID: " << art.id << " | Nombre: " << art.nombre 
                     << " | Precio: $" << art.precio << " | Stock: " << art.stock << " unidades\n";
            }
        } else if (opcionMenu == 4) {  
            cout << "Saliendo del sistema...\n";
            break;
        } else {
            cout << "Opción inválida. Intente nuevamente.\n";
        }
    }

    return 0;
}
