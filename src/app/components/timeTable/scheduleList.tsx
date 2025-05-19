'use client';

import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Schedule {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
}

interface ScheduleListProps {
  schedules: Schedule[];
  onDeleteSchedule: (id: string) => Promise<void>;
  onHighlightSchedule?: (id: string | null) => void;
}

export default function ScheduleList({ schedules, onDeleteSchedule, onHighlightSchedule }: ScheduleListProps) {
  const handleDelete = async (id: string) => {
    if (window.confirm('このスケジュールを削除してもよろしいですか？')) {
      try {
        await onDeleteSchedule(id);
      } catch (error) {
        console.error('スケジュールの削除に失敗しました:', error);
        alert('スケジュールの削除に失敗しました');
      }
    }
  };

  // スケジュールを開始時間でソート
  const sortedSchedules = [...schedules].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        スケジュール一覧
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>時間</TableCell>
              <TableCell>タイトル</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedSchedules.map((schedule) => (
              <TableRow
                key={schedule.id}
                onMouseEnter={() => onHighlightSchedule?.(schedule.id)}
                onMouseLeave={() => onHighlightSchedule?.(null)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <TableCell>
                  {schedule.startTime} - {schedule.endTime}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        backgroundColor: schedule.color,
                        borderRadius: '4px',
                      }}
                    />
                    {schedule.title}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="削除">
                    <IconButton
                      onClick={() => handleDelete(schedule.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
} 