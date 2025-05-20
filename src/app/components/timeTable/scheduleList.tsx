'use client';

import { useState } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip, Button, Dialog } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RegisterSchedule from './registerSchedule';

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
  onAddSchedule: (schedule: Omit<Schedule, 'id'>) => Promise<void>;
}

export default function ScheduleList({ schedules, onDeleteSchedule, onHighlightSchedule, onAddSchedule }: ScheduleListProps) {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

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
    <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexShrink: 0 }}>
        <Typography variant="h6">
          スケジュール一覧
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsRegisterModalOpen(true)}
        >
          スケジュール登録
        </Button>
      </Box>
      
      <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>時間</TableCell>
              <TableCell>タイトル</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedSchedules.map((schedule) => (
              <TableRow
                key={schedule.id}
                onMouseEnter={() => onHighlightSchedule?.(schedule.id)}
                onMouseLeave={() => onHighlightSchedule?.(null)}
                sx={{
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
                        minWidth: 16,
                        minHeight: 16,
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
                      sx={{ cursor: 'pointer' }}
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

      <Dialog
        open={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '50%',
          }
        }}
      >
        <RegisterSchedule
          onClose={() => setIsRegisterModalOpen(false)}
          onAddSchedule={onAddSchedule}
          existingSchedules={schedules}
        />
      </Dialog>
    </Paper>
  );
} 