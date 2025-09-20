const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Para las peticiones OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aarondb'
});

// Conectar a la base de datos
connection.connect((err) => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {

    console.log(`Servidor corriendo en http://localhost:${PORT}`);

});


//Se insertan tareas nuevas
app.post('/api/tareas/subir', (req, res) => {



    const { inputNombre,labelTarea, inputFecha,inputTarea } = req.body;

    if (!inputNombre) {
        res.status(400).json({ message: 'El nombre de la asignatura es obligatorio' });
    }

    try {
        const sql = 'INSERT INTO tareas (nombre_asignatura,label_tarea,nombre_tarea,fecha) VALUES (?, ?, ?, ?)';

        connection.query(sql, [inputNombre,labelTarea, inputTarea, inputFecha], (err, results) => {
            if (err) {
                console.error('Error al insertar tarea:', err);
                return res.status(500).send('Error interno del servidor al insertar la tarea.');
            }
            console.log('Tarea insertada con éxito');
            res.sendStatus(200);

        });
    } catch {
        console.error("ha sucedido algun problema al dar de alta");
    }
}
)
app.get('/api/tareas', (req, res) => {
    connection.query('select * from tareas', (error, results, fields) => {


        if (error) {
            console.error('error al hacer la select:', error);
            res.status(500).send("error al obtener datos");
            return;
        }
        res.json(results);
    })

})

//Realizar busqueda de tareas al dar boton ver tareas
app.get('/api/tareas/buscar', (req, res) => {
    const nombreAsignatura = req.query.nombreAsignatura;

    connection.query('select * from tareas where nombre_asignatura = ?', [nombreAsignatura], (err, results) => {
        if (err) {
            console.error('error al buscar las tareas: ' + err);
            res.status(500).send("error al realizar la consulta");
            return;
        }
        res.json(results);
    })
})

//Devolvemos el listado de asignaturas diferentes que haya y el numero de tareas que hay.
app.get('/api/tareas/nombres', (req, res) => {

    connection.query('select nombre_asignatura from tareas', (error, results, fields) => {


        if (error) {
            console.error('error al hacer la select:', error);
            res.status(500).send("error al obtener datos");
            return;
        }
        const contador = results.reduce((acc, row) => {
            const nombre = row.nombre_asignatura;
            acc[nombre] = (acc[nombre] || 0) + 1;
            return acc;
        }, {});

        const asignaturasConContador = Object.entries(contador).map(([nombre, cantidad]) => ({
            nombre_asignatura: nombre,
            cantidad_tareas: cantidad
        }));

        res.json(asignaturasConContador);
    })
})





