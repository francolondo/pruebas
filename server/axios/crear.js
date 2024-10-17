// http://localhost:3000/crear
const axios = require('axios');

const crear = async () =>{
    try{
        const respuesta = await axios.post('http://localhost:3000/crear',{
            parametros:{
                id_usuario: null,
                tipo_documento: '',
                numero_documento: '',
                nombre: '',
                apellido: '',
                telefono: '',
                correo_electronico: '',
                firma: '',
                rol: '',
                contraseña: '',
                estado_usuario: ''
            }
        })
    }
    catch{

    }
}
