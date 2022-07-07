// Importaciones de paquetes
import colors from 'colors'; // Importacion de los colores
import dotenv from 'dotenv' // Paquete para manipular las variables de entorno
dotenv.config(); // Conviert el archivo .env en variables de entorno. El archivo .env no se debe subir a github

// Importacion de funciones y clases
import { inquirerMenu, pausa, leerInput, listarLugares } from './helpers/inquirer.js';
import { Busquedas } from './models/busquedas.js';


const main = async () => {
    const busquedas = new Busquedas(); // Se crea una instancia de la clase busqueda
    let opt = ''; // Variable para capturar la opcion escogida

    // Se ejecuta el bucle hasta que la opcion escogida sea diferente de cero
    do {
        opt = await inquirerMenu(); // Se obtiene la opcion
        
        switch ( opt ) {
            case 1:
                // Mostar mensaje
                const termino = await leerInput( 'Ciudad: ' ); // Obtenemos el lugar ingresado por la persona
                // Buscar lugares
                const lugares = await busquedas.ciudad( termino ); // Retorna los lugares que coincidad con la busqueda de la persona
                // Seleccionar lugar
                const idSeleccionado = await listarLugares( lugares );
                if ( idSeleccionado === '0' ) {
                    continue;
                }
                const lugarSeleccionado = lugares.find( l => l.id === idSeleccionado );
                // Guardar en DB
                busquedas.agregarHistorial( lugarSeleccionado.nombre );
                // Datos del clima del lugar
                const clima = await busquedas.climaLugar( lugarSeleccionado.lat, lugarSeleccionado.lng );
                // Mostrar resultados
                console.clear();
                console.log( colors.green('\nInformacion de la ciudad\n') );
                console.log( 'Ciudad:', lugarSeleccionado.nombre);
                console.log( 'Lat:', lugarSeleccionado.lat);
                console.log( 'Lng:', lugarSeleccionado.lng);
                console.log( 'Temperatura:', clima.temp);
                console.log( 'Minima:', clima.min);
                console.log( 'Maxima:', clima.max);
                console.log( 'El clima esta:', clima.desc);
            break;

            case 2:
                busquedas.historialCapitalizado.forEach( ( lugar, i ) => {
                    const idx = `${ i + 1}.`.green;
                    console.log( `${ idx } ${ lugar }` );
                });
            break;
        }

        await pausa(); // Se aplica una pausa al programa
    } while ( opt != 0 );
}

// Se invoca la funcion principal
main();