// load the things we need
const express = require('express');
const app = express();
const fs = require('fs')

const port = 8080

app.use(express.static(__dirname + '/public'));


const router = express.Router()
router.use(express.urlencoded({extended: true}))
router.use(express.json())
const server = app.listen(port,()=>{
  console.log(`server up and running at port ${server.address().port}`)
})

server.on('error',(error)=> console.log(`hubo error en  ${error}` ) )

// set the view engine to ejs
app.set('view engine', 'ejs');


const timestamp = new Date().toLocaleString();

function random(length) {
    let result           =  '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
 }
 return result;
}

router.get('/', function(req, res) {
    res.render('pages/index');
});



router.get('/carrito', (req,res) => {

try{
          function getProducts(){
          const contenido = fs.readFileSync('./products.txt', 'utf-8') 
          const json = JSON.parse(contenido.split(","))
          return json
          }
        }
    
      catch(err) {
        console.log("contenido no leido",err)
      }   

const products = getProducts()

res.render('pages/carrito', {
        products: products
    });

})



//GET: '/' - Me permite listar todos los productos disponibles

router.get('/api/productos', (req,res) => {

let product_list

try{
          function getId(){
          const contenido = fs.readFileSync('./products.txt', 'utf-8') 
          const json = JSON.parse(contenido.split(","))
          product_list = json
          return json
          }
        }
    
      catch(err) {
        console.log("contenido no leido",err)
      } 

if (getId() === undefined) {
res.json(product_list)}
else {res.json(getId())}

console.log('Mostrando productos disponibles en consola')
})

//GET: '/:id?' - Me permite listar un producto por su id

router.get('/api/productos/:id', (req,res) => {

try{
          function getId(){
          const contenido = fs.readFileSync('./products.txt', 'utf-8') 
          const json = JSON.parse(contenido.split(","))
          return json.find(product => product.id == req.params.id)
          }
        }
    
      catch(err) {
        console.log("contenido no leido",err)
      } 

if(getId() == 'undefined') {res.json({ error : 'producto no encontrado' })}

else {res.json(getId())}  

})


//POST: '/' - Para incorporar productos al listado (usuarios y admins)

router.post(['/','/api/productos'], (req,res) => {
let setId
try{
      
         let result = req.body; 
      
          function postProducts(){
            //En este punto es un string
            const contenido = fs.readFileSync('./products.txt', 'utf-8') 
            //Aqui ya es un objeto
            let json = []
              if(contenido.length > 0) {json = JSON.parse(contenido.split(","))}
              const body = result
              setId = json.length + 1
              body.id = setId
              body.timestamp = timestamp
              body.sku = random(5)
              json.push(body)
              return json
          }
        }
    
      catch(err) {
        console.log(err)
      }   


// De Objeto, lo vuelvo a pasar a string con stringify

const info = JSON.stringify(postProducts(),null,2)

// finalmente, sobre escribo el contenido del archivo txt con el nuevo array hecho string

    fs.writeFile('./products.txt' , info , (error, data) => {

//Si hay algun error al guardar el archivo, mostrar en consola tal error
      if(error){
        console.log(error)
      } 
//Si no hay ningun error, mostrar mensaje de exito en la consola
      else {
        console.log('Productos agregados')
      }
    })

if(req.originalUrl === '/api/productos') {res.json({mensaje: 'producto agregado con exito'})}
else {res.render('pages/index')};
})



//PUT: '/:id' - Actualiza un producto por su id (admins)

