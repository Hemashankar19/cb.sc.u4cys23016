import { TOKEN } from './config';

export async function Log(stack, level, pkg, message) {
  try {
    const response = await fetch("http://20.207.122.201/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });
    return await response.json();
  } catch (error) {
    return null;
  }
}