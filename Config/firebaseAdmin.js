const admin = require('firebase-admin');
 require("dotenv").config();
 
const serviceAccount = {
    "type": "service_account",
    "project_id": "lemon-1ef21",
    "private_key_id": "0dac1590a49ca67e5927d988bd4e5d2f00cf392c",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCzFPjQ6tACOQk6\nNoChBa/KnBmQxwYj4mfCwbIc0+zkh2FOd8e6F60ht+YD+4uoHcM2MiPQVW0X3gc6\nAjZVa8ETyBv3vBW/sMgNljEBIVZIDWBbfZQyasz1AP2By0iVAUKHbE/LmWasDgGq\ndYl9Ek6mxBlQWFgC9vd2GrOe+PrXDgcdOXGtEPNEUpUPk62oItnB8c4NqznMyPmQ\n69ze41bdctfyJViqxChRP8o2k2DCIy/kzvEO9ZIe+xShwxCC9pN/X+Qnauw50cBq\nthl9WbNKVM1jcJ+cRIHR/l7f/Ib8nw2+BCkLwGg7mskiyksRX/xDyKoonfG53EJw\nI0MVmiWZAgMBAAECggEAJm3QLQjOhUOXCtJqTOOLAyf3Rn2nAClUCdOF9LC3i5zP\nkUab6f+tq+gqKF2g7P0iCG2/CLRkOjRviY+y+Cas4qFU+xb19dIqQ9wgfPUZ7lFM\nhaWPmTgY7lR9kg4875i7HZNtFiw/f5lr2xfo3pmAnkHDit3CWTSFCueU9v7H2UDx\n9lZi32czMA3SqoyZQLXB7hC/4ftaxNPrnqUEURnyrOf50Vd+7qD9mzYLODQNMddL\nbXS6jgKUrPrBF7FoEkYDYnqoB+NqEjwloYOt/9yKj5hBDw+ypDnhtjfCAYprpKOk\nf2VPowREu4oBY52cnOLsBjiK/x86joaNnroNb8E4jwKBgQDZ3pFhldbq42HC7Ev8\nxDG0JblfSxwn7gUvpkd6oroGIP1s5aSxhAU+LrwVt3JuRg/g0K1x07Rwc+SLYiZV\nQ8NnKwqpZKOwaOiMGwTZYGkKhiqPf0VbMKB+9ZlCM6NAvwLlbZgVb/1pp95NoK+G\nPArOx7L6OMetcmDwPXNFngqLwwKBgQDSbJFOGoUnzUIjsLRgYaAc8I1n6VFylIdm\nlwOtjGMPURNV5BhOt9qD8ExguvUf/peawPCKGCpWeXxYVBc+MB32r1RpA6VsCub3\nwW3aX/jxbkbdCSKLVQzVzBXjSEmPzGroB25XoK2jOmQP3JeoEof0/RbW1YCEfHgW\nXkWSTwBfcwKBgHwUMZ/uAjRLw0WL5crSwavjQCtxT1u+Rt3YSSUiv+b1qt71+lHO\n6l17qEqF63m6FRjoP59v/nd8yVBIWaR9ry92Z+AJHOA/HxGL4bsbGTeRKXQH+6vv\nibhEj0AQwI0DO9cGD3NGEIC3xfdX6B7+2vjg6qFu7OlvFp47oQao90CZAoGARg/q\nDaRc45S/SdzjIhg/VINvwcJ44Pq9XpY3nkhZD1eCZZ3Nzh//POD8vVRim6WMWvWU\n4ZYMOsC2ez58grNItsNICrMxGBlFMAcSiZxc6h46sAwDmXrXDDSosQV3oM6CZgFb\nZwfT6L5fZLyhLlAFPrgqK5vo77P11BTNe1qcmCsCgYEAphiozc3ADqVuo0vBlV7k\nP2pwFDjC/wQ3rvIuop1r5vHDgso3jjxzGlRRqepucAcSO92ovxwOO90YKXMmNYCz\nPRSelL1uZ5TlOAOoy4VKF8Y2SZ39bhRQ4amD61H9LLbVlprrMKx7HIaGsp4lPNJg\ni48ZjASEQFh+rWopTBDtxGE=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-6p3dl@lemon-1ef21.iam.gserviceaccount.com",
    "client_id": "105460481585581320349",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-6p3dl%40lemon-1ef21.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }
  

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