'use client';

import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ScheduleDisplay from '../components/timeTable/schedule';

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
    <Box>
      <ScheduleDisplay schedules={schedules} onDeleteSchedule={handleDeleteSchedule} />
    </Box>
  );
} 