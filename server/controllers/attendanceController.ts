import { Request, Response } from 'express';
import Attendance from '../models/Attendance.js';
import Profile from '../models/Profile.js';
import Bus from '../models/Bus.js';

export const markAttendance = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { busId, status } = req.body;

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    const attendance = await Attendance.create({
      userId,
      busId,
      status: status || 'Present'
    });

    res.status(201).json(attendance);
  } catch (error: any) {
    res.status(500).json({ message: 'Error marking attendance', error: error.message });
  }
};

export const getAttendance = async (req: Request, res: Response) => {
  try {
    const records = await Attendance.find()
      .populate('userId', 'username email')
      .populate('busId', 'busNumber routeName')
      .sort({ timestamp: -1 })
      .lean();

    // Attach profile data
    const enrichedRecords = await Promise.all(
      records.map(async (record: any) => {
        const profile = await Profile.findOne({ userId: record.userId._id }).select('fullName registerNumber department');
        return {
          ...record,
          profile: profile || null
        };
      })
    );

    res.json(enrichedRecords);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
