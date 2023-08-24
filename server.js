const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)
const io = require("socket.io")(server, {
	cors: {//Que acepte peticiones del siguiente origin (pertenece al front)
		origin: "http://localhost:3000",
		methods: [ "GET", "POST" ]
	}
})

//Crear conexion socket
io.on("connection", (socket) => {

	//Emit Enviar un mensaje al cliente
	//On Recibir un mensaje del cliente
	//Recibo un id unico para poder identificarme en el servidor socket
	socket.emit("me", socket.id)

	socket.on("disconnect", () => {
		//Enviamos un mensaje o un evento (en este caso un mensaje) hacia todos los clientes conectados
		//excepto al propio cliente que genero el evento 'disconnect' 
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		//Envair determinado evento y/o mensaje (lo que va dentro del parametro emit) hacia determinados
		//usuarios (los que estan definidos en el parametro to() )
		//to(clienteA)
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	})
})

server.listen(5000, () => console.log("server is running on port 5000"))
