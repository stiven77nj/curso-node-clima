// Importacion de paquetes
import axios from 'axios'; // Paquete para hacer una peticion HTTP. Consumir una API
import fs from 'fs';
 
// Clase busqueda
class Busquedas {
    historial = [];
    dbPath = './db/database.json';
    
    constructor() {
        // TODO: leer DB si existe
        this.leerDB();
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        };
    }

    get paramsWheater() {
        return {
            'appid': process.env.OPENWHEATER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    get historialCapitalizado() {
        return this.historial.map( lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );
            return palabras.join(' ');
        })
    }

    // Metodo asincrono. Realiza una peticion HTTP para un lugar
    async ciudad( lugar ) {
        // Peticion http
        const intance = axios.create({
            baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
            params: this.paramsMapbox
        });
        // Se guarda la respuesta
        const resp = await intance.get();
        // Se retornan los datos de la respuesta
        return resp.data.features.map( lugar => ({
            id: lugar.id,
            nombre: lugar.place_name,
            lng: lugar.center[0],
            lat: lugar.center[1]
        })); // Retorna los lugares que coincidan con la busqueda
    }

    // Metodo asincrono. Realiza una peticion HTTP para el clima
    async climaLugar( lat, lon ) {
        // Peticion http
        const intance = axios.create({
            baseURL: `https://api.openweathermap.org/data/2.5/weather`,
            params: { ...this.paramsWheater, lat, lon }
        });
        // Se guarda la respuesta
        const resp = await intance.get();
        const { weather, main } = resp.data;
        // Se retornan los datos de la respuesta
        return {
            desc: weather[0].description,
            min: main.temp_min,
            max: main.temp_max,
            temp: main.temp
        }
    }

    // Metodo para guardar el historial
    agregarHistorial( lugar ) {
        // Prevenir duplicados. Se inserta en el arreglo "historial"
        if ( this.historial.includes( lugar.toLocaleLowerCase() ) ) {
            return; 
        }
        this.historial = this.historial.splice(0,5); // Solo guarda 6 registros

        this.historial.unshift( lugar.toLocaleLowerCase() );
        
        // Grabar en DB
        this.guardarDB();
    }

    guardarDB() {
        const payload = {
            historial: this.historial
        };

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ) );
    }

    leerDB() {
        if ( !fs.existsSync( this.dbPath ) ) return;
        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8' } );
        const data = JSON.parse( info ); 
        this.historial = data.historial;
    }
}

// Exportacion de las funciones
export { Busquedas };