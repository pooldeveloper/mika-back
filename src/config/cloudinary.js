import {v2 as cloudinary} from 'cloudinary'

cloudinary.config({
  cloud_name: 'dmtqtwa8v',
  api_key: '734577569193362',
  api_secret: 'TBt79kWrtO91BVNZnhEvBcybWAk'
});

export const uploadImage = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: 'mika'
  })
}

export const deleteImage = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId)
}