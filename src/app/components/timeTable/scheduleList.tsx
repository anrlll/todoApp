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
}

export default function ScheduleList({ schedules, onDeleteSchedule }: ScheduleListProps) {
  // スケジュールを開始時間でソート
  const sortedSchedules = [...schedules].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

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

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          スケジュール一覧
        </Typography>
      </Box>
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
              <TableRow key={schedule.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        backgroundColor: schedule.color,
                        borderRadius: '50%',
                      }}
                    />
                    {schedule.startTime} - {schedule.endTime}
                  </Box>
                </TableCell>
                <TableCell>{schedule.title}</TableCell>
                <TableCell align="right">
                  <Tooltip title="削除">
                    <IconButton
                      onClick={() => handleDelete(schedule.id)}
                      color="error"
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