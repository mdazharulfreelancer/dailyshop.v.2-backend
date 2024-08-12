// ALl InterNalll Package Require
const express = require("express")
const cashAsyncError = require("../middleware/cashAsyncError")
const ErrorHandler = require("../utilities/errorHandler")
const Product = require("../models/productModels")
const Upload = require("../models/upload")
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const ApiFeature = require("../utilities/apifeature")
const { set } = require("mongoose")
const cron = require('node-cron');
const { resolve } = require("path")

// our All Product create -- getAllproducts--getprodcuts---adimin--everything product---start

function uploadPromises (allowedFileTypes, req, next,Folder) {
  req.files.map((file) =>{
    if(!allowedFileTypes.includes(file.mimetype)){
      return next(new ErrorHandler("Please Enter Selcet A Valid Image", 400));
    }
    return new Promise((resolve, reject) =>{
      cloudinary.uploader.upload_stream({resource_type:'auto', folder:`${Folder}`}, (error, result) =>{
        if(error){
          reject(error)
        }else{
          resolve(result)
        }
      }).end(file.buffer)
    })
  })
  }
  
//create product ------------Md Azharul-----------md Azharul----------------
 exports.createproduct = cashAsyncError(async( req, res, next) =>{
      //upload image sestyem managemant-----------------------create---md Azharul----------
      const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif','.webp'];
      const uploadPromise  = req.files.map((file) =>{
        // fast check image type
        if(!allowedFileTypes.includes(file.mimetype)){
            return res.status(400).json({error : "please Enter a Valid Image Like jpeg, png"})
        }
        // image rady to ites simple pass the neew promis and cheng all 
      
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'auto',  folder :"Categories" }, (error, result) => {
       
                if (error) {
                  reject(error)
                } else {
                    resolve(result)
                }
              }).end(file.buffer);
           });

    })
     const cloudinaryResponses = await Promise.all(uploadPromise);
        const productimage = cloudinaryResponses?.map((response) => ({
            originalname: response.original_filename,
            cloudinaryId: response.public_id,
            url: response.secure_url,
          }))
//upload image sestyem managemant-----------------------create---md Azharul----------
    const {productname , regularprice , currentprice, description, category, subcategory, productStock,color,size,freedalivary } = req.body
    //images upload cretae product  ends this uplaod image

    const product = await Product.create({
        productimage,
        productname,
        regularprice,
        currentprice,
        description,
        category,
        subcategory,
        productStock,
        color,
        size,
        freedalivary
    })

    res.status(201).json({
        success : true,
        product
    })
})

 exports.getTodayProducts = cashAsyncError(async(req, res, next) => { 
    let today = new Date();
    today.setHours(0, 0, 0, 0);
  
    let tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() - 3);
    const products = await Product.find({
      date: {
        $gte: tomorrow,
        $lte: today,
      },
    });

    const filter = products.length
  
    res.status(200).json({ 
        success: true,
        products,
        filter
    })
  }
);

// random product when you refresh its given a random index to your products
function getRandomProducts (totalproduct , filterproduct, products) {

    const randomProducts = [];
    const useindexs = new Set()

    while (randomProducts.length < totalproduct ){

        const randomIndex = Math.floor(Math.random() * filterproduct);

    // Ensure we don't select the same product twice
    if (!useindexs.has(randomIndex)) {
        randomProducts.push(products[randomIndex]);
        useindexs.add(randomIndex);
      }
    }

    return randomProducts

}

//get All product for justfor yoy home page this product coming database at last index to fast index all database product this constroctor catch products user-----page


