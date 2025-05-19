'use client';

import { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Tabs, 
  Tab,
  SelectChangeEvent
} from '@mui/material';

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

// 時計の針の角度を計算
const calculateHandAngle = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const hourAngle = (hours % 12) * 30 + minutes * 0.5; // 1時間 = 30度、1分 = 0.5度
  const minuteAngle = minutes * 6; // 1分 = 6度
  return { hourAngle, minuteAngle };
};

// 扇形のスタイルを生成
const generateSectorStyle = (startAngle: number, endAngle: number, color: string) => {
  const startRad = (startAngle - 90) * (Math.PI / 180);
  const endRad = (endAngle - 90) * (Math.PI / 180);
  
  const x1 = 150 + 150 * Math.cos(startRad);
  const y1 = 150 + 150 * Math.sin(startRad);
  const x2 = 150 + 150 * Math.cos(endRad);
  const y2 = 150 + 150 * Math.sin(endRad);

  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  const path = `
    M 150 150
    L ${x1} ${y1}
    A 150 150 0 ${largeArcFlag} 1 ${x2} ${y2}
    Z
  `;

  return {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    '& path': {
      fill: color,
      opacity: 0.3,
      stroke: color,
      strokeWidth: 2,
    },
  };
};

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
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
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
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="終了時間"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
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
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              スケジュール表示
            </Typography>
            <Box sx={{ 
              position: 'relative', 
              width: '100%', 
              height: 400,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {/* 時計の外枠 */}
              <Box sx={{
                position: 'relative',
                width: 300,
                height: 300,
                borderRadius: '50%',
                border: '2px solid #000',
                backgroundColor: '#fff',
              }}>
                {/* スケジュールの領域 */}
                {schedules.map((schedule) => {
                  const start = calculateHandAngle(schedule.startTime);
                  const end = calculateHandAngle(schedule.endTime);
                  return (
                    <Box
                      key={schedule.id}
                      sx={generateSectorStyle(start.hourAngle, end.hourAngle, schedule.color)}
                    >
                      <svg width="300" height="300" viewBox="0 0 300 300">
                        <path d={`
                          M 150 150
                          L ${150 + 150 * Math.cos((start.hourAngle - 90) * (Math.PI / 180))} 
                             ${150 + 150 * Math.sin((start.hourAngle - 90) * (Math.PI / 180))}
                          A 150 150 0 ${end.hourAngle - start.hourAngle <= 180 ? 0 : 1} 1
                             ${150 + 150 * Math.cos((end.hourAngle - 90) * (Math.PI / 180))}
                             ${150 + 150 * Math.sin((end.hourAngle - 90) * (Math.PI / 180))}
                          Z
                        `} />
                      </svg>
                    </Box>
                  );
                })}

                {/* 時計の数字 */}
                {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((hour) => (
                  <Typography
                    key={hour}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: `translate(-50%, -50%) rotate(${hour * 30}deg) translateY(-120px) rotate(${-hour * 30}deg)`,
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      zIndex: 1,
                    }}
                  >
                    {hour}
                  </Typography>
                ))}

                {/* 時計の目盛り */}
                {Array.from({ length: 60 }).map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: i % 5 === 0 ? '2px' : '1px',
                      height: i % 5 === 0 ? '10px' : '5px',
                      backgroundColor: '#000',
                      transformOrigin: 'bottom center',
                      transform: `translate(-50%, -100%) rotate(${i * 6}deg) translateY(-140px)`,
                      zIndex: 1,
                    }}
                  />
                ))}
              </Box>

              {/* スケジュールの凡例 */}
              <Box sx={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                p: 1
              }}>
                {schedules.map((schedule) => (
                  <Box
                    key={schedule.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      padding: '4px 8px',
                      borderRadius: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        backgroundColor: schedule.color,
                        borderRadius: '50%',
                      }}
                    />
                    <Typography variant="body2">
                      {schedule.title} ({schedule.startTime}-{schedule.endTime})
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 