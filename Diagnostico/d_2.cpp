#include <iostream>
#include <string>

using namespace std;

int main() {
    const string icliente = "Alberto";  
    string iclave = "1234";  
    string cliente, contrasenia;
    int intentos = 0;
    const int bloqueo = 3;

    while (true) {  // Ciclo infinito para permitir volver al inicio tras salir del menú
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
                            cout << "Ingrese nueva contraseña: ";
                            cin >> nuevaClave;
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
