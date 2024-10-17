const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
const bcrypt = require('bcrypt');
const multer = require('multer');
const xlsx = require('xlsx');


const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'db_sistema_seguimiento'
})

db.connect((error) => {
    if (error) {
        console.log(error)
    } else {
        console.log('Conectado a la base de datos')
    }
})


//Crear los usuarios
app.post('/crear',(req,res) =>{
    const {id_usuario,tipo_documento,numero_documento,nombre,apellido,telefono,correo_electronico,firma,rol,contraseña,estado_usuario} = req.body;


    // que mande a la base de datos un boolean con texto
    const estado_Usuario = estado_usuario === 'activo' ? true: false;

    //Verificar si el correo ya esta creado
    let verificarCorreo = 'SELECT * FROM usuario WHERE correo_electronico = ?'
    db.query(verificarCorreo,[correo_electronico], (error,result) =>{
        if(error){
            console.log("Error en la verificacion del correo ",error);
            res.status(500).send({message: "Error en la verificacion del correo"})
        }

        if(result.length > 0){
            return res.status(400).send({ message: "El correo electrónico ya está registrado" });
        }

    //Encriptar la contraseña
    const cantidadEncriptacion = 10;

    bcrypt.hash(contraseña,cantidadEncriptacion,(error,hash) =>{
        if(error){
            console.log("Error al encriptar la contraseña: ", error);
            return res.status(500).send({ message: "Error al encriptar la contraseña" });
        }
    

    

        //Crear los usuarios
    let query = 'INSERT INTO usuario (`id_usuario`,`tipo_documento`, `numero_documento`, `nombre`, `apellido`, `telefono`, `correo_electronico`, `firma`, `rol`, `contraseña`, `estado_usuario`) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
    
    const datos = [
        id_usuario,
        tipo_documento,
        numero_documento,
        nombre,
        apellido,
        telefono,
        correo_electronico,
        firma,
        rol,
        hash,
        estado_Usuario
    ];

    db.query(query,datos, (error,result) =>{
        if (error) {
            console.log("Error en la creacion de los datos ",error);
            res.status(500).send({message: "Error en la creacion de usuario"})
        }else{
            res.status(201).send({ message: "Usuario creado exitosamente", data: result });
        }
    })
        })
    })
})



// obtener los usuarios 
app.get('/ver', (req, res) => {
    const {numero_documento, nombre, apellido, correo_electronico} = req.query

    let query = 'SELECT * FROM usuario WHERE 1=1';
    const parametros = [];

    if (numero_documento){
        query += ' AND numero_documento LIKE ?';
        parametros.push(`%${numero_documento}%`);
    }
    if (nombre){
        query += ' AND nombre LIKE ?';
        parametros.push(`%${nombre}%`);
    }
    if (apellido){
        query += ' AND apellido LIKE ?';
        parametros.push(`%${apellido}%`);
    }
    if (correo_electronico){
        query += ' AND correo_electronico LIKE ?';
        parametros.push(`%${correo_electronico}%`);
    }
    console.log('Consulta SQL:', query);
    console.log('Parámetros:', parametros);


    db.query(query, parametros, (error, result) => {
        if (error) {
            console.log("Error en la consulta ",error);
            res.status(500).send({message: "Error en la consulta"})
        } 
        res.json(result)
    })
})




app.listen(port, () =>{
    console.log(`Servidor corriendo en http://localhost:${port}`)
})