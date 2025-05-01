#include <iostream>
#include <string>
#include <cctype>

using namespace std;

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
        if (ispunct(c)) {  // Verifica si es un símbolo especial
            contadorSimbolos++;
        }
    }

    return tieneMayuscula && (contadorSimbolos >= 2);
}

int main() {
    const string icliente = "Alberto";  
    string iclave = "Abc@1234";  
    string cliente, contrasenia;
    int intentos = 0;
    const int bloqueo = 3;

    while (true) {  
        intentos = 0; 
        while (intentos < bloqueo) {
            cout << "Cliente: ";
            cin >> cliente;
            cout << "Contraseña: ";
            cin >> contrasenia;

            if (cliente == icliente && contrasenia == iclave) {
                cout << "Bienvenido " << cliente << ", realice su pedido!" << endl;

                char opcion;
                do {
                    cout << "\n--- Menú de Acciones ---\n";
                    cout << "1. Cambiar contraseña\n";
                    cout << "2. Salir y volver al inicio\n";
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

                            iclave = nuevaClave; 
                            cout << "Contraseña cambiada exitosamente.\n";
                            break;
                        }
                        case '2':
                            cout << "Saliendo... Volviendo a inicio.\n";
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
            return 0;
        }
    }
}
