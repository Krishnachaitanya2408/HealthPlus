const upload_preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
const cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

const uploadImageToCloudinary = async file => {
    try {
        const uploadData = new FormData()
        uploadData.append('file', file)
        uploadData.append('upload_preset', upload_preset)

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
            method: 'post',
            body: uploadData
        })

        const data = await res.json()
        
        if (!res.ok) {
            throw new Error(data.error?.message || 'Failed to upload image');
        }

        return data;
    } catch (error) {
        console.error('Error in uploadImageToCloudinary:', error);
        throw new Error('Failed to upload image: ' + error.message);
    }
}

export default uploadImageToCloudinary