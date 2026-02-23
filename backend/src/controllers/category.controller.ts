import { Request, Response } from 'express';
import slugify from 'slugify';
import { Category } from '../models/Category';
import { AuthRequest } from '../middlewares/auth';
import { createAuditLog } from '../services/audit.service';

export const createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, order } = req.body;
        const slug = slugify(name, { lower: true, strict: true });

        const exists = await Category.findOne({ slug });
        if (exists) {
            res.status(400).json({ message: 'Category already exists' });
            return;
        }

        const category = await Category.create({ name, slug, order: order || 0 });
        await createAuditLog(req.userId!, 'CREATE_CATEGORY', 'Category', String(category._id), null, { name, slug });

        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
    try {
        const categories = await Category.find().sort({ order: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateCategory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }

        const before = { name: category.name, order: category.order };

        if (req.body.name) {
            category.name = req.body.name;
            category.slug = slugify(req.body.name, { lower: true, strict: true });
        }
        if (req.body.order !== undefined) category.order = req.body.order;

        await category.save();
        await createAuditLog(req.userId!, 'UPDATE_CATEGORY', 'Category', String(category._id), before, { name: category.name, order: category.order });

        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteCategory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }

        await createAuditLog(req.userId!, 'DELETE_CATEGORY', 'Category', req.params.id, { name: category.name }, null);
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
