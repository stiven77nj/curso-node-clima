// Importaciones de paquetes
import inquirer from 'inquirer'; // Importacion de "inquirer". Hace interactiva la consola
import colors from 'colors'; // Importacion de los colores


// Arreglo con las preguntas del menu de opciones
const preguntas = [
    {
        type: 'list', // Tipo del objeto
        name: 'opcion', // Nombre para almacenar la respuesta
        message: '¿Qué desea hacer?', // Mensaje que se muestra en consola
        choices: [ // Opciones para escoger
            {
                value: 1,
                name: `${  colors.green( '1.' ) } Buscar ciudad`
            },
            {
                value: 2,
                name: `${  colors.green( '2.' ) } Historial`
            },
            {
                value: 0,
                name: `${  colors.green( '0.' ) } Salir`
            }
        ]
    }
];

// Funcion menu de opciones
const inquirerMenu = async() => {
    console.clear(); // Se limpia la consola
    console.log( colors.green('=======================') );
    console.log( colors.white(' Seleccione una opción ') );
    console.log( colors.green('=======================\n') );
    // Uso del inquirer
    const { opcion } = await inquirer.prompt(preguntas) // Recibe un arreglo con cada una de las preguntas que se desean hacer
    // Se retorna la opcion escogida
    return opcion;
}

// Funcion para pausar la consola
const pausa = async() => {
    const questions = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${ colors.green('ENTER') } para continuar`
        }
    ];
    console.log('\n');
    await inquirer.prompt(questions); // Se vuelven a mostrar las opciones
}

// Funcion para ingresar texto por consola
const leerInput = async( message ) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ) {
                if( value.length === 0 ) {
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];
    const { desc } = await inquirer.prompt( question );
    return desc;
}

// Funcion para listar lugares
const listarLugares = async( lugares ) => {
    const choices = lugares.map( (lugar, i) => {
        const idx = `${ i + 1 }.`.green;
        return {
            value: lugar.id,
            name: `${ idx } ${ lugar.nombre }`
        }
    });
    choices.unshift({
        value: '0',
        name: '0.'.green + ' Cancelar'
    });
    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar:',
            choices
        }
    ]
    const { id } = await inquirer.prompt( preguntas );
    return id;
}

// Exportacion de las funciones
export { inquirerMenu, pausa, leerInput, listarLugares };