router.put('/api/productos/:id', (req,res) => {

let json

try{
          function putId(){
          const contenido = fs.readFileSync('./products.txt', 'utf-8') 
          json = JSON.parse(contenido.split(","))
          const selected = json.find(product => product.id == req.params.id)
          selected.title = req.body.title
          selected.price = req.body.price
          selected.thumbnail = req.body.thumbnail
          selected.description = req.body.description
          selected.stock = req.body.stock
          return json
          }
        }
    
      catch(err) {
        console.log(err)
      } 

// De Objeto, lo vuelvo a pasar a string con stringify

    const info = JSON.stringify(putId(),null,2)

// finalmente, sobre escribo el contenido del archivo txt con el nuevo array hecho string

    fs.writeFile('./products.txt' , info , (error, data) => {

//Si hay algun error al guardar el archivo, mostrar en consola tal error
      if(error){
        console.log(error)
      } 
//Si no hay ningun error, mostrar mensaje de exito en la consola
      else {
        console.log('Producto actualizado')
      }
    })

res.json({mensaje: 'producto actualizado con exito'})

})


//DELETE: '/:id' - Borra un producto por su id


router.delete('/api/productos/:id', (req,res) => {

try{
          function deleteId(){
          const contenido = fs.readFileSync('./products.txt', 'utf-8') 
          const json = JSON.parse(contenido.split(","))
          const filtered = json.filter(product => product.id != req.params.id)
          return filtered
        }
        }
    
      catch(err) {
        console.log(err)
      } 

// De Objeto, lo vuelvo a pasar a string con stringify

    const info = JSON.stringify(deleteId(),null,2)

// finalmente, sobre escribo el contenido del archivo txt con el nuevo array hecho string

    fs.writeFile('./products.txt' , info , (error, data) => {

//Si hay algun error al guardar el archivo, mostrar en consola tal error
      if(error){
        console.log(error)
      } 
//Si no hay ningun error, mostrar mensaje de exito en la consola
      else {
        console.log(`producto ${req.params.id} eliminado con exito`)
      }
    })

res.json({mensaje: `producto ${req.params.id} eliminado con exito`})

})

// CART 

//POST: '/' - Crea un carrito y devuelve su id.

router.post('/api/carrito', (req,res) => {

let setId

try{
                
      
          function postCart(){
            //En este punto es un string
            const contenido = fs.readFileSync('./cart.txt', 'utf-8') 
            //Aqui ya es un objeto
            let newCart = []
            if(contenido.length > 0) {newCart = JSON.parse(contenido.split(","))}
            setId = newCart.length + 1
            cartObj = {}
            cartObj.id = setId
            cartObj.timestamp = timestamp
            cartObj.productos = []
            newCart.push(cartObj)
            return newCart
          
          }
        }
    
      catch(err) {
        console.log(err)
      }   



// De Objeto, lo vuelvo a pasar a string con stringify

const info = JSON.stringify(postCart(),null,2)

// finalmente, sobre escribo el contenido del archivo txt con el nuevo array hecho string

    fs.writeFile('./cart.txt' , info , (error, data) => {

//Si hay algun error al guardar el archivo, mostrar en consola tal error
      if(error){
        console.log(error)
      } 
//Si no hay ningun error, mostrar mensaje de exito en la consola
      else {
        console.log(`Carrito ${setId} creado`)
      }
    })

res.json({mensaje: `Carrito creado con exito. id asignado: ${setId} `})

})

//POST: '/:id/productos/itemId' - Para incorporar productos al carrito por su id de producto (admins)


router.post('/:id/productos/:itemId', (req,res) => { 

let product_list 

let productId_params = parseInt(req.params.itemId)

try{
          function getProductId(){
          const contenido = fs.readFileSync('./products.txt', 'utf-8') 
          const json = JSON.parse(contenido.split(","))
          product_list = json
          return json.find(product => product.id == productId_params)
          }
        }
    
      catch(err) {
        console.log("contenido no leido",err)
      } 

let cartId = parseInt(req.params.id)

let NewCartId

try{
                
      
          function postCart(){
            //En este punto es un string
            const contenido = fs.readFileSync('./cart.txt', 'utf-8') 
            //Aqui ya es un objeto
            newCart = JSON.parse(contenido.split(","))
            if(cartId === 1) {NewCartId = 0}
              else {NewCartId = cartId - 1}
            productInCart = newCart[NewCartId].productos
            productInCart.push(getProductId())
            return newCart
          }
        }
    
      catch(err) {
        console.log(err)
      } 



const info = JSON.stringify(postCart(),null,2)

console.log(info)


// finalmente, sobre escribo el contenido del archivo txt con el nuevo array hecho string

    fs.writeFile('./cart.txt' , info , (error, data) => {

//Si hay algun error al guardar el archivo, mostrar en consola tal error
      if(error){
        console.log(error)
      } 
//Si no hay ningun error, mostrar mensaje de exito en la consola
      else {
        console.log('Productos agregados a carrito')
      }
    })

if(NewCartId === 0) {res.json({mensaje: `Producto ${productId_params} agregado con éxito al carrrito ${cartId}`})}
else {res.json({mensaje: `Producto ${productId_params} agregado con éxito al carrrito ${NewCartId}`})}

})


