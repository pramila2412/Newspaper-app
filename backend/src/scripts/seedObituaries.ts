import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Obituary, ObituaryStatus } from '../models/Obituary';
import { User, UserRole } from '../models/User';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/newspaper_db';

const seedObituaries = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        // Get admin user to assign creation to
        const adminUser = await User.findOne({ role: UserRole.SUPER_ADMIN });
        if (!adminUser) {
            console.error('No admin user found. Please run regular seed script first.');
            process.exit(1);
        }

        console.log('Clearing old obituaries...');
        await Obituary.deleteMany({});

        const obituaries = [
            {
                name: "Thomas Varghese (Kunjumon)",
                age: 82,
                district: "Pathanamthitta",
                deathDate: new Date("2025-12-15"),
                photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                status: ObituaryStatus.ACTIVE,
                viewCount: 1420,
                createdBy: adminUser._id,
                contentBlocks: [
                    {
                        id: "block-1",
                        type: "paragraph",
                        data: {
                            text: "With deep sorrow, we announce the passing of Mr. Thomas Varghese (Kunjumon), 82 years old, belonging to the Emmanuel Marthoma Church, Pathanamthitta. He went to be with the Lord peacefully surrounded by his family."
                        }
                    },
                    {
                        id: "block-2",
                        type: "heading",
                        data: {
                            text: "Funeral Service Details",
                            level: 3
                        }
                    },
                    {
                        id: "block-3",
                        type: "paragraph",
                        data: {
                            text: "The viewing will be held at his residence on Thursday from 9:00 AM to 11:00 AM. The funeral service will follow at 11:30 AM at the Emmanuel Marthoma Church cemetery."
                        }
                    },
                    {
                        id: "block-4",
                        type: "bible_verse",
                        data: {
                            verse: "I have fought the good fight, I have finished the race, I have kept the faith.",
                            reference: "2 Timothy 4:7"
                        }
                    }
                ]
            },
            {
                name: "Mariamma Kurian",
                age: 76,
                district: "Kottayam",
                deathDate: new Date("2026-01-05"),
                photo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                status: ObituaryStatus.ACTIVE,
                viewCount: 955,
                createdBy: adminUser._id,
                contentBlocks: [
                    {
                        id: "block-1",
                        type: "paragraph",
                        data: {
                            text: "It is with heavy hearts we share that Mrs. Mariamma Kurian (76) of Puthupally, Kottayam, has been called to her heavenly abode. She was a devoted mother and a dedicated member of St. George O.S. Church."
                        }
                    },
                    {
                        id: "block-2",
                        type: "quote",
                        data: {
                            text: "A life so beautifully lived deserves to be beautifully remembered.",
                            author: "Family"
                        }
                    }
                ]
            },
            {
                name: "Pastor P.K. Abraham",
                age: 88,
                district: "Ernakulam",
                deathDate: new Date("2026-02-10"),
                photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                status: ObituaryStatus.ACTIVE,
                viewCount: 3200,
                createdBy: adminUser._id,
                contentBlocks: [
                    {
                        id: "block-1",
                        type: "paragraph",
                        data: {
                            text: "Pastor P.K. Abraham (88), a beloved servant of God and founder of faith missions in Ernakulam, has entered into his eternal rest. His legacy of love, faith, and tireless ministry leaves an indelible mark on thousands of lives."
                        }
                    },
                    {
                        id: "block-2",
                        type: "bible_verse",
                        data: {
                            verse: "Well done, good and faithful servant! You have been faithful with a few things; I will put you in charge of many things. Come and share your master’s happiness!",
                            reference: "Matthew 25:23"
                        }
                    }
                ]
            },
            {
                name: "Sosamma Mathew (Omana)",
                age: 65,
                district: "Trivandrum",
                deathDate: new Date("2026-02-20"),
                photo: "https://images.unsplash.com/photo-1581404169727-de2c3a516e8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                status: ObituaryStatus.ACTIVE,
                viewCount: 450,
                createdBy: adminUser._id,
                contentBlocks: [
                    {
                        id: "block-1",
                        type: "paragraph",
                        data: {
                            text: "Sosamma Mathew (Omana, 65) of Trivandrum passed away peacefully. A retired nursing superintendent at Medical College Hospital, she spent her life serving others with compassion."
                        }
                    },
                    {
                        id: "block-2",
                        type: "paragraph",
                        data: {
                            text: "Funeral details will be announced once family members arrive from abroad. Let us uphold the bereaved family in prayer during this difficult time."
                        }
                    }
                ]
            }
        ];

        console.log(`Inserting ${obituaries.length} obituaries...`);
        await Obituary.insertMany(obituaries);

        console.log('Seed completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedObituaries();
