'use client';

import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ScheduleDisplay from '../components/timeTable/schedule';
import ScheduleInput from '../components/timeTable/scheduleInput';

interface Schedule {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
}

export default function TimeTablePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  // スケジュールの取得
  const fetchSchedules = async () => {
    try {
      const response = await fetch('/api/schedules');
      if (!response.ok) throw new Error('スケジュールの取得に失敗しました');
      const data = await response.json();
      setSchedules(data);
    } catch (error) {
      console.error('スケジュールの取得に失敗しました:', error);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // スケジュールの追加
  const handleAddSchedule = async (newSchedule: Omit<Schedule, 'id'>) => {
    try {
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSchedule),
      });

      if (!response.ok) throw new Error('スケジュールの追加に失敗しました');
      const data = await response.json();
      setSchedules([...schedules, data]);
    } catch (error) {
      console.error('スケジュールの追加に失敗しました:', error);
      throw error;
    }
  };

  // スケジュールの削除
  const handleDeleteSchedule = async (id: string) => {
    try {
      const response = await fetch(`/api/schedules/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('スケジュールの削除に失敗しました');
      setSchedules(schedules.filter(schedule => schedule.id !== id));
    } catch (error) {
      console.error('スケジュールの削除に失敗しました:', error);
      throw error;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ width: { xs: '100%', md: '33%' } }}>
          <ScheduleInput onAddSchedule={handleAddSchedule} existingSchedules={schedules} />
        </Box>
        <Box sx={{ width: { xs: '100%', md: '67%' } }}>
          <ScheduleDisplay schedules={schedules} onDeleteSchedule={handleDeleteSchedule} />
        </Box>
      </Box>
    </Box>
  );
} 