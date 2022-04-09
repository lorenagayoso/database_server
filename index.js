// importar credenciales guardadas en el archivo de options
const {options} = require('./options/mariaDB')

// importar el modulo knex con el detalle de credenciales en una variable
const knex = require('knex')(options)

// crear una tabla en mi ddbb desde knex con callback func
/*
knex.schema.createTable('productos',(table) => {
	table.increments('id')
	//#como segundo param puedo incorporar la length de la columna
	table.string('title')
	table.decimal('price',8,2)
	table.string('thumbnail')
	table.string('description')
	table.integer('stock')
	table.timestamp('timestamp').defaultTo(knex.fn.now())
	table.string('sku',5)
})

// Después del callback, debo definir ambas posibilidades del método de respuesta

	// Si todo ocurre ok, entonces print message en consola
	.then(() => console.log("table created"))
	// Si hay algún error, muestra el error en consola
	.catch((err) => {console.log(err); throw err})
	// Después que alguna de las opciones anteriores suceda, cerramos las conexion con destroy
	.finally(() => {
		knex.destroy();
	});

const id = 3

knex
.from('productos')
.select('*')
.where('id',id)
.then((data) => {
	for (registro of data){
		console.log(`${registro.id} ${registro.name} ${registro.price}`)
	}
})*/

knex('productos')
  .where('id',1)
  .del()
  .then(() => console.log("row dropped"))