exports.getAllProductHomePageJustForYou = cashAsyncError(async(req, res, next) =>{
    const resultpage = 4
    const countProduct = await Product.countDocuments()
    //
    let page = []
    for(let i = 1; i <= Math.ceil(countProduct / resultpage); i++){ 
    
      page.push(i)
    }
    page.pop()// its simplly remove last index of array

// console.log(page)
    const pageLengthpc = page.length
    const apifeature = new ApiFeature(Product.find(), req.query).search().filter()
   apifeature.paginationHomeJustForYou(resultpage)
  //  console.log(apifeature)
  
  // console.log(d)
    const productsArray = await apifeature.query.sort({ date: -1 }).exec();
    let filteredProductsCountJustforYou = productsArray.length;

     const HomeJustForYouProducts  = getRandomProducts(filteredProductsCountJustforYou, filteredProductsCountJustforYou, productsArray)
    res.status(200).json({
        success: true, 
        HomeJustForYouProducts,
        filteredProductsCountJustforYou,
        countProduct,
        resultpage,
        pageLengthpc
 
    })
})
// This is for phone   only -------------------------------------------------


  // home page for---------------------------------
  exports.getAllProductHomePageJusForYouPhoneLeft = cashAsyncError(async(req,res, next) =>{ 
      const countProduct = await Product.countDocuments()

      const resultpage = 12

      const pagecountproduct = Math.floor(countProduct / resultpage)
    //  console.log(pagecountproduct)
      const apifeature = new ApiFeature(Product.find(), req.query).filter().search()
      apifeature.paginationProduct(resultpage)

      const productsArray = await apifeature.query.sort({ date: -1 }).exec();
      let filteredProductsCountJustforYou = productsArray.length;

      const HomeForYouProPhoneleft  = getRandomProducts(filteredProductsCountJustforYou, filteredProductsCountJustforYou, productsArray)

      res.status(200).json({
          success: true, 
          HomeForYouProPhoneleft,
          filteredProductsCountJustforYou,
          countProduct,
          resultpage,
          pagecountproduct
        //  randomNumber
  
      })
  })
  // home page for---------------------------------
  //New PRoduct page for----------------------------------------
  exports.getNewProductPhone = cashAsyncError(async(req, res , next)=>{ 
    const countProduct = await Product.countDocuments()
    const resultpage = 10
    const pagecountproduct = Math.floor(countProduct / resultpage)
    const apifeature = new ApiFeature(Product.find(), req.query).filter()
    apifeature.paginationProduct(resultpage )

    const productsArray = await apifeature.query.sort({ date: -1 }).exec();
    let filteredProductsCountJustforYou = productsArray.length;
    
    const newproducts  = getRandomProducts(filteredProductsCountJustforYou, filteredProductsCountJustforYou, productsArray)
    res.status(200).json({
        success: true, 
        newproducts,
        filteredProductsCountJustforYou,
        countProduct,
        pagecountproduct,
        resultpage
    })

  })
  //New PRoduct page for----------------------------------------

  //Everuujday low price --------------------------------------
  exports.getAllProductLowPricePhone = cashAsyncError(async(req, res , next)=>{ 
      const countProduct = await Product.countDocuments()
      const resultpage = 12
      const countlowPrice = await Product.find().sort({currentprice: 1, date:-1}).exec()
      const lastresultcountlowPrice = getlast5daysproducts(countlowPrice)
      const reslutLowPriceLength = lastresultcountlowPrice.length
      const pagecountproduct = Math.floor(reslutLowPriceLength / resultpage)

      const apifeature = new ApiFeature(Product.find(), req.query).filter().search()
      apifeature.paginationProduct(resultpage)
      const productsArray = await apifeature.query.sort({currentprice: 1, date:-1}).exec();
      const  reslutLowPriceLengthPhone  = productsArray.length
      const everylowproduct  = getRandomProducts(reslutLowPriceLengthPhone, reslutLowPriceLengthPhone, productsArray)

      res.status(200).json({
          success: true, 
          everylowproduct,
          countProduct,
          resultpage,
          pagecountproduct
      
      })
    
  })
    
    function getlast5daysproducts (products) {
    
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() - 15);
      
        const productsArray = products.filter((product) => {
          const productDate = new Date(product.date);
          return productDate >= tomorrow && productDate <= today;
        });
    
      return productsArray
    }
  //get All Product freedalivary
  exports.getFreeDeProductPhone = cashAsyncError(async(req, res , next)=>{ 
    const countFreeDalivay = await Product.find({freedalivary :'yes'})
    const countProduct = countFreeDalivay.length
    const resultpage = 8
    const pagecountproduct = Math.floor(countProduct / resultpage)
    const apifeature = new ApiFeature(Product.find({freedalivary :'yes'}), req.query).filter()
    apifeature.paginationProduct(resultpage )

    const productsArray = await apifeature.query.sort({ date: -1 }).exec();
    let filteredProductsCountJustforYou = productsArray.length;
    
    const freeproducts  = getRandomProducts(filteredProductsCountJustforYou, filteredProductsCountJustforYou, productsArray)
    res.status(200).json({
        success: true, 
        freeproducts,
        filteredProductsCountJustforYou,
        countProduct,
        pagecountproduct,
        resultpage
    })

  })

  //get product category page

  exports.getCategoryProductPhone = cashAsyncError(async(req, res, next) =>{

    const countFreeDalivay = await Product.find({category :'Shirt'})
    const countProduct = countFreeDalivay.length
    const resultpage = 10
    const pagecountproduct = Math.floor(countProduct / resultpage)
    const apifeature = new ApiFeature(Product.find({category :'Shirt'}), req.query).filter()
    apifeature.paginationProduct(resultpage )

    const productsArray = await apifeature.query.sort({ date: -1 }).exec();
    let filteredProductsCountJustforYou = productsArray.length;
    
    const categoryroducts  = getRandomProducts(filteredProductsCountJustforYou, filteredProductsCountJustforYou, productsArray)
    res.status(200).json({
        success: true, 
        categoryroducts,
        filteredProductsCountJustforYou,
        countProduct,
        pagecountproduct,
        resultpage
    })
    
  })
  

