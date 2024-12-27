import express from "express";
import { connect, model, Schema } from 'mongoose';
import cors from 'cors';
import multer, { diskStorage } from 'multer';
import { resolve, join, basename } from 'path';
import { existsSync, unlinkSync } from 'fs';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));


const brandname = 'bao-bao';

// MongoDB connection
connect('mongodb+srv://salwin:salwin123@cluster0.j422l.mongodb.net/app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define a User model
const User = model('User', new Schema({
  BrandName: String,
  FullName: String,
  Whatsapp: String,
  Email: String,
  brandLogo: String,
  shopImages: [String],
  BrandWhatsapp: String,
  BrandEmail: String,
  Website: String,
  YearOfEstablishment: String,
  AboutCompany: String,
  OfficialAddress: String,
  State: String,
  City: String,
  FacebookLink: String,
  InstaLink: String,
  YoutubeLink: String,
    ContactPerson1Name: String,
    ContactPerson1Phone: String,
    ContactPerson1Designation: String,
    ContactPerson2Name: String,
    ContactPerson2Phone: String,
    ContactPerson2Designation: String,
}), 'Users');



// Multer configuration for file uploads
const storage = diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Get user data
app.get('/api/user', async (req, res) => {
  try {
    const contact = await User.findOne({ BrandName: brandname });
    res.json(contact);
  } catch (error) {
    res.status(500).send('Error fetching contact data');
  }
});

// Upload brand logo
app.post('/api/upload/logo', upload.single('brandLogo'), (req, res) => {
  try {
    const filePath = `http://localhost:5000/${req.file.filename}`;
    res.json({ brandLogo: filePath });
  } catch (error) {
    console.error('Error uploading logo:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Upload shop images
app.post('/api/upload/shop-image', upload.single('shopImage'), (req, res) => {
  try {
    const filePath = `http://localhost:5000/${req.file.filename}`;
    res.json({ shopImage: filePath });
  } catch (error) {
    console.error('Error uploading shop image:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Function to delete a file
const deleteFile = (filePath) => {
  const absolutePath = resolve(filePath);
  if (existsSync(absolutePath)) {
    unlinkSync(absolutePath);
    console.log(`Deleted file: ${absolutePath}`);
  }
};

app.post('/api/update', async (req, res) => {
    try {
      const {
        BrandName,
        BrandWhatsapp,
        BrandEmail,
        Website,
        YearOfEstablishment,
        AboutCompany,
        OfficialAddress,
        State,
        City,
        FacebookLink,
        InstaLink,
        YoutubeLink,
        ContactPerson1Name,
        ContactPerson1Phone,
        ContactPerson1Designation,
        ContactPerson2Name,
        ContactPerson2Phone,
        ContactPerson2Designation,
        brandLogo,
        shopImages,
      } = req.body;
  
      // Find the user by BrandName
      const user = await User.findOne({ BrandName: BrandName });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update the general details (fields in the request body)
      user.BrandWhatsapp = BrandWhatsapp || user.BrandWhatsapp;
      user.BrandEmail = BrandEmail || user.BrandEmail;
      user.Website = Website || user.Website;
      user.YearOfEstablishment = YearOfEstablishment || user.YearOfEstablishment;
      user.AboutCompany = AboutCompany || user.AboutCompany;
      user.OfficialAddress = OfficialAddress || user.OfficialAddress;
      user.State = State || user.State;
      user.City = City || user.City;
      user.FacebookLink = FacebookLink || user.FacebookLink;
      user.InstaLink = InstaLink || user.InstaLink;
      user.YoutubeLink = YoutubeLink || user.YoutubeLink;
      user.ContactPerson1Name = ContactPerson1Name || user.ContactPerson1Name;
      user.ContactPerson1Phone = ContactPerson1Phone || user.ContactPerson1Phone;
      user.ContactPerson1Designation = ContactPerson1Designation || user.ContactPerson1Designation;
      user.ContactPerson2Name = ContactPerson2Name || user.ContactPerson2Name;
      user.ContactPerson2Phone = ContactPerson2Phone || user.ContactPerson2Phone;
      user.ContactPerson2Designation = ContactPerson2Designation || user.ContactPerson2Designation;
  
      // Handle brandLogo update and delete the previous logo if necessary
      if (user.brandLogo && brandLogo && user.brandLogo !== brandLogo) {
        const previousLogoPath = join('uploads', basename(user.brandLogo));
        deleteFile(previousLogoPath); // Delete the old logo
      }
      user.brandLogo = brandLogo || user.brandLogo;
  
      // Handle shopImages update and delete the previous images if necessary
      if (user.shopImages && shopImages) {
        const updatedShopImages = [...user.shopImages];
  
        shopImages.forEach((newImage, index) => {
          if (updatedShopImages[index] && updatedShopImages[index] !== newImage) {
            const previousImagePath = join('uploads', basename(updatedShopImages[index]));
            deleteFile(previousImagePath); // Delete the old image
          }
          updatedShopImages[index] = newImage;
        });
  
        user.shopImages = updatedShopImages;
      }
  
      // Save the updated user data
      await user.save();
  
      res.json({ message: 'Update successful', user });
    } catch (error) {
      console.error('Error updating brand details:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

// Start server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