// DELETE: '/:id' - Vacía un carrito y lo elimina. (admins)

router.delete('/:id/productos', (req,res) => { 

let cartId = parseInt(req.params.id)

try{
          function deleteCart(){
          const contenido = fs.readFileSync('./cart.txt', 'utf-8') 
          const json = JSON.parse(contenido.split(","))
          const filtered = json.filter(cart => cart.id != cartId)
          return filtered
          }
        }
    
      catch(err) {
        console.log("contenido no leido",err)
      } 



const info = JSON.stringify(deleteCart(),null,2)

console.log(info)


// finalmente, sobre escribo el contenido del archivo txt con el nuevo array hecho string

    fs.writeFile('./cart.txt' , info , (error, data) => {

//Si hay algun error al guardar el archivo, mostrar en consola tal error
      if(error){
        console.log(error)
      } 
//Si no hay ningun error, mostrar mensaje de exito en la consola
      else {
        console.log(`Carrito ${cartId} eliminado`)
      }
    })


res.json({mensaje: `Carrrito ${cartId} elimiado con éxito`})

})


// DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de producto (admins)

router.delete('/:id/productos/:itemId', (req,res) => { 

let productId_params = parseInt(req.params.itemId)

let cartId = parseInt(req.params.id)

try{
                
      
          function newCart(){
            //En este punto es un string
            const contenido = fs.readFileSync('./cart.txt', 'utf-8') 
            //Aqui ya es un objeto
            const json = JSON.parse(contenido.split(","))
            const filteredCart = json.filter(cart => cart.id == cartId)
            const UnfilteredCart = json.filter(cart => cart.id != cartId)
            const filteredProduct = filteredCart[0].productos.filter(product => product.id != productId_params)
            filteredCart[0].productos = filteredProduct
            const newCart = UnfilteredCart.concat(filteredCart)
            return newCart
          }
        }
    
      catch(err) {
        console.log(err)
      }


const info = JSON.stringify(newCart(),null,2)


// finalmente, sobre escribo el contenido del archivo txt con el nuevo array hecho string

    fs.writeFile('./cart.txt' , info , (error, data) => {

//Si hay algun error al guardar el archivo, mostrar en consola tal error
      if(error){
        console.log(error)
      } 
//Si no hay ningun error, mostrar mensaje de exito en la consola
      else {
        console.log('Carrito eliminado')
      }
    })


res.json({mensaje: `Producto ${productId_params} elimiado con éxito del carrrito ${cartId}`})

})

// GET: '/:id/productos' - Me permite listar todos los productos guardados en el carrito(admin)

router.get('/:id/productos', (req,res) => { 

let cartId = parseInt(req.params.id)

try{
                
      
          function getCart(){
            //En este punto es un string
            const contenido = fs.readFileSync('./cart.txt', 'utf-8') 
            //Aqui ya es un objeto
            const json = JSON.parse(contenido.split(","))
            const selected = json.find(cart => cart.id == cartId)
            return selected
          }
        }
    
      catch(err) {
        console.log(err)
      }


const info = JSON.stringify(getCart(),null,2)


res.json(getCart())

})

app.use('/', router)
