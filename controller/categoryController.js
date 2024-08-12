//external All pakage my
const express = require('express')
const cashAsyncError  = require('../middleware/cashAsyncError')
const ErrorHandler = require("../utilities/errorHandler")
const Category = require("../models/categoryModel")
const SubCategory = require("../models/subcategoryModel")
const cloudinary = require("cloudinary").v2
const multer = require("multer")


// category part Start ----here

exports.createCategory = cashAsyncError(async(req, res, next) =>{
      //upload image sestyem managemant-----------------------create---md Azharul----------
      const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];


    // upload prosses promis
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

    const cloudinaryResponses = await Promise.all(uploadPromise)

    const categoryImage = cloudinaryResponses.map((response) => ({
        originalname: response.original_filename,
        cloudinaryId: response.public_id,
        url: response.secure_url,
      }))
    const {categoryName}  = req.body


    const category = await Category.create({
        categoryImage,
        categoryName,
       
    })

    res.status(201).json({
        success : true,
        category
    })


})

exports.getAllCategory = cashAsyncError(async(req, res, next) =>{

    const category = await Category.find()
    res.status(200).json({
        success : true,
        category
    })
})

exports.getCategoryById = cashAsyncError(async(req, res, next) =>{ 

    const category = await Category.findById(req.params.id)
    if(!category){
        return next(new ErrorHandler("Category Not Found", 404))
    }
    res.status(200).json({
        success : true,
        category
    
    })
})

exports.deleteCategory = cashAsyncError(async(req, res, next) =>{ 
    const category = await Category.findById(req.params.id)
    if(!category){
        return next(new ErrorHandler("Category Not Found", 404))
    }
    await category.DeleteOne()
    res.status(200).json({
        success : true,
        message : "Category Deleted Successfully"
    
    })
})


// Sub Category Part this -- start-------
exports.createSubCategory = cashAsyncError(async(req, res, next) =>{
    // upload image before cheake iamge tyepe

    const allowImageType = ['image/jpeg', 'image/png']

    // upload image prossing
    const uploadimage  =  req.files.map((file) =>{

        // chack Validator image type
        if(!allowImageType.includes(file.mimetype)){
            return res.status(400).json({error : "Please Enter a Valid Image Like Jpg, png"})
        }

        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'auto',  folder :"SubCategories" }, (error, result) => {
       
                if (error) {
                  reject(error)
                } else {
                    resolve(result)
                }
              }).end(file.buffer);
           });

    })

    const cloudinaryResponse = await Promise.all(uploadimage)

    const subcategoryImage = cloudinaryResponse.map((file) =>({
        originalname : file.original_filename,
        cloudinaryId : file.public_id,
        url : file.secure_url
    }))
    const {subCategoryName} = req.body

    const subcategory = await SubCategory.create({
        subcategoryImage,
        subCategoryName
    })

    const category = await Category.findById(req.params.id)
    if(!category){
        return next(new ErrorHandler("Category Not Found", 404))
    }

    category.subCategory.push(subcategory._id)

    category.save({ validateBeforeSave: false })
    res.status(201).json({
        success : true,
        subcategory
    })

})

exports.getAllSubCategory = cashAsyncError(async(req, res, next) =>{

    const subcategory = await SubCategory.find()
    res.status(200).json({
        success : true,
        subcategory
    })
})

exports.getSubCategoryById = cashAsyncError(async(req, res, next) =>{ 

    const subcategory = await SubCategory.findById(req.params.id)
    if(!subcategory){
        return next(new ErrorHandler("Sub Category Not Found", 404))
    }
    res.status(200).json({
        success : true,
        subcategory
    })
})

exports.updateSubCategoryById = cashAsyncError(async(req, res, next) =>{ 

    const subcategory = await SubCategory.findById(req.params.id)
    if(!subcategory){
        return next(new ErrorHandler("Sub Category Not Found", 404))
    }
    const allowImageType = ['image/jpeg', 'image/png']

    // upload image prossing
    const uploadimage  =  req.files.map((file) =>{

        // chack Validator image type
        if(!allowImageType.includes(file.mimetype)){
            return res.status(400).json({error : "Please Enter a Valid Image Like Jpg, png"})
        }

        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'auto',  folder :"SubCategories" }, (error, result) => {
       
                if (error) {
                  reject(error)
                } else {
                    resolve(result)
                }
              }).end(file.buffer);
           });

    })

    const cloudinaryResponse = await Promise.all(uploadimage)

    const subcategoryImage = cloudinaryResponse.map((file) =>({
        originalname : file.original_filename,
        cloudinaryId : file.public_id,
        url : file.secure_url
    }))
    const {subCategoryName} = req.body

    subcategory.subcategoryImage = subcategoryImage
    subcategory.subCategoryName = subCategoryName

    await subcategory.save({ validateBeforeSave: false })
    res.status(200).json({
        success : true,
        subcategory
    })
})
exports.deletesubcategoryById = cashAsyncError(async(req, res, next) =>{ 

    const subcategory = await SubCategory.findById(req.params.id)
    if(!subcategory){
        return next(new ErrorHandler("Sub Category Not Found", 404))
    }
    await subcategory.DeleteOne()
    res.status(200).json({
        success : true,
        message : "Sub Category Deleted Successfully"
    })
})