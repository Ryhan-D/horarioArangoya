const { createReadStream } = require('fs')
const { createServer } = require('http')
const path = require('path')



// configuramos con una variable de entorno el puerto
const { PORT = 4000 } = process.env;

// creamos con el content type del archivo que vamos a servir
const HTML_CONTENT_TYPE = 'text/html';
const CSS_CONTENT_TYPE = 'text/css';
const JS_CONTENT_TYPE = 'text/javascript';
const IMG_CONTENT_TYPE = "image/png";



const requestListener = (req, res) => {
    const { url } = req;
    let statusCode = 200;
    let contentType = HTML_CONTENT_TYPE;
    let stream

    if (url === '/') {
        stream = createReadStream(`./index.html`)
    } else if (url.match(".\.css$")) {
        contentType = CSS_CONTENT_TYPE;
        stream = createReadStream("./" + url);
    } else if (url.match(".\.js$")) {
        contentType = JS_CONTENT_TYPE;
        stream = createReadStream("./" + url);
    } else if (url.match(".\.png$")) {
        contentType = IMG_CONTENT_TYPE;
        stream = createReadStream("./" + url);
    }else if (url.match(".\.gif$")) {
        contentType = IMG_CONTENT_TYPE;
        stream = createReadStream("./" + url);
    }
    else {
        statusCode = 404;
    }

    res.writeHead(statusCode, { 'Content-Type': contentType })

    if (stream) stream.pipe(res);
    else return res.end('not found')

}
// creamos un servidor con el requestListener
const server = createServer(
    requestListener,
    console.log("servidor localhost iniciado correctamente wey puerto 4000")

);

// hacemos que el servidor escuche el puerto configurado
server.listen(PORT);