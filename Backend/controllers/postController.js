// /controllers/postController.js
const Post = require('../models/userPostModel');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const streamifier = require("streamifier")

require('dotenv').config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.cloudinary_NAME,
  api_key: process.env.cloudinary_KEY,
  api_secret: process.env.cloudinary_SECRET,
});

// Multer storage configuration for Cloudinary
const storage = multer.memoryStorage();

const upload = multer({ storage });


const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            reject({ message: 'Error uploading file', error });
          } else {
            resolve(result);
          }
        }
      );
  
      // Pipe the file stream to Cloudinary
      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  };


// Controller to add a new post
const addPost = async (req, res) => {
  try {
    const { title, description,email } = req.body;
    console.log(req.file)
    if(!req.file){
        return res.status(400).json({ message : "No File Uploaded"});
    }
    const result = await uploadToCloudinary(req.file); // Assuming file is passed in req.file
    console.log("thiss isbds ",result)
    const imgUrl = result.secure_url;
    const imgPublicId = result.public_id;

    const newPost = new Post({
        title,
        description,
        imageName: imgPublicId,
        imageUrl: imgUrl,
        email: email
      });
      await newPost.save();
      res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Internal Server Error', error });
      }

};

// Controller to get all posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

const getYourPost = async (req, res) => {
  const email = req.body.email
  try {
    const posts = await Post.find({email:email});
    console.log(posts, "this are the posts")
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};






const deletePost = async (req,res)=>{
    try{
        const delete_file_name = req.body.public_id;
        console.log(delete_file_name);
        const result = await cloudinary.uploader.destroy(delete_file_name);
        console.log(`Image delete : ${delete_file_name}`);

        const deletedPost = await Post.findOneAndDelete(delete_file_name);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
          }
        res.status(200).send(`Post deleted successfully: ${delete_file_name}`)
    }catch(err){
        console.error('Error deleting post:', err);
        res.status(500).json({ message: 'Internal Server Error', err });
    }
}

const updatePost = async (req, res) => {
  const { postId, title, description } = req.body;
 
  console.log(postId.imageName, "This is postid")

  if (!title || !description || !postId) {
    return res.status(400).json({ message: 'Title, Description, and Post ID are required' });
  }

  try {
    // Find the post by imageName (assumed postId is imageName in this case)
    const post = await Post.findOne({ imageName: postId.imageName });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Update the title and description
    post.title = title;
    post.description = description;

    // Save the updated post
    await post.save();

    // Send success response
    res.status(200).json({ message: 'Post updated successfully', post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later' });
  }
};






// Export the controller methods
module.exports = { addPost, getPosts, upload, deletePost, updatePost,getYourPost };
