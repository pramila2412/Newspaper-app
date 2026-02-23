import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User, UserStatus, UserRole } from '../models/User';
import { env } from '../config/env';
import { AuthRequest } from '../middlewares/auth';

const generateAccessToken = (userId: string, role: UserRole): string => {
    const options: SignOptions = { expiresIn: env.JWT_ACCESS_EXPIRY as any };
    return jwt.sign({ userId, role }, env.JWT_ACCESS_SECRET, options);
};

const generateRefreshToken = (userId: string, role: UserRole): string => {
    const options: SignOptions = { expiresIn: env.JWT_REFRESH_EXPIRY as any };
    return jwt.sign({ userId, role }, env.JWT_REFRESH_SECRET, options);
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        if (user.status !== UserStatus.ACTIVE) {
            res.status(403).json({ message: 'Account is not active. Contact Super Admin.' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const accessToken = generateAccessToken(String(user._id), user.role);
        const refreshToken = generateRefreshToken(String(user._id), user.role);

        user.refreshToken = refreshToken;
        await user.save();

        res.json({
            accessToken,
            refreshToken,
            user: { id: user._id, email: user.email, name: user.name, role: user.role },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken: token } = req.body;
        if (!token) {
            res.status(401).json({ message: 'Refresh token required' });
            return;
        }

        const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string; role: UserRole };
        const user = await User.findById(decoded.userId);

        if (!user || user.refreshToken !== token) {
            res.status(401).json({ message: 'Invalid refresh token' });
            return;
        }

        const accessToken = generateAccessToken(String(user._id), user.role);
        const newRefreshToken = generateRefreshToken(String(user._id), user.role);

        user.refreshToken = newRefreshToken;
        await user.save();

        res.json({ accessToken, refreshToken: newRefreshToken });
    } catch {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};

export const setPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, activationToken } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (user.status !== UserStatus.ACTIVE) {
            res.status(403).json({ message: 'Account must be activated by Super Admin first' });
            return;
        }

        if (user.passwordHash && user.passwordHash.length > 0) {
            res.status(400).json({ message: 'Password already set. Use login instead.' });
            return;
        }

        const salt = await bcrypt.genSalt(12);
        user.passwordHash = await bcrypt.hash(password, salt);
        await user.save();

        res.json({ message: 'Password set successfully. You can now login.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.userId).select('-passwordHash -refreshToken');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        await User.findByIdAndUpdate(req.userId, { refreshToken: null });
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
