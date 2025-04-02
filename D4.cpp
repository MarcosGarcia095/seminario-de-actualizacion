#include <iostream>
#include <string>
#include <cctype>
#include <map>

using namespace std;

bool esContraseniaSegura(const string &contrasenia) {
    if (contrasenia.length() < 8 || contrasenia.length() > 16) {
        return false;  // Longitud fuera del rango permitido
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
    map<string, string> usuarios;  
    usuarios["Alberto"] = "Abc@1234";  

    while (true) {  
        int opcionMenu;
        cout << "\n--- Menú Principal ---\n";
        cout << "1. Iniciar sesión\n";
        cout << "2. Crear cuenta de usuario\n";
        cout << "3. Salir\n";
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

                // Verifica si el usuario y contraseña son correctos
                if (usuarios.find(cliente) != usuarios.end() && usuarios[cliente] == contrasenia) {
                    cout << "Bienvenido " << cliente << ", realice su pedido!" << endl;

                    char opcion;
                    do {
                        cout << "\n--- Menú de Acciones ---\n";
                        cout << "1. Cambiar contraseña\n";
                        cout << "2. Cerrar sesión\n";
                        cout << "Seleccione una opción: ";
                        cin >> opcion;

                        switch (opcion) {
                            case '1': {
                                string nuevaClave;
                                do {
                                    cout << "Ingrese nueva contraseña (8-16 caracteres, al menos 1 mayúscula y 2 símbolos especiales): ";
                                    cin >> nuevaClave;

                                    if (!esContraseniaSegura(nuevaClave)) {
                                        cout << "Error: La contraseña no cumple con los requisitos de seguridad. Intente nuevamente.\n";
                                    }
                                } while (!esContraseniaSegura(nuevaClave));

                                usuarios[cliente] = nuevaClave;  
                                cout << "Contraseña cambiada exitosamente.\n";
                                break;
                            }
                            case '2':
                                cout << "Cerrando sesión... Volviendo al menú principal.\n";
                                break;
                            default:
                                cout << "Opción inválida. Intente nuevamente.\n";
                        }
                    } while (opcion != '2'); 
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

            usuarios[nuevoUsuario] = nuevaClave;  // Almacena el nuevo usuario
            cout << "Cuenta creada exitosamente. Ahora puede iniciar sesión.\n";

        } else if (opcionMenu == 3) { 
            cout << "Saliendo del sistema...\n";
            break;
        } else {
            cout << "Opción inválida. Intente nuevamente.\n";
        }
    }

    return 0;
}
