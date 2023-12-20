import productModel from "../models/product.model.js"

const createProduct = async(req, res) => {

    const defaultImage = 'https://raw.githubusercontent.com/Amaldassk/public_files/main/noimage.png';

    try{
        const { userId, file, fileUrl, fileType } = req;
        const {productName, size, gauge, color, material, powderCoated, price} = JSON.parse(req.body.productDetails);

        let newProduct = new productModel({
            productName: productName,
            size: size,
            gauge: gauge,
            color: color ? color : 'olive green',
            images: fileUrl ? fileUrl : defaultImage,
            material: material,
            powderCoated: powderCoated,
            price: price,
        });
        
        await newProduct.save();
        if(newProduct.isNew){
            throw new Error('Failed to add new product');
        }

        res.status(201).json({
            message:'Product added successfully'+fileUrl,
            newProduct
        });
        // const newProduct = await productModel.create(req.body);
        //res.status(201).json(newP);
    } catch(err){
        console.log(err);
        throw new Error(err);
    }
}

const getProduct = async(req, res) => {
    const id = req.params.id;
    try{
        const getAProduct = await productModel.findById(id);
        res.json(getAProduct);
    } catch(err){
        throw new Error(err);
    }
}

const getAllProducts = async(req, res) => {
    try{
        const getProducts = await productModel.find();
        res.json(getProducts);
    } catch(err){
        throw new Error(err);
    }
}

const deleteProduct = async(req, res) => {
    const id = req.params.id;
    try{
        const deleteProduct = await productModel.findByIdAndDelete(id);
        res.json(deleteProduct);
    } catch(err){
        throw new Error(err);
    }
}

const updateProduct = async(req, res) => {
    const id = req.params.id;
    try{
        const updateProduct = await productModel.findByIdAndUpdate(id, req.body,{new:true});
        res.json(updateProduct);
    } catch(err){
        throw new Error(err);
    }
}

export {createProduct, getProduct, getAllProducts, deleteProduct, updateProduct}