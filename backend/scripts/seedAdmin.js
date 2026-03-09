const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../models/User');

dotenv.config();

const run = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bookmyvenue';
  const dbName = process.env.MONGODB_DBNAME || 'bookmyvenue';

  const email = process.env.ADMIN_EMAIL || 'admin@bookmyvenue.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@12345678';
  const name = process.env.ADMIN_NAME || 'Admin';
  const reset = process.argv.includes('--reset');

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000, dbName });

    const existing = await User.findOne({ email }).select('+password');

    if (!existing) {
      const created = await User.create({
        name,
        email,
        password,
        role: 'admin',
      });

      console.log('✅ Admin user created');
      console.log(`   Email: ${email}`);
      console.log(`   Password: ${password}`);
      console.log(`   UserId: ${created._id}`);
      return;
    }

    if (reset) {
      existing.name = name;
      existing.role = 'admin';
      existing.password = password; // will be hashed by pre-save hook
      await existing.save();

      console.log('✅ Admin user reset');
      console.log(`   Email: ${email}`);
      console.log(`   Password: ${password}`);
      console.log(`   UserId: ${existing._id}`);
      return;
    }

    // Ensure role is admin (without changing password)
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
    }

    console.log('ℹ️ Admin user already exists');
    console.log(`   Email: ${email}`);
    console.log('   Password: (unchanged)');
    console.log('   Tip: run `npm run seed:admin:reset` to reset password');
  } catch (err) {
    console.error('❌ Failed to seed admin:', err?.message || err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
};

run();
