import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import AllNotifications from './pages/AllNotifications';
import PriorityInbox from './pages/PriorityInbox';
import { Log } from './logger';

export default function App() {
  const [page, setPage] = useState('all');

  const navigate = (p) => {
    Log("frontend", "info", "page", `User navigated to ${p} page`);
    setPage(p);
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Campus Notifications
          </Typography>
          <Button color="inherit" onClick={() => navigate('all')}>
            All Notifications
          </Button>
          <Button color="inherit" onClick={() => navigate('priority')}>
            Priority Inbox
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}>
        {page === 'all' ? <AllNotifications /> : <PriorityInbox />}
      </Box>
    </Box>
  );
}