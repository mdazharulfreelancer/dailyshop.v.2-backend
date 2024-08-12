class ApiFeature {
    constructor(query, value) {
        this.query = query;
        this.value = value;
      }
      search() {
        const keyword = this.value.keyword
          ? {
              productname: {
                $regex: this.value.keyword,
                $options: "i",
              }
            }
          : {};
    
        this.query = this.query.find({ ...keyword });
        return this;
      }

      filter(){
          const paramsvalue ={...this.value}    
        // if any params key and valu fast its removing and filter all product
          const removeFileds = ["keyword", "limit", "page"]
          removeFileds.forEach((key)=> delete paramsvalue[key])
  
  
      let paramsvalues = JSON.stringify(paramsvalue);
      paramsvalues = paramsvalues.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
      this.query = this.query.find(JSON.parse(paramsvalues));

      return this;
      }

     paginationHomeJustForYou (resultpage){      
        const currentpage = Number(this.value.page) || 1

       // console.log(currentpage)
        const skip =  resultpage * (currentpage -1)

        this.query = this.query.limit(resultpage).skip(skip)

        return this
      }

      
      paginationHomeJustForYouPhoneLeft (resultpage ){
        const currentpage = Number(this.value.page) || 1
    //     console.log(currentpage)
        const skip =  resultpage * (currentpage -1)
        this.query = this.query.limit(resultpage).skip(skip)
        return this
      }

      //THis is correct useing all so this is clean code
      paginationProduct (resultpage ){
        const currentpage = Number(this.value.page) || 1
   // console.log(currentpage)
        const skip =  resultpage * (currentpage -1)
        this.query = this.query.limit(resultpage).skip(skip)
        return this
      }


      //THis is correct useing all so this is clean code

      paginationHomeJustForYouPhoneRight (resultpage){
        const currentpage = Number(this.value.page) || 1
        const skip =  resultpage * (currentpage -1) 
        this.query = this.query.limit(resultpage).skip(skip)

        return this
      }

  
      paginationFlashSalePc (resultpage, pageNumber){ 


        //  console.log(pageNumber)
        const currentpage = Number(this.value.page) || pageNumber

        const skip =  resultpage * (currentpage -1)

        this.query = this.query.limit(resultpage).skip(skip)

        return this
      }
      newproductpagination (resultpage ){
        const currentpage = Number(this.value.page) || 1
        const skip =  resultpage * (currentpage -1)
        this.query = this.query.limit(resultpage).skip(skip)

        return this
      

    
     } 

     lowpriceproductpagination (resultpage ){

        const currentpage = Number(this.value.page) || 1
      //  console.log(currentpage)
  
        const skip =  resultpage * (currentpage -1)
  
        this.query = this.query.limit(resultpage).skip(skip)
  
        return this

     }
     paginationLowPriceRight (resultpage ){ 

     const currentpage = Number(this.value.page) || 1
    //  console.log(currentpage)

      const skip = resultpage * (currentpage -1)

      this.query = this.query.limit(resultpage).skip(skip)
     }
}


module.exports = ApiFeature 
