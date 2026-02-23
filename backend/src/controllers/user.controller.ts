import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User, UserRole, UserStatus } from '../models/User';
import { AuthRequest } from '../middlewares/auth';
import { createAuditLog } from '../services/audit.service';

export const createEditor = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { email, name } = req.body;

        const exists = await User.findOne({ email: email.toLowerCase() });
        if (exists) {
            res.status(400).json({ message: 'User with this email already exists' });
            return;
        }

        const user = await User.create({
            email: email.toLowerCase(),
            name,
            role: UserRole.EDITOR,
            status: UserStatus.PENDING,
        });

        await createAuditLog(req.userId!, 'CREATE_EDITOR', 'User', String(user._id), null, { email, name });

        res.status(201).json({ message: 'Editor created with PENDING status', user: { id: user._id, email: user.email, name: user.name, status: user.status } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const activateEditor = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || user.role !== UserRole.EDITOR) {
            res.status(404).json({ message: 'Editor not found' });
            return;
        }

        const before = { status: user.status };
        user.status = UserStatus.ACTIVE;
        await user.save();

        await createAuditLog(req.userId!, 'ACTIVATE_EDITOR', 'User', String(user._id), before, { status: UserStatus.ACTIVE });

        res.json({ message: 'Editor activated. They can now set their password.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deactivateEditor = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || user.role !== UserRole.EDITOR) {
            res.status(404).json({ message: 'Editor not found' });
            return;
        }

        const before = { status: user.status };
        user.status = UserStatus.INACTIVE;
        await user.save();

        await createAuditLog(req.userId!, 'DEACTIVATE_EDITOR', 'User', String(user._id), before, { status: UserStatus.INACTIVE });

        res.json({ message: 'Editor deactivated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteEditor = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || user.role !== UserRole.EDITOR) {
            res.status(404).json({ message: 'Editor not found' });
            return;
        }

        await User.findByIdAndDelete(req.params.id);
        await createAuditLog(req.userId!, 'DELETE_EDITOR', 'User', req.params.id, { email: user.email, name: user.name }, null);

        res.json({ message: 'Editor deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const listUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const filter: any = {};
        if (req.query.role) filter.role = req.query.role;
        if (req.query.status) filter.status = req.query.status;

        const [users, total] = await Promise.all([
            User.find(filter).select('-passwordHash -refreshToken').sort({ createdAt: -1 }).skip(skip).limit(limit),
            User.countDocuments(filter),
        ]);

        res.json({ users, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
