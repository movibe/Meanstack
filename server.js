var express = require("express");
var app = express();
var cors = require("cors");
var bodyParser = require("body-parser");
var port = 3000;
var mongoose = require("mongoose");

app.use(cors());
app.use(bodyParser());
// Produtos
mongoose.connect("mongodb://localhost/stack");

// Mongo Schemas
var Schema = mongoose.Schema;
var Product = new Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String, required:true},
    images: [Images],
    modified: {type: Date, default: Date.now}
});

var Sizes = new Schema({
    name: {type: String, required: true},
    avaible: {type: Number, required: true, min:0 , max: 1000},
    sku: {type: String, required: true, validate: [/[a-zA-Z0-9]/, 'Product sku should only have letters and numbers']},
    price: {type: Number, required: true, min: 0}
});

var Images = new Schema({
   kind: {type: String, enum: ['thumbnail','catalog','detail','zoom'], required: true},
   url: {type: String, required: true}
});

var Variants = new Schema({
   color: {type: String, images: [Images], sizes: [Sizes]}
});

var Categories = new Schema({
   name: {type: String, required: true}
});

var Catalogs = new Schema({
   name: {type: String, required: true}
});

// Models
var ProductModel = mongoose.model('Product', Product);
var SizeModel = mongoose.model('Sizes', Sizes);
var ImageModel = mongoose.model('Images', Images);
var VariantModel = mongoose.model('Variants', Variants);
var CategoryModel = mongoose.model('Categories', Categories);
var CatalogModel = mongoose.model('Catalogs', Catalogs);

app.get("/api", function (req, res) {
    res.send("Api running");
});

// List
app.get("/api/product", function (req, res) {
    return ProductModel.find(function (err, products) {
        if(!err){
            return res.send(products);
        } else {
            console.log(err);
        }
    });

});

// Add
app.post("/api/product", function (req, res) {
    console.log("POST:");
    console.log(req.body);

    var product = new ProductModel({
        name: req.body.name,
        description: req.body.description,
        images: [Images]
    });
    product.save(function (err) {
        if(!err){
            console.log("Produto cadastrado");
        } else {
            console.log(err)
        }
        return res.send(product);
    });
});

// Update
app.put("/api/product", function (req, res) {
    console.log("PUT");
    ProductModel.findById(req.body.id, function (err, product) {
        product.name = req.body.name;
        product.description = req.body.description;
        product.images = req.body.images;
        return product.save(function (err) {
            if (!err){
                console.log("Produto alterado");
            } else {
                console.log(err);
            }
            res.send(product);
        });
    });

});

// Delete
app.delete("/api/product/:id", function (req, res) {
    return ProductModel.findById(req.params.id, function (err, product) {
        return product.remove(function (err) {
            if(!err){
                return res.send("");
                console.log("Produto deletado");
            } else {
                console.log(err);
            }
        });
    });
});

console.log("Start Server port: " + port);
app.listen(port);

