import { useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { logout } from '../store/slices/auth/authSlice';

import { fetchRequests } from '../store/slices/requests/requestsSlice';

import RequestForm from '../components/RequestForm';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const {
    items,
    loading,
    error,
  } = useSelector((state) => state.requests);

  useEffect(() => {
    dispatch(fetchRequests());
  }, [dispatch]);


  const handleLogout = async () => {
    await dispatch(logout());

    navigate('/login', { replace: true });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          borderBottom: '1px solid #ddd',
          padding: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: 1100,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5">
            Requests
          </Typography>

          <Button
            variant="outlined"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: 3,
        }}
      >
        <Card sx={{ marginBottom: 3 }}>
          <CardContent>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
            >
              <Typography>
                <strong>User:</strong> {user.username}
              </Typography>

              <Chip
                label={user.role}
                color={
                  user.role === 'admin'
                    ? 'primary'
                    : 'default'
                }
              />
            </Stack>
          </CardContent>
        </Card>

        {user.role === 'admin' && (
          <Card sx={{ marginBottom: 3 }}>
            <CardContent>
              <RequestForm />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent>
            <Typography
              variant="h5"
              sx={{ marginBottom: 2 }}
            >
              Requests
            </Typography>

            {loading && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: 4,
                }}
              >
                <CircularProgress />
              </Box>
            )}

            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}

            {!loading && !error && items.length === 0 && (
              <Typography color="text.secondary">
                No requests yet.
              </Typography>
            )}

            {!loading &&
              !error &&
              items.map((request) => (
                <Box key={request.id}>
                  <Box sx={{ padding: 2 }}>
                    <Typography variant="h6">
                      {request.title}
                    </Typography>

                    <Typography
                      color="text.secondary"
                      sx={{ marginTop: 1 }}
                    >
                      {request.description}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ marginTop: 1 }}
                    >
                      Execution date:{' '}
                      {request.execution_date}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Created by: {request.created_by}
                    </Typography>
                  </Box>

                  <Divider />
                </Box>
              ))}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardPage;