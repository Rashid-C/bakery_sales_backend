import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../src/modules/users/user.model.js";
import { hashPassword } from "../src/utils/password.js";

dotenv.config();

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({ role: "ADMIN" });
    if (existingAdmin) {
        console.log("Admin already exists");
        process.exit(0);
    }

    const passwordHash = await hashPassword("Kerala123@");

    await User.create({
        name: "Owner",
        username: "jsoanu@gmail.com",
        passwordHash,
        role: "ADMIN",
        isActive: true,
    });

    console.log("Admin created successfully");
    process.exit(0);
};

run();
