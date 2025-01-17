const { uploadImageToS3, removeImageFromS3 } = require("../../../utils/AWS");
const { response } = require("../../../utils/response");
const { s_updatePhotoProfile } = require("../services/AccountService");

const c_uploadPhotoProfile = async(req,res) => {

    try {
      req.file.type = 'account'
      const {error,result} = await uploadImageToS3(req.file);
     
      if (error) {
        return response.error(res, error);
      }
  
      response.success(res, result);
    } catch (error) {
      console.log(error.message)
      return response.errorSystem(res, error);
    }
}

const c_updatePhotoProfile = async(req,res) => {

    try {
      
      const {error,result} = await s_updatePhotoProfile(req.body);
   
      if (error) {
        console.log("error")
        return response.error(res, error);
      }
  
      response.success(res, result);
    } catch (error) {
  
      return response.errorSystem(res, error);
    }
}

const c_removePhotoProfileImage = async(req,res) =>{
  try {

    const {error,result} = await removeImageFromS3(req.body);

    if (error) {
      return response.error(res, error);
    }

    response.success(res, result);
  } catch (error) {
    console.log(error.message)
    return response.errorSystem(res, error);
  }
}

module.exports = {
    c_uploadPhotoProfile,
    c_updatePhotoProfile,
    c_removePhotoProfileImage
}