// This is for phone   only -------------------------------------------------

// This is for Pc/computer   only -------------------------------------------------
exports.getAllProductHomePageJusForYouPc = cashAsyncError(async(req,res, next) =>{ 
      const countProduct = await Product.countDocuments()
      const resultpage = 12
      const pagecountproduct = Math.floor(countProduct / resultpage)

  
      const apifeature = new ApiFeature(Product.find(), req.query).filter().search()
      apifeature.paginationProduct(resultpage)

      const productsArray = await apifeature.query.sort({ date: -1 }).exec();
      let filteredProductsCountJustforYou = productsArray.length;

      const HomeForYouProductPC  = getRandomProducts(filteredProductsCountJustforYou, filteredProductsCountJustforYou, productsArray)

      res.status(200).json({
          success: true, 
          HomeForYouProductPC,
          filteredProductsCountJustforYou,
          countProduct,
          resultpage,
          pagecountproduct,
  
      })
  })

  //New PRoduct page for----------------------------------------
  exports.getNewProductPC = cashAsyncError(async(req, res , next)=>{ 
    const countProduct = await Product.countDocuments()
    const resultpage = 12
    const pagecountproduct = Math.floor(countProduct / resultpage)
    const apifeature = new ApiFeature(Product.find(), req.query).filter()
    apifeature.paginationProduct(resultpage )

    const productsArray = await apifeature.query.sort({ date: -1 }).exec();
    let filteredProductsCountJustforYou = productsArray.length;
    
    const newproducts  = getRandomProducts(filteredProductsCountJustforYou, filteredProductsCountJustforYou, productsArray)
    res.status(200).json({
        success: true, 
        newproducts,
        filteredProductsCountJustforYou,
        countProduct,
        pagecountproduct,
        resultpage
    })

  })
  //New PRoduct page for----------------------------------------

  //category page
  exports.getCategoryProductPC = cashAsyncError(async(req, res, next) =>{
    const countFreeDalivay = await Product.find({category :'Shirt'})
    const countProduct = countFreeDalivay.length
    const resultpage = 28
    const pagecountproduct = Math.floor(countProduct / resultpage)
    const apifeature = new ApiFeature(Product.find({category :'Shirt'}), req.query).filter()
    apifeature.paginationProduct(resultpage )

    const productsArray = await apifeature.query.sort({ date: -1 }).exec();
    let filteredProductsCountJustforYou = productsArray.length;
    
    const categoryroductpc  = getRandomProducts(filteredProductsCountJustforYou, filteredProductsCountJustforYou, productsArray)
    res.status(200).json({
        success: true, 
        categoryroductpc,
        filteredProductsCountJustforYou,
        countProduct,
        pagecountproduct,
        resultpage
    })
    
  })
  //category page
//search prdocuts page 
exports.getAllProductSearchPagePC = cashAsyncError(async(req,res,next) =>{
  const countProduct =  await Product.find().countDocuments()
  const resultpage = 12
  

  const apifeature = new ApiFeature(Product.find(), req.query).filter().search()
  const productsArray = await apifeature.query.sort({ date: -1 }).exec();
  let filteredProductsCountJustforYou = productsArray.length;

  const SearchProductPc  = getRandomProducts(filteredProductsCountJustforYou, filteredProductsCountJustforYou, productsArray)

  res.status(200).json({
      success: true, 
      SearchProductPc,
      filteredProductsCountJustforYou,
      countProduct,
      resultpage,
   
    

  })

})

