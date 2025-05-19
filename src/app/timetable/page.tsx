'use client';

import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import ScheduleDisplay from '../components/timeTable/schedule';
import ScheduleInput from '../components/timeTable/scheduleInput';

interface Schedule {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
}

export default function TimeTable() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  // スケジュールの取得
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch('/api/schedules');
        const data = await response.json();
        setSchedules(data);
      } catch (error) {
        console.error('スケジュールの取得に失敗しました:', error);
      }
    };

    fetchSchedules();
  }, []);

  const handleAddSchedule = async (newSchedule: Omit<Schedule, 'id'>) => {
    try {
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSchedule),
      });

      if (!response.ok) {
        throw new Error('スケジュールの追加に失敗しました');
      }

      const savedSchedule = await response.json();
      setSchedules([...schedules, savedSchedule]);
    } catch (error) {
      console.error('スケジュールの追加に失敗しました:', error);
      throw error;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        タイムテーブル
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box>
          <ScheduleInput
            onAddSchedule={handleAddSchedule}
            existingSchedules={schedules}
          />
        </Box>
        <Box>
          <ScheduleDisplay schedules={schedules} />
        </Box>
      </Box>
    </Box>
  );
} 