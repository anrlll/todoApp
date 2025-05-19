'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

function SortableTodoItem({ todo, onToggle, onDelete }: {
  todo: TodoItem;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const theme = useTheme();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      sx={{
        bgcolor: theme.palette.background.paper,
        borderRadius: 1,
        mb: 1,
        boxShadow: 1,
        '&:hover': {
          bgcolor: alpha(theme.palette.primary.main, 0.04),
        },
      }}
    >
      <IconButton
        {...attributes}
        {...listeners}
        sx={{
          cursor: 'grab',
          '&:active': {
            cursor: 'grabbing',
          },
        }}
      >
        <DragIcon />
      </IconButton>
      <Checkbox
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        sx={{
          '&.Mui-checked': {
            color: theme.palette.primary.main,
          },
        }}
      />
      <ListItemText
        primary={todo.text}
        sx={{
          textDecoration: todo.completed ? 'line-through' : 'none',
          color: todo.completed ? theme.palette.text.secondary : theme.palette.text.primary,
        }}
      />
      <Box sx={{ ml: 'auto' }}>
        <IconButton
          edge="end"
          onClick={() => onDelete(todo.id)}
          sx={{
            color: theme.palette.error.main,
            '&:hover': {
              bgcolor: alpha(theme.palette.error.main, 0.1),
            },
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </ListItem>
  );
}

export default function Todo() {
  const theme = useTheme();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() === '') return;

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newTodo }),
      });

      if (response.ok) {
        const newTodoItem = await response.json();
        setTodos([...todos, newTodoItem]);
        setNewTodo('');
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id: number) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      if (response.ok) {
        setTodos(todos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
      }
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTodos(todos.filter(todo => todo.id !== id));
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const incompleteTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography align="center">読み込み中...</Typography>
      </Container>
    );
  }

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
        <Typography
          variant="h4"
          component="h1"
          align="center"
          gutterBottom
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 'bold',
          }}
        >
          Todoリスト
        </Typography>

        <Box
          component="form"
          onSubmit={addTodo}
          sx={{
            display: 'flex',
            gap: 1,
            mb: 4,
          }}
        >
          <TextField
            fullWidth
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="新しいタスクを入力..."
            variant="outlined"
            size="small"
          />
          <Button
            type="submit"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              px: 3,
              whiteSpace: 'nowrap',
            }}
          >
            追加
          </Button>
        </Box>

        <Box sx={{ spaceY: 4 }}>
          {/* 未完了のタスク */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: theme.palette.primary.main,
                fontWeight: 'medium',
              }}
            >
              未完了のタスク
            </Typography>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={incompleteTodos.map(todo => todo.id)}
                strategy={verticalListSortingStrategy}
              >
                <List>
                  {incompleteTodos.map(todo => (
                    <SortableTodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
                    />
                  ))}
                </List>
              </SortableContext>
            </DndContext>
            {incompleteTodos.length === 0 && (
              <Typography
                align="center"
                color="text.secondary"
                sx={{ py: 2 }}
              >
                未完了のタスクはありません
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* 完了済みのタスク */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: theme.palette.primary.main,
                fontWeight: 'medium',
              }}
            >
              完了済みのタスク
            </Typography>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={completedTodos.map(todo => todo.id)}
                strategy={verticalListSortingStrategy}
              >
                <List>
                  {completedTodos.map(todo => (
                    <SortableTodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
                    />
                  ))}
                </List>
              </SortableContext>
            </DndContext>
            {completedTodos.length === 0 && (
              <Typography
                align="center"
                color="text.secondary"
                sx={{ py: 2 }}
              >
                完了済みのタスクはありません
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
} 