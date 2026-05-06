import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Chip,
  CircularProgress, Select, MenuItem, FormControl,
  InputLabel, Slider
} from '@mui/material';
import { fetchNotifications, getTopNPriority } from '../api';
import { Log } from '../logger';

const TYPE_COLORS = {
  Placement: 'success',
  Result: 'warning',
  Event: 'info',
};

export default function PriorityInbox() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topN, setTopN] = useState(10);
  const [typeFilter, setTypeFilter] = useState('');
  const [viewed, setViewed] = useState({});

  useEffect(() => {
    loadNotifications();
  }, [typeFilter]);

  async function loadNotifications() {
    setLoading(true);
    await Log("frontend", "info", "page", `Loading priority inbox topN=${topN} filter=${typeFilter}`);
    const data = await fetchNotifications(100, 1, typeFilter);
    setNotifications(data);
    setLoading(false);
  }

  function markViewed(id) {
    setViewed((prev) => ({ ...prev, [id]: true }));
    Log("frontend", "info", "component", `Priority notification ${id} marked as viewed`);
  }

  const prioritized = getTopNPriority(notifications, topN);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Priority Inbox</Typography>

      <Box sx={{ mb: 2, display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Type</InputLabel>
          <Select
            value={typeFilter}
            label="Filter by Type"
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ minWidth: 250 }}>
          <Typography gutterBottom>Show Top N: {topN}</Typography>
          <Slider
            value={topN}
            min={5}
            max={20}
            step={5}
            marks
            onChange={(e, val) => setTopN(val)}
          />
        </Box>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : prioritized.length === 0 ? (
        <Typography>No notifications found.</Typography>
      ) : (
        prioritized.map((notif, index) => (
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
                <Typography variant="h6">#{index + 1} {notif.Message}</Typography>
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
    </Box>
  );
}