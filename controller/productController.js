let { QueryTypes } = require('sequelize')
const joi = require('joi')
const { Users, category, Product, addJoi, updateJoi } = require('../model')
const uploadImage = require('../config/imageFunc')
const asyncError = require('../middleware/asyncError')
const CustomError = require('../services/CustomError')
let control = {}

control.viewProduct = async (req, res, next) => {
    try {
        let data = await Users.sequelize.query("select * from product left join category on category = category.id ", { type: QueryTypes.SELECT, logging: false })
        return res.send(data)
    } catch (error) {
        return next(error)
    }
}
//  for ejs template engine 
control.viewProductEjs = async (req, res, next) => {
    try {
        let data = await Users.sequelize.query("select * from product left join category on category = category.id ", { type: QueryTypes.SELECT, logging: false })
        return res.render('index', { data })
    } catch (error) {
        return next(error)
    }
}

control.addProduct = async (req, res, next) => {
    if (!req.user || !req.user.admin || req.user.admin !== "admin") {
        return res.send("you are Not admin")
    }
    // Image uploading function 
    let file = await uploadImage(req, res, 'product')
        .catch(err => { return next(err) })
    // Cheking body is Fields  valid or not
    let valid = addJoi(req.body)
    if (valid) {
        return next(valid)
    }
    // Adding info in data base 
    let { name, color, stock, gender, type, size, MRP, Discount, description } = req.body
    if (!name || !color || !stock || !gender || !type || !size || !MRP || !Discount || !description) {
        return next(CustomError.allFieldAreRequired())
    }
    try {
        //  Image Uploading 

        let url = file.uploadFolder + file.filename

        let Category = await category.create({
            type, description
        }, { logging: false }).catch(err => { return next(err) })

        let product = await Product.create({
            userId: req.user.id, name, color, stock, gender,
            size,
            MRP,
            Discount,
            price: MRP - Discount, category: Category.id,
            url
        }, { logging: false }).catch(err => { return next(err) })
        return res.send({ messag: 'add product ', result: product })
    } catch (error) {
        return next(error)
    }

}

control.updateProduct = async (req, res, next) => {
    if (!req.user || !req.user.admin || req.user.admin !== "admin") {
        return res.send("you are Not Allow To Add Product !")
    }
    let valid = updateJoi(req.body)
    if (valid) {
        return next(valid)
    }
    let { name, color, stock, gender, type, size, MRP, Discount, description, url } = req.body
    try {
        //  Finding Product 
        let data = await Product.findOne({ where: { id: req.params.id }, logging: false })
            .catch(err => { return next(err) });

        if (data === null) {
            return res.send({ status: "Success", messag: "No Product Found" })
        }
        // Deleting record from Product table
        let product = await Product.update({ name, color, stock, gender, size, MRP, Discount, url }, { where: { id: req.params.id }, logging: false })
            .catch(err => { return next(err) });
        // Deleting record from category table
        let Category = await category.update({ type, description }, { where: { id: data.category }, logging: false })
            .catch(err => { return next(err) })
        //  Checking value is present or not 
        if (product) {
            let updateProduct = await Product.findOne({ where: { id: req.params.id }, logging: false }).catch(err => { return next(err) })
            return res.status(200).send({ status: "sucess", messag: "Product is update", data: { updateProduct } })
        }

        return res.status(200).send({ status: "sucess", messag: "Product is Not Update", data: { product, Category } })
    } catch (error) {
        return next(error)
    }
}

control.deleteProduct = async (req, res, next) => {
    try {
        let data = await Product.findOne({ where: { id: req.params.id }, logging: false })
            .catch(err => { return next(err) });
        if (data == null) {
            return res.send({ status: "Fail", messag: "No Prodect Found" })
        }
        let product = await Product.destroy({ where: { id: req.params.id }, logging: false })
            .catch(err => { return next(err) });
        let Category = await category.destroy({ where: { id: data.category }, logging: false })
            .catch(err => { return next(err) });
        if (product !== 0) {
            return res.send({ status: "Success", messag: "Prodect Deleted", count: `Product Count ${product} ${Category}` })
        }
        return res.send({ status: "Fail", messag: "No Prodect Found" })
    } catch (error) {
        return next(error)
    }
}

module.exports = control