// This is for Pc/computer   only -------------------------------------------------

exports.getAllProductHomePageJusForYouPhoneRight = cashAsyncError(async(req, res, next) =>{ 

    //pages 
    const resultpage = 2
    const countProduct = await Product.countDocuments()
    const pagecountproductright = Math.floor(countProduct / 2)
    let page = []
    for(let i = 1; i <= Math.ceil(pagecountproductright / resultpage); i++){ 

      page.push(i)
    }
    page.pop()
    page.pop()

    const pagelength = page.length
  //  console.log(pagelength)
  
   
    ///const productall = await Product.find().limit(limitnumber)
    const apifeature = new ApiFeature(Product.find(), req.query).filter().search()
    apifeature.paginationHomeJustForYouPhoneRight(resultpage)

   const productsArray = await apifeature.query
    let filteredProductsCountJustforYou = productsArray.length;


   // console.log(lastSelectedIndex)

     const HomeJustForYouProducts = getRandomProducts(filteredProductsCountJustforYou, filteredProductsCountJustforYou, productsArray)
    res.status(200).json({
        success: true, 
        HomeJustForYouProducts,
        filteredProductsCountJustforYou,
        countProduct,
        resultpage,
        pagelength,
   
 
    })
})



exports.getAllProductHomeLatestProduct = cashAsyncError(async(req, res, next) =>{
    const resultpage = 20

    const apifeature = new ApiFeature(Product.find(), req.query)
        apifeature.paginationHomeJustForYou(resultpage)
    const HomeLatestProducts = await apifeature.query.sort({date : -1}).exec()
    const filteredProductsCountLatestPRoduct = HomeLatestProducts.length

    res.status(200).json({
        success: true,
        HomeLatestProducts,
        filteredProductsCountLatestPRoduct
    })
})

exports.getAllRecomandedProduct = cashAsyncError(async(req, res, next) =>{

    const {id} = req.params
    console.log(id)
    const {name} = req.params
    console.log(name)

    const totalRrodcut = await Product.countDocuments()

    const AllRecomandedProducts = await Product.findById(id) 

    const productcategory = AllRecomandedProducts.subcategory
    console.log(AllRecomandedProducts.subcategory)

    if(!AllRecomandedProducts){
        return new ErrorHandler("No Product found", 404)
    }
    const AllRecomandedProduct = await Product.find({subcategory : productcategory}).sort({date: -1}).exec()
    const AllRecomandedProductfilter = AllRecomandedProduct.length

    res.status(200).json({
        success: true,
        AllRecomandedProduct,
        AllRecomandedProductfilter,
        totalRrodcut
    })
})


exports.getAllCategoryProduct = cashAsyncError(async(req, res , next)=>{

    const {name} = req.params

    const resultpageCategoryProduct = 20
    const countCategoryPageProduct = await Product.countDocuments()

    const apifeature = new ApiFeature(Product.find({category : name}), req.query).filter()

    const productsArray = await apifeature.query.sort({date: -1}).exec()
    const filteredProductsCountCategoryPage = productsArray.length

    const CategoryPageProduct = getRandomProducts(filteredProductsCountCategoryPage, filteredProductsCountCategoryPage, productsArray)

    res.status(200).json({
        success :true,
        CategoryPageProduct,
        resultpageCategoryProduct,
        filteredProductsCountCategoryPage,
        countCategoryPageProduct
        
    })
})
let lastSelectedIndexflash = null
exports.getAllProductFlashSalePc = cashAsyncError(async(req, res , next)=>{ 

    const resultpage = req.params.resultpage
    const countProduct = await Product.countDocuments()

    const flashsalecount = await Product.countDocuments({spicialcategorytop : "yes"})
    let page = []
    for(let i = 1; i <= Math.ceil(flashsalecount / resultpage); i++){ 
    
      page.push(i)
    }
    page.pop()
    //console.log(page)


    const currentpage = getRandomPageflashsale(page);
    //console.log(currentpage)
    
    lastSelectedIndexflash = currentpage;
    //console.log(flashsalecount)

    const flashsale = {spicialcategorytop : "yes"}

    const apifeature = new ApiFeature(Product.find(flashsale), req.query).filter().search() 
    apifeature.paginationFlashSalePc(resultpage, currentpage)
    const productsArray = await apifeature.query.sort({ date: -1 }).exec();

    let filteredProductsCountFlashSale = productsArray.length;


   // console.log(pages)
    const FlashSaleProducts = getRandomProducts(filteredProductsCountFlashSale, filteredProductsCountFlashSale, productsArray)
    res.status(200).json({
        success: true, 
        FlashSaleProducts,
        filteredProductsCountFlashSale,
        countProduct,
    })
})

