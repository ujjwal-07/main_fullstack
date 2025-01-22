const cloudinary = require("cloudinary").v2;
const multer = require("multer")
const express = require("express")
const streamifier = require("streamifier")
require("dotenv").config();


// Configuration for cloudinary
cloudinary.config({ 
    cloud_name: process.env.cloudinary_NAME, 
    api_key: process.env.cloudinary_KEY, 
    api_secret: process.env.cloudinary_SECRET 
});

const app = express();
const port = process.env.PORT || 5000

app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage});


app.post("/upload", upload.single('file'), (req,res)=>{
    if(!req.file){
        return res.status(400).json({ message : "No File Uploaded"});
    }

    const stream = cloudinary.uploader.upload_stream(
        {resource_type: 'auto',
            public_id:"newfile"
        }, // Auto detects the file type
        (error, result) =>{
            if(error){
                return res.status(500).json({ message: 'Error uploading file', error });
            }
            res.json(result);
        }
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);
})


app.post("/delete", async (req,res)=>{
    try{
        const delete_file_name = req.body.file_name;
        const result = await cloudinary.uploader.destroy(delete_file_name);
        console.log(`Image delete : ${delete_file_name}`);
        res.status(200).send(`Image delete : ${delete_file_name}`)
    }catch(err){
        res.status(500).send(`Error while deleting image ${err}`)
    }
})


app.post("/update",(req,res)=>{
    
})

app.listen(port,()=>{
    console.log(`Server is running inside port ${port}`)
})
// // Upload an image
//     const uploadResult = await cloudinary.uploader
//     .upload(
//         './download.png', {
//             public_id: 'animal',
//         }
//     )
//     .catch((error) => {
//         console.log(error);
//     });

// console.log(uploadResult);

// // Optimize delivery by resizing and applying auto-format and auto-quality
// const optimizeUrl = cloudinary.url('shoes', {
//     fetch_format: 'auto',
//     quality: 'auto'
// });

// console.log(optimizeUrl);

// // Transform the image: auto-crop to square aspect_ratio
// const autoCropUrl = cloudinary.url('shoes', {
//     crop: 'auto',
//     gravity: 'auto',
//     width: 500,
//     height: 500,
// });

// console.log(autoCropUrl);    
