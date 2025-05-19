'use client';

import { Box, Typography, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import ScheduleList from './scheduleList';

interface Schedule {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
}

interface ScheduleDisplayProps {
  schedules: Schedule[];
  onDeleteSchedule: (id: string) => Promise<void>;
}

// 時計の針の角度を計算
const calculateHandAngle = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const hourAngle = (hours % 12) * 30 + minutes * 0.5; // 1時間 = 30度、1分 = 0.5度
  const minuteAngle = minutes * 6; // 1分 = 6度
  return { hourAngle, minuteAngle };
};

// 扇形のスタイルを生成
const generateSectorStyle = (startAngle: number, endAngle: number, color: string, isHighlighted: boolean = false) => {
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    '& path': {
      fill: color,
      opacity: isHighlighted ? 0.5 : 0.3,
      stroke: color,
      strokeWidth: isHighlighted ? 3 : 2,
    },
  };
};

// スケジュールを時間帯ごとに分割
const splitScheduleByPeriod = (schedule: Schedule) => {
  const startHour = parseInt(schedule.startTime.split(':')[0]);
  const endHour = parseInt(schedule.endTime.split(':')[0]);
  
  // 午前と午後をまたぐ場合
  if (startHour < 12 && endHour >= 12) {
    return [
      {
        ...schedule,
        endTime: '12:00',
      },
      {
        ...schedule,
        startTime: '12:00',
      },
    ];
  }
  
  return [schedule];
};

// 時計コンポーネント
const Clock = ({ 
  schedules, 
  period,
  highlightedScheduleId
}: { 
  schedules: Schedule[], 
  period: 'am' | 'pm',
  highlightedScheduleId: string | null
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // スケジュールを時間帯ごとに分割して表示
  const displaySchedules = schedules.flatMap(schedule => {
    const splitSchedules = splitScheduleByPeriod(schedule);
    return splitSchedules.filter(splitSchedule => {
      const hour = parseInt(splitSchedule.startTime.split(':')[0]);
      return period === 'am' ? hour < 12 : hour >= 12;
    });
  });

  // 現在時刻の角度を計算
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  
  // 午前/午後の判定
  const isCurrentPeriod = period === 'am' ? currentHour < 12 : currentHour >= 12;
  
  // 針の角度を計算（該当時間帯でない場合は12時の位置に固定）
  const currentHourAngle = isCurrentPeriod 
    ? (currentHour % 12) * 30 + currentMinute * 0.5 
    : 0;
  const currentMinuteAngle = isCurrentPeriod 
    ? currentMinute * 6 
    : 0;

  return (
    <Box sx={{ 
      position: 'relative', 
      width: 250,
      height: 250,
      borderRadius: '50%',
      border: '2px solid #000',
      backgroundColor: '#fff',
    }}>
      {/* スケジュールの領域 */}
      {displaySchedules.map((schedule) => {
        const start = calculateHandAngle(schedule.startTime);
        const end = calculateHandAngle(schedule.endTime);
        const isHighlighted = schedule.id === highlightedScheduleId;
        return (
          <Box
            key={`${schedule.id}-${schedule.startTime}`}
            sx={generateSectorStyle(start.hourAngle, end.hourAngle, schedule.color, isHighlighted)}
          >
            <svg width="250" height="250" viewBox="0 0 250 250">
              <path d={`
                M 125 125
                L ${125 + 123 * Math.cos((start.hourAngle - 90) * (Math.PI / 180))} 
                   ${125 + 123 * Math.sin((start.hourAngle - 90) * (Math.PI / 180))}
                A 123 123 0 ${end.hourAngle - start.hourAngle <= 180 ? 0 : 1} 1
                   ${125 + 123 * Math.cos((end.hourAngle - 90) * (Math.PI / 180))}
                   ${125 + 123 * Math.sin((end.hourAngle - 90) * (Math.PI / 180))}
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
            transform: `translate(-50%, -50%) rotate(${hour * 30}deg) translateY(-100px) rotate(${-hour * 30}deg)`,
            fontSize: '1rem',
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
            height: i % 5 === 0 ? '8px' : '4px',
            backgroundColor: '#000',
            transformOrigin: 'bottom center',
            transform: `translate(-50%, -100%) rotate(${i * 6}deg) translateY(-115px)`,
            zIndex: 1,
          }}
        />
      ))}

      {/* 現在時刻の針 */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '3px',
          height: '65px',
          backgroundColor: '#000',
          transformOrigin: 'bottom center',
          transform: `translate(-50%, -100%) rotate(${currentHourAngle}deg)`,
          zIndex: 2,
          borderRadius: '1.5px',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '2px',
          height: '100px',
          backgroundColor: '#000',
          transformOrigin: 'bottom center',
          transform: `translate(-50%, -100%) rotate(${currentMinuteAngle}deg)`,
          zIndex: 2,
          borderRadius: '1px',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '6px',
          height: '6px',
          backgroundColor: '#000',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 3,
        }}
      />
    </Box>
  );
};

export default function ScheduleDisplay({ schedules, onDeleteSchedule }: ScheduleDisplayProps) {
  const [highlightedScheduleId, setHighlightedScheduleId] = useState<string | null>(null);

  return (
    <Box sx={{ display: 'flex', gap: 3, width: '100%', height: 'calc(100vh - 64px)' }}>
      <Paper sx={{ p: 3, flex: 1 }}>
        <Typography variant="h6" gutterBottom>
          スケジュール表示
        </Typography>
        <Box sx={{ 
          position: 'relative', 
          width: '100%', 
          height: 600,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 4
        }}>
          {/* 午前の時計 */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>午前</Typography>
            <Clock 
              schedules={schedules} 
              period="am" 
              highlightedScheduleId={highlightedScheduleId}
            />
          </Box>

          {/* 午後の時計 */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>午後</Typography>
            <Clock 
              schedules={schedules} 
              period="pm" 
              highlightedScheduleId={highlightedScheduleId}
            />
          </Box>
        </Box>
      </Paper>
      <Box sx={{ flex: 1, height: '100%' }}>
        <ScheduleList 
          schedules={schedules} 
          onDeleteSchedule={onDeleteSchedule} 
          onHighlightSchedule={setHighlightedScheduleId}
        />
      </Box>
    </Box>
  );
} 