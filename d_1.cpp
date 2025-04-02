#include <iostream>
#include <string>

using namespace std;

int main() {

    const string icliente = "Alberto";
    const string iclave = "1234";

    string cliente, contrasenia;
    int clave = 0;
    const int bloqueo = 3;

    while (clave < bloqueo) {
        cout<< "Cliente: ";
        cin>> cliente;
        cout<< "Contraseña: ";
        cin>> contrasenia;

        if( cliente== icliente && contrasenia== iclave) {
            cout << "Bienvenido "<< cliente << ", realice su pedido!"<< endl;
            return 0;
        } else{
            clave ++;
            cout << "Usuario y/o contraseña incorrecta" ;
        }
    }

    cout <<"Usuario bloqueado. Contacte al administrador.";
    return 0;
}