exports.getAllProductFlashSalePcPageSecend = cashAsyncError(async(req, res , next)=>{ 

    const resultpage = 12
    const countProduct = await Product.countDocuments()

    const flashsalecount = await Product.countDocuments({spicialcategorytop : "yes"})
    let page = []
    for(let i = 1; i <= Math.ceil(flashsalecount / resultpage); i++){ 
    
      page.push(i)
    }
    page.pop()
    //console.log(page)


    const currentpage = getRandomPageflashsale(page);
    //console.log(currentpage)
    
    lastSelectedIndexflash = currentpage;
    
    //console.log(flashsalecount)

    const flashsale = {spicialcategorytop : "yes"}

    const apifeature = new ApiFeature(Product.find(flashsale), req.query).filter().search() 
    apifeature.paginationFlashSalePc(resultpage, currentpage)
    const productsArray = await apifeature.query.sort({ date: -1 }).exec();

    let filteredProductsCountFlashSale = productsArray.length;

    let pages = []

    for(let i = 1; i <= Math.ceil(flashsalecount / resultpage); i++){ 

      pages.push(i)
    }
    pages.pop()
   const pagecount = pages.length
     //
      // console.log(pagecount)
   const FlashSaleProducts = getRandomProducts(filteredProductsCountFlashSale, filteredProductsCountFlashSale, productsArray)
    res.status(200).json({
        success: true, 
        FlashSaleProducts,
        filteredProductsCountFlashSale,
        countProduct,
        pagecount,
        resultpage,
       
      
 
    })
})


exports.getNewProductRight = cashAsyncError(async(req, res , next)=>{
    const resultpage = 6
    const countProduct = await Product.countDocuments()

    let page = []
    for(let i = 1; i <= Math.floor(countProduct / resultpage); i++){ 

      page.push(i)
    }
    page.pop()
  const pagecount = page.length
  console.log(page)



    const apifeature = new ApiFeature(Product.find(), req.query).filter()
    apifeature.newproductpagination(resultpage,countProduct )

    const productsArray = await apifeature.query.sort({ date: -1 }).exec();
    let filteredProductsCountJustforYou = productsArray.length;
    
     const newproductsright  = getRandomProducts(filteredProductsCountJustforYou, filteredProductsCountJustforYou, productsArray)
    res.status(200).json({
        success: true, 
        newproductsright,
        filteredProductsCountJustforYou,
        countProduct,
        pagecount,
        resultpage
 
    })
})

exports.getAllProductLowPrice = cashAsyncError(async(req, res , next)=>{ 

  const resultpage = 30
  const countProduct = await Product.countDocuments()
  const countlowPrice = await Product.find().sort({currentprice: 1, date:-1}).exec()
  const lastresultcountlowPrice = getlast5daysproducts(countlowPrice)
  const reslutLowPriceLength = lastresultcountlowPrice.length

 

  const apifeature = new ApiFeature(Product.find(), req.query).filter().search()

    apifeature.lowpriceproductpagination(resultpage)

  const productsArray = await apifeature.query.sort({ currentprice: 1 , date:-1 }).exec();
 

  const lowpriceproductsleft = productsArray.slice(0, 10)

   let lowestproductlength = lowpriceproductsleft.length;
 

 // const lastdaylowprice  = getRandomProducts(resultpage, resultpage, lowpriceproducts)

  res.status(200).json({
      success: true, 
      lowpriceproductsleft,
      lowestproductlength,
      countProduct,
      resultpage,
      reslutLowPriceLength,
  })

})




