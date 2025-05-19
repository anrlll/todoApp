'use client';

import { Container, Typography, Paper, useTheme } from '@mui/material';

export default function TimeTable() {
  const theme = useTheme();

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: theme.palette.background.default,
        }}
      >
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          タイムテーブル
        </Typography>
        {/* ここにタイムテーブルの実装を追加 */}
      </Paper>
    </Container>
  );
} 