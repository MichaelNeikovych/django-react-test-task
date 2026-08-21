import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { createRequest } from '../store/slices/requests/requestsSlice';

const today = new Date().toISOString().split('T')[0];

const schema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be at most 100 characters'),

  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),

  execution_date: yup
    .string()
    .required('Execution date is required')
    .test(
      'not-past',
      'Execution date cannot be in the past',
      (value) => value >= today
    ),
});

const RequestForm = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const creating = useSelector((state) => state.requests.creating);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      execution_date: today,
    },
  });


  const onSubmit = async (data) => {
  const result = await dispatch(createRequest(data));

  if (createRequest.fulfilled.match(result)) {
    reset({
      title: '',
      description: '',
      execution_date: today,
    });

    enqueueSnackbar('Request created successfully', { variant: 'success' });

    return;
  }

  if (createRequest.rejected.match(result)) {
    enqueueSnackbar(result.payload || 'Failed to create request', { variant: 'error' });
  }
};

  return (
    <Box>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Create request
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <TextField
          {...register('title')}
          label="Title"
          fullWidth
          margin="normal"
          error={Boolean(errors.title)}
          helperText={errors.title?.message}
          disabled={creating}
        />

        <TextField
          {...register('description')}
          label="Description"
          fullWidth
          multiline
          minRows={4}
          margin="normal"
          error={Boolean(errors.description)}
          helperText={errors.description?.message}
          disabled={creating}
        />

        <TextField
          {...register('execution_date')}
          label="Execution date"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: today,
          }}
          error={Boolean(errors.execution_date)}
          helperText={errors.execution_date?.message}
          disabled={creating}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={creating}
          sx={{ marginTop: 2 }}
        >
          {creating ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Create request'
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default RequestForm;