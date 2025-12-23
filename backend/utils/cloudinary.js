import {v2 as cloudinary} from cloudinary;
import fs from 'fs';

const uploadToCloudinary = async (filePath) => {

     cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY, 
        api_secret: process.env.CLOUDINARY_SECRET
    });

    try {
        if(!filePath) return null;

        const uploadResult = await cloudinary.uploader.upload(filePath);
        fs.unlinkSync(filePath); // Delete the local file after upload
        return uploadResult.secure_url;

    } catch(err) {
        fs.unlinkSync(filePath);
        console.error('Error uploading to Cloudinary:', err);

    }
}

export default uploadToCloudinary;