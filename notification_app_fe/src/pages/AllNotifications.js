import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Chip,
  CircularProgress, Select, MenuItem, FormControl,
  InputLabel, Pagination
} from '@mui/material';
import { fetchNotifications } from '../api';
import { Log } from '../logger';

const TYPE_COLORS = {
  Placement: 'success',
  Result: 'warning',
  Event: 'info',
};

export default function AllNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');
  const [viewed, setViewed] = useState({});

  useEffect(() => {
    loadNotifications();
  }, [page, typeFilter]);

  async function loadNotifications() {
    setLoading(true);
    await Log("frontend", "info", "page", `Loading all notifications page=${page} filter=${typeFilter}`);
    const data = await fetchNotifications(10, page, typeFilter);
    setNotifications(data);
    setLoading(false);
  }

  function markViewed(id) {
    setViewed((prev) => ({ ...prev, [id]: true }));
    Log("frontend", "info", "component", `Notification ${id} marked as viewed`);
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>All Notifications</Typography>

      <FormControl sx={{ mb: 2, minWidth: 200 }}>
        <InputLabel>Filter by Type</InputLabel>
        <Select
          value={typeFilter}
          label="Filter by Type"
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Placement">Placement</MenuItem>
          <MenuItem value="Result">Result</MenuItem>
          <MenuItem value="Event">Event</MenuItem>
        </Select>
      </FormControl>

      {loading ? (
        <CircularProgress />
      ) : notifications.length === 0 ? (
        <Typography>No notifications found.</Typography>
      ) : (
        notifications.map((notif) => (
          <Card
            key={notif.ID}
            sx={{
              mb: 2,
              cursor: 'pointer',
              backgroundColor: viewed[notif.ID] ? '#f5f5f5' : '#fff',
              border: viewed[notif.ID] ? '1px solid #ccc' : '1px solid #1976d2',
            }}
            onClick={() => markViewed(notif.ID)}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{notif.Message}</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip label={notif.Type} color={TYPE_COLORS[notif.Type]} size="small" />
                  {!viewed[notif.ID] && <Chip label="New" color="error" size="small" />}
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">{notif.Timestamp}</Typography>
            </CardContent>
          </Card>
        ))
      )}

      <Pagination
        count={10}
        page={page}
        onChange={(e, val) => setPage(val)}
        sx={{ mt: 2 }}
      />
    </Box>
  );
}