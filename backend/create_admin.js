require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const createAdmin = async () => {
    try {
        // 1. Connect to Database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("📡 Connected to MongoDB...");

        // 2. Define Admin Details
        const adminData = {
            name: "System Admin",
            email: "admin@tassia.com",
            password: "AdminPassword123", // You can change this
            role: "admin"
        };

        // 3. Check if Admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log("⚠️ Admin already exists. Updating password...");
            const salt = await bcrypt.genSalt(10);
            existingAdmin.password = await bcrypt.hash(adminData.password, salt);
            await existingAdmin.save();
            console.log("✅ Admin password updated successfully!");
        } else {
            // 4. Hash and Save new Admin
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminData.password, salt);

            const admin = new User({
                ...adminData,
                password: hashedPassword
            });

            await admin.save();
            console.log("🚀 Admin user created successfully!");
        }

        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Error creating admin:", error);
        process.exit(1);
    }
};

createAdmin();