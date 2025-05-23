'use client';

import { useState, useEffect } from 'react';
import { Box, Button, Paper, Typography, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ScheduleInput from './scheduleInput';

interface Schedule {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
}

interface RegisterScheduleProps {
  onClose: () => void;
  onAddSchedule: (schedule: Omit<Schedule, 'id'>) => Promise<void>;
  existingSchedules: Schedule[];
}

export default function RegisterSchedule({ onClose, onAddSchedule, existingSchedules }: RegisterScheduleProps) {
  const handleAddSchedule = async (newSchedule: Omit<Schedule, 'id'>) => {
    try {
      await onAddSchedule(newSchedule);
      onClose();
    } catch (error) {
      console.error('スケジュールの追加に失敗しました:', error);
      throw error;
    }
  };

  return (
    <>
      <DialogContent>
          <ScheduleInput onAddSchedule={handleAddSchedule} existingSchedules={existingSchedules} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
      </DialogActions>
    </>
  );
} 