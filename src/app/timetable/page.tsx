'use client';

import { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
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
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/timetable/register')}
        >
          スケジュール登録
        </Button>
      </Box>
      <Box>
          <ScheduleDisplay schedules={schedules} onDeleteSchedule={handleDeleteSchedule} />
      </Box>
    </Box>
  );
} 