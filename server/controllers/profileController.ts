import { Request, Response } from 'express';
import Profile from '../models/Profile.js';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const profile = await Profile.findOne({ userId }).populate('userId', 'username email role');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const existingProfile = await Profile.findOne({ userId });
    
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    const { fullName, registerNumber, phone, department, year, gender, address } = req.body;
    
    const profile = await Profile.create({
      userId,
      fullName,
      registerNumber,
      phone,
      department,
      year,
      gender,
      address
    });
    
    res.status(201).json(profile);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { fullName, registerNumber, phone, department, year, gender, address } = req.body;
    
    const profile = await Profile.findOneAndUpdate(
      { userId },
      { fullName, registerNumber, phone, department, year, gender, address },
      { new: true, runValidators: true }
    );
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
