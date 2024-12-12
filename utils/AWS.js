const AWS = require('aws-sdk');
const { errorMonitor } = require('events');
const fs = require('fs');

// console.log(process.env)
AWS.config.update({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region
});

const s3 = new AWS.S3();

exports.S3upload = async(type,key,body) =>
{
    let bucket = '';
    if(type == "mst-product"){
        bucket = 'gp-production-img/mst-product'
    }else if(type == "account"){
        bucket = 'gp-production-img/pos-account'
    }

    const params = {
      Bucket: bucket,
      Key: key,
      Body: body,
    };
    // console.log(params)

    let data = await s3.upload(params).promise();

    return data;
}

exports.S3Remove = async(type,location) => {
    try {

        let bucket;

        if(type == "mst-product"){
            bucket = 'gp-production-img/mst-product'
        }else if(type == "account"){
          bucket = 'gp-production-img/pos-account'
        }
  

        const params = {
            Bucket: bucket,
            Key: decodeURIComponent(location.split("/").pop())
        };

        return await s3.deleteObject(params).promise();
    } catch (error) {
        console.log(error)
        return false
    }
}

exports.uploadImageToS3 = async(params)=>{
    const {filename,type,originalname} = params
    try {
        let imageLoc = __dirname+"/../uploads/"+filename
          let data = await fs.promises.readFile(imageLoc);
          
          let image = await this.S3upload(type,originalname,data) 
          if(image){
             console.log(image.Location)
             fs.unlink(imageLoc, function (err) {
                 if (err) console.error(err);
             });
    
             return {error:false,result: image.Location}
          }        
        
      } catch (error) {
        console.log(error.message)
        return {error:"Maaf proses upload gagal",result: false}
      }
}

exports.removeImageFromS3 = async(params)=>{
    const {location,type} = params
    try {
          let image = await this.S3Remove(type,location) 
          return {error:false,result: {
            status:'success'
          }}  
        
      } catch (error) {
        console.log(error.message)
        return {error:"Maaf proses upload gagal",result: false}
      }
}


