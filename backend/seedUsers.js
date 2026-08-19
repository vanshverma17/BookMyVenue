const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const seedUsers = async () => {
  try {
    // Clear existing users (optional - comment out if you want to keep existing users)
    // await User.deleteMany({});

    const users = [
      {
        name: 'Admin User',
        email: 'admin@bookmyvenue.com',
        password: 'admin12345678',
        role: 'admin',
        department: 'Administration',
        phoneNumber: '1234567890'
      },
      {
        name: 'Staff Member',
        email: 'staff@bookmyvenue.com',
        password: 'staff123',
        role: 'staff',
        department: 'Computer Science',
        phoneNumber: '9876543210'
      },
      {
        name: 'John Doe',
        email: 'staff.john@bookmyvenue.com',
        password: 'john123',
        role: 'staff',
        department: 'Mathematics',
        phoneNumber: '5551234567'
      },
      {
        name: 'Student User',
        email: 'student@bookmyvenue.com',
        password: 'student123',
        role: 'student',
        department: 'Engineering',
        phoneNumber: '1112223333'
      }
    ];

    // Create or update users one by one
    for (const userData of users) {
      try {
        const existingUser = await User.findOne({ email: userData.email.toLowerCase().trim() });
        if (existingUser) {
          existingUser.name = userData.name;
          existingUser.role = userData.role;
          existingUser.department = userData.department;
          existingUser.phoneNumber = userData.phoneNumber;
          existingUser.isActive = true;
          existingUser.password = userData.password; // will be hashed by pre('save') hook
          await existingUser.save();
          console.log(`✓ Updated user: ${userData.name} (${userData.role}) - ${userData.email}`);
        } else {
          await User.create(userData);
          console.log(`✓ Created user: ${userData.name} (${userData.role}) - ${userData.email}`);
        }
      } catch (err) {
        console.log(`✗ Error with user ${userData.email}:`, err.message);
      }
    }

    console.log('\n✅ Seed completed!');
    console.log('\n📝 Login Credentials:');
    console.log('─────────────────────────────────────────');
    console.log('Admin:');
    console.log('  Email: admin@bookmyvenue.com');
    console.log('  Password: admin123');
    console.log('\nStaff:');
    console.log('  Email: staff@bookmyvenue.com');
    console.log('  Password: staff123');
    console.log('\nStaff (Alternative):');
    console.log('  Email: staff.john@bookmyvenue.com');
    console.log('  Password: john123');
    console.log('\nStudent:');
    console.log('  Email: student@bookmyvenue.com');
    console.log('  Password: student123');
    console.log('─────────────────────────────────────────\n');

    process.exit();
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
