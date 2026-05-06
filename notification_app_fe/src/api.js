import { Log } from './logger';
import { TOKEN, BASE_URL } from './config';

export async function fetchNotifications(limit, page, notification_type) {
  await Log("frontend", "info", "api", `Fetching notifications limit=${limit} page=${page} type=${notification_type}`);
  try {
    let url = `${BASE_URL}/notifications?limit=${limit}&page=${page}`;
    if (notification_type) url += `&notification_type=${notification_type}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const data = await response.json();
    await Log("frontend", "info", "api", `Fetched ${data.notifications?.length} notifications successfully`);
    return data.notifications || [];
  } catch (error) {
    await Log("frontend", "error", "api", `Failed to fetch notifications: ${error.message}`);
    return [];
  }
}

const PRIORITY_WEIGHT = { Placement: 3, Result: 2, Event: 1 };

export function getTopNPriority(notifications, n) {
  const scored = notifications.map((notif) => ({
    ...notif,
    weight: PRIORITY_WEIGHT[notif.Type] || 0,
    timestamp: new Date(notif.Timestamp).getTime(),
  }));
  scored.sort((a, b) => b.weight !== a.weight ? b.weight - a.weight : b.timestamp - a.timestamp);
  return scored.slice(0, n);
}