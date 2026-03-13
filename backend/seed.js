const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Define a basic User Schema (Adjust this if your model is in a separate file)
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'instructor', 'student'], default: 'student' },
  isVerified: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

const seedData = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tassia_school');
    console.log("Connected to MongoDB for seeding...");

    // 2. Clear existing users (Careful: This deletes all users!)
    await User.deleteMany({});

    // 3. Hash a default password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 4. Sample Data
    const users = [
      { name: "Tassia Admin", email: "admin@tassia.com", password: hashedPassword, role: "admin", isVerified: true },
      { name: "Jane Doe", email: "jane@tassia.com", password: hashedPassword, role: "instructor", isVerified: true },
      { name: "John Smith", email: "john@tassia.com", password: hashedPassword, role: "student", isVerified: true }
    ];

    // 5. Insert into DB
    await User.insertMany(users);
    console.log("✅ Database seeded successfully with Admin, Instructor, and Student!");
    
    process.exit();
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedData();