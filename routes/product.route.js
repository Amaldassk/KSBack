import express from 'express'
import { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from '../controllers/product.controller.js';
import fileUpload from '../middlewares/post/fileUpload.js';
const router = express.Router();

router.post('/', fileUpload, createProduct);

router.get('/:id', getProduct);
router.get('/', getAllProducts);

router.delete('/:id', deleteProduct);

router.put('/:id', updateProduct);


export default router;