// function to get a random page of products
function getRandomPageflashsale(page) {
    let availableIndexes = page
   // console.log(availableIndexes)
  
    //console.log(lastSelectedIndex)
    // Remove the last selected index if it exists
    if (lastSelectedIndexflash !== null) {
      availableIndexes = availableIndexes.filter(index => index !== lastSelectedIndexflash);
    }
  
    // If there are no available indexes, reset the last selected index
    if (availableIndexes.length === 0) {
        lastSelectedIndexflash = null;
      availableIndexes = page.map(( index) => index);
    }
  
    // Choose a random index from the available ones
    const randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
  //  console.log(randomIndex)
  
    // Return a page of products starting from the random index
    // const pageSize = Producta.length; // Adjust this based on the number of products you want to return per page
    // return Producta.slice(randomIndex, randomIndex + pageSize);
    return randomIndex


}

exports.getAllProductFlashSalePhone = cashAsyncError(async(req, res , next)=>{ 

    const resultpage = req.params.resultpage
    const countProduct = await Product.countDocuments()

    const flashsale = {spicialcategorytop : "yes"}

    const apifeature = new ApiFeature(Product.find(flashsale), req.query).filter().search()

    apifeature.paginationFlashSalePc(resultpage)

    const productsArray = await apifeature.query.sort({ date: -1 }).exec();
    let filteredProductsCountFlashSale = productsArray.length;

    const FlashSaleProductsphone = getRandomProducts(filteredProductsCountFlashSale, filteredProductsCountFlashSale, productsArray)
    res.status(200).json({
        success: true, 
        FlashSaleProductsphone,
        filteredProductsCountFlashSale,
        countProduct
 
    })
})




exports.getAllSubCategoryProduct = cashAsyncError(async(req, res , next)=>{

    const {name} = req.params

    const resultpageCategoryProduct = 20
    const countCategoryPageProduct = await Product.countDocuments()

    const apifeature = new ApiFeature(Product.find({subcategory : name}), req.query).filter()

    const productsArray = await apifeature.query.sort({date: -1}).exec()
    const filteredProductsCountCategoryPage = productsArray.length

    const CategoryPageProduct = getRandomProducts(filteredProductsCountCategoryPage, filteredProductsCountCategoryPage, productsArray)

    res.status(200).json({
        success :true,
        CategoryPageProduct,
        resultpageCategoryProduct,
        filteredProductsCountCategoryPage,
        countCategoryPageProduct
        
    })
})

exports.getAllSpicialCategoryTopProduct = cashAsyncError(async(req, res , next)=>{

    const {name} = req.params

    const resultpageCategoryProduct = 20
    const countCategoryPageProduct = await Product.countDocuments()

    const apifeature = new ApiFeature(Product.find({spicialcategorytop : "no"}), req.query).filter()

    const productsArray = await apifeature.query.sort({date: -1}).exec()
    const filteredProductsCountCategoryPage = productsArray.length

    const CategoryPageProduct = getRandomProducts(filteredProductsCountCategoryPage, filteredProductsCountCategoryPage, productsArray)

    res.status(200).json({
        success :true,
        CategoryPageProduct,
        resultpageCategoryProduct,
        filteredProductsCountCategoryPage,
        countCategoryPageProduct
        
    })
})

exports.getProductDitalsById = cashAsyncError(async(req, res, next) =>{

    const ProductDitals = await Product.findById(req.params.id)

    if(!ProductDitals){
        return next(new ErrorHandler("No Produict Found Please ReEnter OR Refresh Site", 404))
    }

    res.status(200).json({
        success : true,
        ProductDitals
    })
})

exports.getProductDitalsByIdName = cashAsyncError(async(req, res, next) =>{

    const ProductDitalsname = await Product.findById(req.params.id)

    if(!ProductDitalsname){
        return next(new ErrorHandler("No Produict Found Please ReEnter OR Refresh Site", 404))
    }

    res.status(200).json({
        success : true,
        ProductDitalsname
    })
})




// our All Product create -- getAllproducts--getprodcuts---adimin--everything product---end--------user

exports.getAllProductAdmin = cashAsyncError(async(req, res, next) =>{ 

 
    const countProduct = await Product.countDocuments()

    const apifeature = new ApiFeature(Product.find(), req.query).filter().search()


    const adminproducts = await apifeature.query.sort({ date: -1 }).exec();
    const filteredProductsCount = adminproducts.length;

    res.status(200).json({
        success: true, 
        adminproducts,
        filteredProductsCount,
        countProduct
 
    })
})

