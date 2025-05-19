'use client';

import { useState, useEffect } from 'react';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import ScheduleInput from './scheduleInput';

interface Schedule {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
}

export default function RegisterSchedule() {
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
      router.push('/timetable');
    } catch (error) {
      console.error('スケジュールの追加に失敗しました:', error);
      throw error;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">スケジュール登録</Typography>
          <Button
            variant="outlined"
            onClick={() => router.push('/timetable')}
          >
            戻る
          </Button>
        </Box>
        <ScheduleInput onAddSchedule={handleAddSchedule} existingSchedules={schedules} />
      </Paper>
    </Container>
  );
} 