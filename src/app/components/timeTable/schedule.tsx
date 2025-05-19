'use client';

import { Box, Typography } from '@mui/material';

interface Schedule {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
}

interface ScheduleDisplayProps {
  schedules: Schedule[];
}

// 時計の針の角度を計算
const calculateHandAngle = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const hourAngle = (hours % 12) * 30 + minutes * 0.5; // 1時間 = 30度、1分 = 0.5度
  const minuteAngle = minutes * 6; // 1分 = 6度
  return { hourAngle, minuteAngle };
};

// 扇形のスタイルを生成
const generateSectorStyle = (startAngle: number, endAngle: number, color: string) => {
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

export default function ScheduleDisplay({ schedules }: ScheduleDisplayProps) {
  return (
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
                  L ${150 + 148 * Math.cos((start.hourAngle - 90) * (Math.PI / 180))} 
                     ${150 + 148 * Math.sin((start.hourAngle - 90) * (Math.PI / 180))}
                  A 148 148 0 ${end.hourAngle - start.hourAngle <= 180 ? 0 : 1} 1
                     ${150 + 148 * Math.cos((end.hourAngle - 90) * (Math.PI / 180))}
                     ${150 + 148 * Math.sin((end.hourAngle - 90) * (Math.PI / 180))}
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
  );
} 