exports.productDeleteAdmin = cashAsyncError(async(req, res, next) =>{ 

    const product = await Product.findById(req.params.id)

    if(!product) return next(new ErrorHandler("No Product found", 404))
    

    await product.deleteOne()

    res.status(200).json({
        success: true, 
        message: "Product Delete Successfully"
     })
});

exports.uploadimage = cashAsyncError(async(req, res, next) =>{

    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
         // Upload each file to Cloudinary
         const uploadPromises = req.files.map((file) => {

            if (!allowedFileTypes.includes(file.mimetype)) {
                return res.status(400).json({ error: 'Invalid file type.' });
              }

           return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'auto',  folder :"products" }, (error, result) => {
     
                if (error) {
                  reject(error)
                  console.log(error)
                } else {
                    resolve(result)
                  console.log(result);
                }
              }).end(file.buffer);
           });


          });

        const cloudinaryResponses = await Promise.all(uploadPromises);

        const image = cloudinaryResponses.map((response) => ({
            originalname: response.original_filename,
            cloudinaryId: response.public_id,
            url: response.secure_url,
          }))

          const {name} = req.body

            const upload = await Upload.create({
                name
            })

        res.status(201).json({
            success :true,
            upload
        })

})

exports.productUpdateAdmin = cashAsyncError(async(req, res, next) =>{ 

 const product = await Product.findById(req.params.id)

 if(!product) return next(new ErrorHandler("No Product found", 404))

 const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
            //uploadprsses 

    const UploadPromises = req.files.map((file) => {

        if(!allowedFileTypes.includes(file.mimetype)){
            return res.status(400).json({error: "Invalid file type"})
        }

        return new Promise((resolve, reject) => { 
            cloudinary.uploader.upload_stream({resource_type: 'auto', folder: "products"}, (error, result) => {
                if(error){
                    reject(error)
                }else{
                    resolve(result)
                }
            }).end(file.buffer)

        })
    })

    const cloudinaryResponses = await Promise.all(UploadPromises)

    const productimage = cloudinaryResponses.map((response) => ({
        originalname: response.original_filename,
        cloudinaryId: response.public_id,
        url: response.secure_url,
      }))

    
    const {productname , regularprice , currentprice, description, category, subcategory, productStock,color,size, freedalivary,spicialcategorytop,flashsale,flashsaleprice } = req.body

    const lastupdate = Date.now()
    const productUpdate = await Product.findByIdAndUpdate(req.params.id, {
        productimage,
        productname,
        regularprice,
        currentprice,
        description,
        category,
        subcategory,
        productStock,
        color,
        size,
        freedalivary,
        spicialcategorytop,
        lastupdate,
        flashsale,
        flashsaleprice
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
           // Set the end date to 2 minutes from the current time
        //   const currentDate = new Date();
        //         let minutes = currentDate.getMinutes();
        //    const endDate = new Date(minutes);
        //    endDate.setMinutes(endDate.getMinutes() + 1);
        //    product.flashsale.endDate = endDate;
        //    console.log(endDate)
     
    
    // Function to update flashsale to 'no' for products with flashsale end date reached
async function updateFlashsaleEndDate() {
    try {
      const currentDate = new Date();
      let minutes = currentDate.getMinutes();
      console.log(minutes)
      // Find products with flashsale end date reached
 
      const productsToUpdate = await Product.find ({ 
        // flashsaleprice : 'yes', flashsaleenddate{ $lte: minutes } })
      //( {
         spicialcategoryto : 'no',
         'flashsale.endDate': { $lte: minutes },

       
      });
      console.log(productsToUpdate)
  
      // Update flashsale to 'no' for each product
      await Promise.all(productsToUpdate.map(async (product) => {
        product.spicialcategoryto = 'yes';
        await product.save();
        console.log(`Flashsale value updated to 'no' for product with ID ${product._id}.`);
      }));
    } catch (error) {
      console.error('Error updating flashsale value:', error);
    }
}
  
  // Schedule the updateFlashsaleEndDate function to run every minute (adjust as needed)
  cron.schedule('* * * * *', () => {
    updateFlashsaleEndDate();
  });
    // updateFlashsale();
    

    res.status(200).json({
        success: true, 
        productUpdate
     })
})
