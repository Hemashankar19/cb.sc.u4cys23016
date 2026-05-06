# Stage 1

## Approach: Priority Inbox for Campus Notifications

### Problem
Students lose track of important notifications due to high volume.
The goal is to always surface the top 'n' most important unread notifications.

### Priority Logic
Notifications are ranked using two criteria:
1. **Type Weight** (higher = more important):
   - Placement → 3
   - Result → 2
   - Event → 1

2. **Recency** (newer notifications rank higher within same type)

### Algorithm
- Fetch all notifications from the API
- Assign a weight score to each based on Type
- Sort by weight descending, then by Timestamp descending
- Return top N notifications (default: 10)

### Efficiency for Continuous Incoming Notifications
To efficiently maintain the top 10 as new notifications arrive:
- Use a **Min-Heap of size N** (priority queue)
- When a new notification arrives, compare it with the minimum in the heap
- If it has higher priority, replace the minimum
- This gives O(log N) insertion time instead of re-sorting the entire list every time

### Time Complexity
- Initial sort: O(M log M) where M = total notifications
- Heap-based live updates: O(log N) per new notification

### Tech Used
- JavaScript (Node.js)
- Axios for API calls
- Custom Logging Middleware for observability
