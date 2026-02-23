import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/db';
import { env } from './config/env';
import { User, UserRole, UserStatus } from './models/User';
import { Category } from './models/Category';

const categories = [
    { name: 'വാർത്ത (News)', slug: 'news', order: 1 },
    { name: 'ആത്മീയം (Spiritual)', slug: 'spiritual', order: 2 },
    { name: 'സാക്ഷ്യം (Testimony)', slug: 'testimony', order: 3 },
    { name: 'യുവജനം (Youth)', slug: 'youth', order: 4 },
    { name: 'കുടുംബം (Family)', slug: 'family', order: 5 },
    { name: 'ലേഖനം (Article)', slug: 'article', order: 6 },
    { name: 'മുഖപ്രസംഗം (Editorial)', slug: 'editorial', order: 7 },
    { name: 'അഭിമുഖം (Interview)', slug: 'interview', order: 8 },
];

const seed = async (): Promise<void> => {
    try {
        await connectDB();

        // Create Super Admin
        const existingAdmin = await User.findOne({ email: env.SUPER_ADMIN_EMAIL });
        if (!existingAdmin) {
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(env.SUPER_ADMIN_PASSWORD, salt);

            await User.create({
                email: env.SUPER_ADMIN_EMAIL,
                passwordHash,
                name: 'Super Admin',
                role: UserRole.SUPER_ADMIN,
                status: UserStatus.ACTIVE,
            });
            console.log(`✅ Super Admin created: ${env.SUPER_ADMIN_EMAIL}`);
        } else {
            console.log('ℹ️ Super Admin already exists');
        }

        // Create Categories
        for (const cat of categories) {
            const exists = await Category.findOne({ slug: cat.slug });
            if (!exists) {
                await Category.create(cat);
                console.log(`✅ Category created: ${cat.name}`);
            } else {
                console.log(`ℹ️ Category already exists: ${cat.name}`);
            }
        }

        console.log('\n🎉 Seed completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
};

seed();
