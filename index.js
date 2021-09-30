const express = require('express');
const app = express();
const path = require('path');
const Product = require('./models/product');
const methodOverride = require('method-override');

const mongoose = require('mongoose');
const { findById } = require('./models/product');

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(data => {
        console.log('MONGOOSE WORKING');
    }).catch(err => {
        console.log('sheesh MONGOOSE NOT WORKING');
        console.log(err);
    })


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const categories = ['fruit', 'vegetable', 'dairy'];



app.get('/products', async (req, res) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category });
        res.render('index.ejs', { products, category })
    } else {
        const products = await Product.find({});
        res.render('index.ejs', { products, category: 'Products'})
    }
})

app.get('/products/new', async (req, res) => {
    res.render('new.ejs', { Product, categories });
})

app.post('/products', (req, res) => {
    const newProduct = new Product(req.body);
    newProduct.save();
    res.redirect('/products');
})


app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findOneAndDelete(id);
    res.redirect('/products');
})

app.get('/products/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('details.ejs', { product });
})

app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('edit.ejs', { product, categories });
})

app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidations: true, new: true });
    res.redirect(`/products/${product._id}`);
})


app.listen(3000, () => {
    console.log('Listening to port 3000');
})