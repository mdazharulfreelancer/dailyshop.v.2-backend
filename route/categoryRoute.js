const express = require("express")
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require("multer");
const { createCategory, createSubCategory, getAllCategory, getCategoryById, deleteCategory, getAllSubCategory, getSubCategoryById, deletesubcategoryById } = require("../controller/categoryController")


// EXchange to express to router-----------md azharul
const router = express.Router()

// // upload image
cloudinary.config({
    cloud_name: 'daxvmjaff',
    api_key: '349718663461614',
    api_secret: 'L2T3hMpJNGFmPK8UysYBNrELsSM',
  });
 
//upload image 2nd part
  // Set up Multer for multiple file uploads
const storage = multer.memoryStorage()

const upload = multer({
    storage : storage,
    limits :  { fileSize: 1024 * 1024 }
}).array("categoryImage", 10)

const uploadSubCategory = multer({
  storage : storage,
  limits :  { fileSize: 1024 * 1024 }
}).array("subcategoryImage", 10)

router.post("/category/new", upload , createCategory)
router.get("/all-category",  getAllCategory)
router.get("/category/:id", getCategoryById)
router.delete("/category-delete/:id", deleteCategory)


//subCategory part --start --here
router.post("/subcategory/new/:id", uploadSubCategory, createSubCategory)
router.get("/all-subcategory",  getAllSubCategory)
router.get("/subcategory/:id", getSubCategoryById)
router.delete("/subcategory-delete/:id", deletesubcategoryById)

module.exports = router