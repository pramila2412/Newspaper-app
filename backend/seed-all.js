/**
 * Comprehensive seed script — Populates ALL sections with sample data
 * Run: node seed-all.js
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = 'mongodb://localhost:27017/goodnews';

// ─── Schemas (inline for standalone script) ───
const UserSchema = new mongoose.Schema({ name: String, email: { type: String, unique: true }, password: String, role: { type: String, default: 'EDITOR' }, isActive: { type: Boolean, default: true } }, { timestamps: true });
const CategorySchema = new mongoose.Schema({ name: String, slug: { type: String, unique: true }, description: String, order: { type: Number, default: 0 } }, { timestamps: true });
const ContentBlockSchema = new mongoose.Schema({ id: String, type: String, data: mongoose.Schema.Types.Mixed }, { _id: false });
const NewsSchema = new mongoose.Schema({ title: String, slug: { type: String, unique: true }, subtitle: String, categoryId: mongoose.Schema.Types.ObjectId, authorId: mongoose.Schema.Types.ObjectId, heroImage: String, contentBlocks: [ContentBlockSchema], status: { type: String, default: 'PUBLISHED' }, publishedAt: Date, scheduledAt: Date, viewCount: { type: Number, default: 0 }, isFeatured: { type: Boolean, default: false }, isSponsored: { type: Boolean, default: false }, isBreaking: { type: Boolean, default: false }, tags: [String], subCategory: String, seoTitle: String, seoDescription: String, seoKeywords: [String], ogImage: String }, { timestamps: true });
const ObituarySchema = new mongoose.Schema({ name: String, age: Number, district: String, deathDate: Date, photo: String, contentBlocks: [ContentBlockSchema], status: { type: String, default: 'ACTIVE' }, createdBy: mongoose.Schema.Types.ObjectId }, { timestamps: true });
const MatrimonySchema = new mongoose.Schema({ name: String, age: Number, gender: String, education: String, denomination: String, district: String, description: String, contactNumber: String, photos: [String], planDuration: Number, startDate: Date, expiryDate: Date, status: { type: String, default: 'ACTIVE' }, createdBy: mongoose.Schema.Types.ObjectId }, { timestamps: true });
const ClassifiedSchema = new mongoose.Schema({ title: String, slug: { type: String, unique: true }, description: String, category: String, contactPhone: String, contactName: String, images: [String], location: String, price: String, status: { type: String, default: 'ACTIVE' }, viewCount: { type: Number, default: 0 } }, { timestamps: true });
const VideoSchema = new mongoose.Schema({ title: String, slug: { type: String, unique: true }, youtubeUrl: String, thumbnail: String, description: String, categoryId: mongoose.Schema.Types.ObjectId, status: { type: String, default: 'PUBLISHED' }, viewCount: { type: Number, default: 0 }, publishedAt: Date }, { timestamps: true });
const PrayerRequestSchema = new mongoose.Schema({ title: String, content: String, submittedBy: String, type: { type: String, default: 'prayer' }, isApproved: { type: Boolean, default: true } }, { timestamps: true });
const SubscriberSchema = new mongoose.Schema({ email: { type: String, unique: true }, isActive: { type: Boolean, default: true }, subscribedAt: { type: Date, default: Date.now } }, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Category = mongoose.model('Category', CategorySchema);
const News = mongoose.model('News', NewsSchema);
const Obituary = mongoose.model('Obituary', ObituarySchema);
const Matrimony = mongoose.model('Matrimony', MatrimonySchema);
const Classified = mongoose.model('Classified', ClassifiedSchema);
const Video = mongoose.model('Video', VideoSchema);
const PrayerRequest = mongoose.model('PrayerRequest', PrayerRequestSchema);
const Subscriber = mongoose.model('Subscriber', SubscriberSchema);

const img = (id) => `https://picsum.photos/seed/${id}/800/500`;

async function main() {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // ─── 1. Admin User ───
    const passHash = await bcrypt.hash('Admin@123456', 10);
    const admin = await User.findOneAndUpdate(
        { email: 'admin@goodnews.in' },
        { name: 'Super Admin', email: 'admin@goodnews.in', password: passHash, role: 'SUPER_ADMIN', isActive: true },
        { upsert: true, new: true }
    );
    console.log('✅ Admin user ready');

    // ─── 2. Categories ───
    const catDefs = [
        { name: 'News', slug: 'news', order: 1 },
        { name: 'Spiritual', slug: 'spiritual', order: 2 },
        { name: 'Testimony', slug: 'testimony', order: 3 },
        { name: 'Youth', slug: 'youth', order: 4 },
        { name: 'Family', slug: 'family', order: 5 },
        { name: 'Article', slug: 'article', order: 6 },
        { name: 'Motto (Editorial)', slug: 'editorial', order: 7 },
        { name: 'Interview', slug: 'interview', order: 8 },
    ];
    const cats = {};
    for (const c of catDefs) {
        const doc = await Category.findOneAndUpdate({ slug: c.slug }, c, { upsert: true, new: true });
        cats[c.slug] = doc._id;
    }
    console.log('✅ 8 categories seeded');

    // ─── 3. News Articles ───
    await News.deleteMany({});
    const newsData = [
        { title: 'Kerala Christian Convention 2026 Draws Record Attendance', subtitle: 'Over 50,000 believers gathered at Maramon for the annual convention', catSlug: 'news', subCat: 'india', isBreaking: true, isFeatured: true, tags: ['convention', 'maramon', 'kerala'] },
        { title: 'New Church Building Inaugurated in Kottayam', subtitle: 'Bishop Thomas leads the inauguration ceremony', catSlug: 'news', subCat: 'india', tags: ['kottayam', 'church', 'inauguration'] },
        { title: 'US Malayalam Christian Fellowship Annual Meet', subtitle: 'Dallas convention brings together 3,000 families', catSlug: 'news', subCat: 'us-canada', isFeatured: true, tags: ['dallas', 'fellowship', 'us'] },
        { title: 'Canadian Churches Unite for Prayer Week', subtitle: 'Toronto-based churches organize a week-long prayer session', catSlug: 'news', subCat: 'us-canada', tags: ['toronto', 'prayer', 'canada'] },
        { title: 'Global Mission Conference Held in London', subtitle: 'Christian leaders from 40 countries discuss mission strategies', catSlug: 'news', subCat: 'world', tags: ['london', 'mission', 'global'] },
        { title: 'Business Leaders Donate ₹5 Crore for Church School', subtitle: 'Christian entrepreneurs fund new school in Idukki', catSlug: 'news', subCat: 'business', tags: ['business', 'school', 'idukki'] },
        { title: 'Youth Revival in Thrissur Attracts 10,000 Youngsters', subtitle: 'Three-day event features worship, sermons, and fellowship', catSlug: 'youth', subCat: 'india', tags: ['youth', 'thrissur', 'revival'] },
        { title: 'Walking by Faith: A Testimony of Healing', subtitle: 'Sarah shares her miraculous recovery story', catSlug: 'testimony', tags: ['healing', 'faith', 'miracle'] },
        { title: 'The Power of Daily Devotion', subtitle: 'How 15 minutes of Bible reading changed my life', catSlug: 'spiritual', isFeatured: true, tags: ['devotion', 'bible', 'spiritual'] },
        { title: 'Family Retreat at Munnar: Building Stronger Bonds', subtitle: 'Churches organize family camps in the Western Ghats', catSlug: 'family', tags: ['munnar', 'family', 'retreat'] },
        { title: 'Editorial: The Role of Church in Modern Society', subtitle: 'Why the church must adapt while staying true to its mission', catSlug: 'editorial', isSponsored: true, tags: ['editorial', 'church', 'society'] },
        { title: 'Interview with Pastor John: 30 Years of Ministry', subtitle: 'A candid conversation about faith, challenges, and hope', catSlug: 'interview', tags: ['interview', 'pastor', 'ministry'] },
        { title: 'Christmas Celebrations Across Kerala 2025', subtitle: 'Photo story of the festive spirit in God\'s Own Country', catSlug: 'news', subCat: 'india', isBreaking: true, tags: ['christmas', 'kerala', 'celebration'] },
        { title: 'Bible Study Group Movement Growing in Canada', subtitle: 'Small groups multiply across Ontario and British Columbia', catSlug: 'spiritual', subCat: 'us-canada', tags: ['bible-study', 'canada', 'small-groups'] },
        { title: 'New Malayalam Worship Album Tops Charts', subtitle: 'Album "Krupayude Daham" receives 10 million streams', catSlug: 'article', tags: ['worship', 'music', 'malayalam'] },
        { title: 'World Evangelical Alliance Meets in Seoul', subtitle: 'Key decisions on climate action and interfaith dialogue', catSlug: 'news', subCat: 'world', tags: ['seoul', 'evangelical', 'world'] },
    ];
    for (let i = 0; i < newsData.length; i++) {
        const n = newsData[i];
        await News.create({
            title: n.title,
            slug: n.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-') + '-' + (i + 1),
            subtitle: n.subtitle,
            categoryId: cats[n.catSlug] || cats['news'],
            authorId: admin._id,
            heroImage: img('news-' + (i + 1)),
            contentBlocks: [
                { id: 'p1', type: 'paragraph', data: { text: n.subtitle + '. This is a detailed news article covering the latest developments in the Malayalam Christian community. Read on for more information about this important event.' } },
                { id: 'p2', type: 'paragraph', data: { text: 'The community response has been overwhelmingly positive, with church leaders and members expressing their gratitude and joy. More updates will follow as the story develops.' } },
            ],
            status: 'PUBLISHED',
            publishedAt: new Date(Date.now() - i * 3600000 * 8),
            viewCount: Math.floor(Math.random() * 2000) + 100,
            isFeatured: n.isFeatured || false,
            isSponsored: n.isSponsored || false,
            isBreaking: n.isBreaking || false,
            tags: n.tags || [],
            subCategory: n.subCat || '',
        });
    }
    console.log('✅ 16 news articles seeded');

    // ─── 4. Obituaries ───
    await Obituary.deleteMany({});
    const obituaryData = [
        { name: 'George Thomas', age: 78, district: 'Kottayam', photo: img('obit-1') },
        { name: 'Annamma Varghese', age: 85, district: 'Ernakulam', photo: img('obit-2') },
        { name: 'P.T. Abraham', age: 72, district: 'Thrissur', photo: img('obit-3') },
        { name: 'Leelamma Joseph', age: 80, district: 'Pathanamthitta', photo: img('obit-4') },
        { name: 'Rev. Samuel Mathew', age: 69, district: 'Idukki', photo: img('obit-5') },
        { name: 'Mary Philip', age: 90, district: 'Alappuzha', photo: img('obit-6') },
    ];
    for (let i = 0; i < obituaryData.length; i++) {
        const o = obituaryData[i];
        await Obituary.create({
            name: o.name, age: o.age, district: o.district, photo: o.photo,
            deathDate: new Date(Date.now() - i * 86400000 * 3),
            contentBlocks: [{ id: 'p1', type: 'paragraph', data: { text: `${o.name} of ${o.district}, aged ${o.age}, passed away peacefully. Funeral service will be held at the local church. May their soul rest in eternal peace.` } }],
            status: 'ACTIVE', createdBy: admin._id,
        });
    }
    console.log('✅ 6 obituaries seeded');

    // ─── 5. Matrimony ───
    await Matrimony.deleteMany({});
    const matrimonyData = [
        { name: 'Anu Sara Thomas', age: 26, gender: 'Female', education: 'M.Sc Nursing', denomination: 'Marthoma', district: 'Kottayam', contact: '9876543210' },
        { name: 'Renjith Mathew', age: 30, gender: 'Male', education: 'B.Tech IT', denomination: 'CSI', district: 'Ernakulam', contact: '9876543211' },
        { name: 'Asha Philip', age: 28, gender: 'Female', education: 'MBA Finance', denomination: 'Pentecostal', district: 'Thrissur', contact: '9876543212' },
        { name: 'Sam John', age: 32, gender: 'Male', education: 'MBBS MD', denomination: 'Jacobite', district: 'Pathanamthitta', contact: '9876543213' },
        { name: 'Sneha Abraham', age: 25, gender: 'Female', education: 'BDS', denomination: 'Brethren', district: 'Idukki', contact: '9876543214' },
        { name: 'Joel Kurian', age: 29, gender: 'Male', education: 'CA', denomination: 'Marthoma', district: 'Alappuzha', contact: '9876543215' },
    ];
    const now = new Date();
    for (const m of matrimonyData) {
        await Matrimony.create({
            name: m.name, age: m.age, gender: m.gender, education: m.education,
            denomination: m.denomination, district: m.district,
            description: `Looking for a well-educated, God-fearing partner. ${m.denomination} denomination preferred. Family is settled in ${m.district}.`,
            contactNumber: m.contact,
            photos: [img('matri-' + m.name.split(' ')[0].toLowerCase())],
            planDuration: 90, startDate: now,
            expiryDate: new Date(now.getTime() + 90 * 86400000),
            status: 'ACTIVE', createdBy: admin._id,
        });
    }
    console.log('✅ 6 matrimony profiles seeded');

    // ─── 6. Classifieds (Buy & Sell) ───
    await Classified.deleteMany({});
    const classifiedData = [
        { title: '3BHK Apartment for Sale in Kottayam', cat: 'real-estate', price: '₹65 Lakhs', location: 'Kottayam', contact: '9800000001', desc: 'Well-maintained 3BHK apartment near Medical College. 1500 sq ft, semi-furnished with car parking.' },
        { title: '2BHK House for Rent near Ernakulam Church', cat: 'rent-lease', price: '₹12,000/month', location: 'Ernakulam', contact: '9800000002', desc: 'Spacious 2BHK ground floor house. Suitable for small family. Near to market and church.' },
        { title: 'Building Construction Services', cat: 'construction', price: 'Contact for Quote', location: 'Thrissur', contact: '9800000003', desc: 'Professional building construction with 20 years experience. Church buildings, houses, and commercial spaces.' },
        { title: 'Christian Wedding Sarees Collection', cat: 'outfits', price: '₹2,500 - ₹15,000', location: 'Thiruvananthapuram', contact: '9800000004', desc: 'Exclusive collection of Kerala Christian wedding sarees. White, cream, and gold combinations available.' },
        { title: 'Land Plot near Highway - 15 Cents', cat: 'real-estate', price: '₹22 Lakhs', location: 'Alappuzha', contact: '9800000005', desc: '15 cents residential plot with all amenities. 200m from National Highway. Suitable for house or church.' },
        { title: 'Office Space for Rent - MG Road', cat: 'rent-lease', price: '₹25,000/month', location: 'Ernakulam', contact: '9800000006', desc: '600 sq ft furnished office space with AC, Wi-Fi, and parking. Ideal for small businesses or ministries.' },
        { title: 'Interior Design & Wood Work', cat: 'construction', price: 'Starting ₹5 Lakhs', location: 'Kottayam', contact: '9800000007', desc: 'Complete interior design solutions for homes and churches. Custom wood work, modular kitchen, and wardrobes.' },
        { title: 'Baptism White Dress Collection', cat: 'outfits', price: '₹800 - ₹3,000', location: 'Pathanamthitta', contact: '9800000008', desc: 'Beautiful white dresses for baptism ceremony. Available for all ages. Home delivery available across Kerala.' },
    ];
    for (let i = 0; i < classifiedData.length; i++) {
        const c = classifiedData[i];
        await Classified.create({
            title: c.title,
            slug: c.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-') + '-' + (i + 1),
            description: c.desc, category: c.cat,
            contactPhone: c.contact, contactName: 'Seller',
            images: [img('classified-' + (i + 1))],
            location: c.location, price: c.price,
            status: 'ACTIVE', viewCount: Math.floor(Math.random() * 500) + 20,
        });
    }
    console.log('✅ 8 classifieds seeded');

    // ─── 7. Videos ───
    await Video.deleteMany({});
    const videoData = [
        { title: 'Sunday Worship Service - February 2026', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', desc: 'Live worship service from Good News Church, Kottayam' },
        { title: 'Pastor Samuel\'s Sermon: Walking in Grace', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', desc: 'A powerful message about God\'s grace in our daily lives' },
        { title: 'Youth Conference 2025 Highlights', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', desc: 'Best moments from the Kerala Youth Christian Conference' },
        { title: 'Malayalam Worship Songs - Krupayude Daham', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', desc: 'Beautiful Malayalam Christian worship song collection' },
        { title: 'How to Study the Bible Effectively', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', desc: 'Practical tips for daily Bible study from Rev. Thomas' },
        { title: 'Testimony: From Darkness to Light', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', desc: 'An incredible testimony of transformation and redemption' },
    ];
    for (let i = 0; i < videoData.length; i++) {
        const v = videoData[i];
        await Video.create({
            title: v.title,
            slug: v.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-') + '-' + (i + 1),
            youtubeUrl: v.url, thumbnail: '', description: v.desc,
            categoryId: cats['spiritual'],
            status: 'PUBLISHED', viewCount: Math.floor(Math.random() * 1000) + 50,
            publishedAt: new Date(Date.now() - i * 86400000 * 2),
        });
    }
    console.log('✅ 6 videos seeded');

    // ─── 8. Prayer Requests ───
    await PrayerRequest.deleteMany({});
    const prayerData = [
        { title: 'Prayer for Healing', content: 'Please pray for my mother who is undergoing surgery next week. She has been fighting cancer for the past year. We believe in the power of prayer.', by: 'Sarah Thomas', type: 'prayer' },
        { title: 'Praise for Job Opportunity', content: 'Thank God! After 8 months of unemployment, I received a job offer in Bangalore. God is faithful and His timing is perfect.', by: 'Renjith Kumar', type: 'praise' },
        { title: 'Prayer for Marriage', content: 'Requesting prayers for my daughter\'s marriage. She has been waiting for the right partner. Please remember our family in your prayers.', by: 'Philip Abraham', type: 'prayer' },
        { title: 'Praise for Safe Delivery', content: 'Our family is blessed with a baby girl! Both mother and baby are healthy. Thank you Lord for this wonderful gift.', by: 'Anu Mathew', type: 'praise' },
        { title: 'Prayer for Students', content: 'Exam season is here. Please pray for all students, especially those appearing for board exams. May God give them wisdom and peace.', by: 'Teacher Mary', type: 'prayer' },
        { title: 'Praise for Church Growth', content: 'Our small prayer group has grown from 5 members to 50 in one year! God is doing great things in our community.', by: 'Pastor John', type: 'praise' },
        { title: 'Prayer for Missionaries', content: 'Remember our missionaries serving in Nepal. They face challenges but remain faithful. Pray for protection and provision.', by: 'Mission Board', type: 'prayer' },
        { title: 'Praise for Baptism', content: '12 new members were baptized in our church last Sunday! Praise God for every soul that comes to know Him.', by: 'Deacon Samuel', type: 'praise' },
    ];
    for (const p of prayerData) {
        await PrayerRequest.create({ title: p.title, content: p.content, submittedBy: p.by, type: p.type, isApproved: true });
    }
    console.log('✅ 8 prayer requests seeded');

    // ─── 9. Subscribers ───
    await Subscriber.deleteMany({});
    const emails = ['reader1@gmail.com', 'reader2@gmail.com', 'reader3@gmail.com', 'subscriber@yahoo.com', 'believer@outlook.com'];
    for (const e of emails) {
        await Subscriber.create({ email: e });
    }
    console.log('✅ 5 subscribers seeded');

    // ─── Done ───
    console.log('\n🎉 All sample data seeded successfully!');
    console.log('   Login: admin@goodnews.in / Admin@123456\n');
    await mongoose.disconnect();
}

main().catch(err => { console.error('❌ Seed failed:', err); process.exit(1); });
