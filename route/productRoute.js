// internal all require File
const express = require("express")
const {createproduct, uploadimage, getAllProductHomePageJustForYou, getAllProductHomeLatestProduct, getAllRecomandedProduct, getAllCategoryProduct, getAllSubCategoryProduct, getAllSpicialProduct, getAllSpicialCategoryTopProduct, getProductDitalsById, getAllProductAdmin, productDeleteAdmin, getProductDitalsByIdName, productUpdateAdmin, getAllProductHomePageJusForYouPhoneRight, getAllProductHomePageJusForYouPhoneLeft, getAllProductFlashSalePc, getAllProductFlashSalePhone, getTodayProducts, getAllProductFlashSalePcPageSecend, getNewProduct, getNewProductRight, getAllProductLowPrice, getAllProductLowPriceRight, getNewProductPhone, getAllProductLowPricePhone, getFreeDeProductPhone, getAllProductHomePageJusForYouPc, getAllProductSearchPagePC, getNewProductPC, getCategoryProductPhone, getCategoryProductPC} = require("../controller/productController")
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require("multer");
const Upload = require("../models/upload")

//exChange express  to router
const router = express.Router();

//mdajharul869@gmail.com --- Ajharul#321
// // upload imadge
// cloudinary.config({
//     cloud_name: 'daxvmjaff',
//     api_key: '349718663461614',
//     api_secret: 'L2T3hMpJNGFmPK8UysYBNrELsSM',
//   });
 //freelancermdazharul 
cloudinary.config({
    cloud_name: 'djkxkfslu',
    api_key: '498798943269439',
    api_secret: '3yyIxgc1U-zQKrTUBMj1ferd1mc',
  });
 

  // Set up Multer for multiple file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload =  multer({ 
    storage : storage,
    limits: { fileSize: 1024 * 1024 } }).array('productimage', 10);
       // 'files' is the field name for multiple files, and 10 is the maximum number of files allowed.

      
      // All products Route start ----------------------
router.post("/product/new" , upload,  createproduct )
router.route("/home-just-for-products").get(getAllProductHomePageJustForYou)
router.route("/home-latest-for-products").get(getAllProductHomeLatestProduct)
router.route("/recomanded-for-products/:name/:id").get(getAllRecomandedProduct)
router.route("/category-page-products/:name").get(getAllCategoryProduct)
router.route("/subcategory-page-products/:name").get(getAllSubCategoryProduct)
router.route("/spicialcategorytop-page-products/:name").get(getAllSpicialCategoryTopProduct)
router.route("/product-ditals/:id").get(getProductDitalsById)
router.route("/product-ditals/:id/:name").get(getProductDitalsByIdName)
router.route('/product-update/:id').put(upload, productUpdateAdmin);
//phone for product route-----------------------------

router.route('/get-all-product-just-for-you-phone-left').get(getAllProductHomePageJusForYouPhoneLeft)
router.route('/new-product-phone').get(getNewProductPhone);
router.route('/low-price-products-phone').get(getAllProductLowPricePhone)
router.route('/freedalivary-product-phone').get(getFreeDeProductPhone)
router.get('/category-products', getCategoryProductPhone)
//phone for product route-----------------------------


//Pcccccccc for product route-----------------------------
router.route("/home-just-for-products-pc").get(getAllProductHomePageJusForYouPc)
router.get("/search-productpc", getAllProductSearchPagePC)
router.get('/get-new-product-pc' , getNewProductPC)
router.get('/get-category-product-pc' , getCategoryProductPC)
//Pcccccccc for product route-----------------------------
router.route('/get-all-product-just-for-you-phone-right').get(getAllProductHomePageJusForYouPhoneRight)
router.route('/flash-sale/:resultpage').get(getAllProductFlashSalePc);
router.route('/flash-sale-phone/:resultpage').get(getAllProductFlashSalePhone);
router.route('/today-product').get(getTodayProducts);
router.route('/flash-sale-pc-page').get(getAllProductFlashSalePcPageSecend);

router.route('/new-product-right').get(getNewProductRight)
router.route('/low-price-products').get(getAllProductLowPrice)


//admin 

router.route("/get-all-product-admin").get(getAllProductAdmin)
router.route('/delete-product/:id').delete(productDeleteAdmin);
// All products Route start ----------------------

  router.post("/uploadimage" , upload, uploadimage )



  const serverArray = [1, 2, 3, 4, 5, 6, 7];

  router.get('/getRandomNumber', (req, res) => {
  const shuffledArray = [...serverArray].sort(() => Math.random() - 0.5);
  const randomNumber = shuffledArray.pop();

  res.json({ randomNumber });
});

module.exports = router