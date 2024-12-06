const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.Firebase_Admin_SDK);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "lemon-1ef21.appspot.com"
})


const bucket = admin.storage().bucket();


const uploadToFirebase = async (file, path) => {
    try {
        const fileName = `${path}/${Date.now()}_${file.originalname}`;
        const storageRef = bucket.file(fileName);

        const stream = storageRef.createWriteStream({
            metadata: { contentType: file.mimetype },
        });

        await new Promise((resolve, reject) => {
            stream.on('error', reject);
            stream.on('finish', resolve);
            stream.end(file.buffer);
        });

        const downloadUrl = await storageRef.getSignedUrl({
            action: 'read',
            expires: '03-01-2500'
        });

        // console.log('File uploaded:', downloadUrl);
        return downloadUrl[0];
    } catch (error) {
        console.error('Error uploading file to Firebase:', error);
        throw error;
    }
};

// function to delete media from firebase when a post is deleted 

const deleteImage = async (fileUrl) => {
    try {
        if (fileUrl) {
            const bucketName = "lemon-1ef21.appspot.com";  
            // extracting the bucketName and its length from the fileUrl;
            const startIndex = fileUrl.indexOf(`${bucketName}/`) + `${bucketName}/`.length;
            const filePathEncoded = fileUrl.slice(startIndex, fileUrl.indexOf("?"));
            const filePath = decodeURIComponent(filePathEncoded);  
         
            const storageRef = bucket.file(filePath);
            await storageRef.delete();
            
        }
    } catch (error) {
        console.error('Error deleting file from Firebase:', error);
        throw error;
    }
};




module.exports = { admin, bucket, uploadToFirebase, deleteImage };