const axios = require("axios");
const { Log } = require("../logging_middleware/logger");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJjYi5zYy51NGN5czIzMDE2QGNiLnN0dWRlbnRzLmFtcml0YS5lZHUiLCJleHAiOjE3NzgwNTkzMTcsImlhdCI6MTc3ODA1ODQxNywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjE5OWNkMzM4LTI1MmUtNDAxMy1hMTE3LTFiZTMwZWU2M2I0NiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImhlbWEgbSIsInN1YiI6Ijg5M2JiY2IxLWYzODAtNDdkYS1hY2YwLTIyN2RlYWUzOTkzZSJ9LCJlbWFpbCI6ImNiLnNjLnU0Y3lzMjMwMTZAY2Iuc3R1ZGVudHMuYW1yaXRhLmVkdSIsIm5hbWUiOiJoZW1hIG0iLCJyb2xsTm8iOiJjYi5zYy51NGN5czIzMDE2IiwiYWNjZXNzQ29kZSI6IlBUQk1tUSIsImNsaWVudElEIjoiODkzYmJjYjEtZjM4MC00N2RhLWFjZjAtMjI3ZGVhZTM5OTNlIiwiY2xpZW50U2VjcmV0IjoiU0Z1c1dBZkNlZ3VobXFEQyJ9.f5CjUTmm9i2MUDNVlwq49Gcv8qmYrCOq7Xf7nmsoQxg";


const PRIORITY_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

async function fetchNotifications() {
  await Log("backend", "info", "service", "Fetching notifications from API");
  try {
    const response = await axios.get(
      "http://20.207.122.201/evaluation-service/notifications",
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );
    await Log("backend", "info", "service", `Fetched ${response.data.notifications.length} notifications successfully`);
    return response.data.notifications;
  } catch (error) {
    await Log("backend", "error", "service", `Failed to fetch notifications: ${error.message}`);
    return [];
  }
}

function getTopNPriorityNotifications(notifications, n = 10) {
  Log("backend", "info", "domain", `Computing top ${n} priority notifications from ${notifications.length} total`);

  const scored = notifications.map((notif) => {
    const weight = PRIORITY_WEIGHT[notif.Type] || 0;
    const timestamp = new Date(notif.Timestamp).getTime();
    return { ...notif, weight, timestamp };
  });

  scored.sort((a, b) => {
    if (b.weight !== a.weight) return b.weight - a.weight;
    return b.timestamp - a.timestamp;
  });

  const topN = scored.slice(0, n);
  Log("backend", "info", "domain", `Top ${n} notifications computed successfully`);
  return topN;
}

// Main function
async function main() {
  await Log("backend", "info", "service", "Priority Inbox service started");

  const notifications = await fetchNotifications();

  if (notifications.length === 0) {
    await Log("backend", "warn", "service", "No notifications received from API");
    console.log("No notifications found.");
    return;
  }

  const top10 = getTopNPriorityNotifications(notifications, 10);

  console.log("\n===== TOP 10 PRIORITY NOTIFICATIONS =====\n");
  top10.forEach((notif, index) => {
    console.log(`${index + 1}. [${notif.Type}] ${notif.Message}`);
    console.log(`   Time: ${notif.Timestamp}`);
    console.log(`   ID: ${notif.ID}`);
    console.log("");
  });

  await Log("backend", "info", "service", "Priority Inbox service completed successfully");
}

main();