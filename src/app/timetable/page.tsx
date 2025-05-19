'use client';

import { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Tabs, 
  Tab,
  SelectChangeEvent
} from '@mui/material';
import ScheduleDisplay from '../components/timeTable/schedule';

interface Schedule {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

// 時間の選択肢を生成（00:00から23:30まで30分間隔）
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      times.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return times;
};

const TIME_OPTIONS = generateTimeOptions();

export default function TimeTable() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [inputMode, setInputMode] = useState<'manual' | 'select'>('manual');

  const handleAddSchedule = () => {
    if (!title || !startTime || !endTime) return;

    // 時間の重複チェック
    const hasOverlap = schedules.some(schedule => {
      return (
        (startTime >= schedule.startTime && startTime < schedule.endTime) ||
        (endTime > schedule.startTime && endTime <= schedule.endTime) ||
        (startTime <= schedule.startTime && endTime >= schedule.endTime)
      );
    });

    if (hasOverlap) {
      alert('この時間帯は既に予定が入っています。');
      return;
    }

    const newSchedule: Schedule = {
      id: Date.now().toString(),
      title,
      startTime,
      endTime,
      color: COLORS[schedules.length % COLORS.length],
    };

    setSchedules([...schedules, newSchedule]);
    setTitle('');
    setStartTime('');
    setEndTime('');
  };

  const handleTimeChange = (event: SelectChangeEvent<string>, type: 'start' | 'end') => {
    const value = event.target.value;
    if (type === 'start') {
      setStartTime(value);
    } else {
      setEndTime(value);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        タイムテーブル
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              スケジュール入力
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Tabs
                value={inputMode}
                onChange={(_, newValue) => setInputMode(newValue)}
                sx={{ mb: 2 }}
              >
                <Tab value="manual" label="手動入力" />
                <Tab value="select" label="プルダウン選択" />
              </Tabs>

              <TextField
                label="タイトル"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
              />

              {inputMode === 'manual' ? (
                <>
                  <TextField
                    label="開始時間"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  <TextField
                    label="終了時間"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                </>
              ) : (
                <>
                  <FormControl fullWidth>
                    <InputLabel>開始時間</InputLabel>
                    <Select
                      value={startTime}
                      label="開始時間"
                      onChange={(e) => handleTimeChange(e, 'start')}
                    >
                      {TIME_OPTIONS.map((time) => (
                        <MenuItem key={time} value={time}>
                          {time}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>終了時間</InputLabel>
                    <Select
                      value={endTime}
                      label="終了時間"
                      onChange={(e) => handleTimeChange(e, 'end')}
                    >
                      {TIME_OPTIONS.map((time) => (
                        <MenuItem key={time} value={time}>
                          {time}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}

              <Button
                variant="contained"
                onClick={handleAddSchedule}
                disabled={!title || !startTime || !endTime}
              >
                追加
              </Button>
            </Box>
          </Paper>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              スケジュール表示
            </Typography>
            <ScheduleDisplay schedules={schedules} />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
} 