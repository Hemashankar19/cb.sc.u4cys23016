const axios = require("axios");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJjYi5zYy51NGN5czIzMDE2QGNiLnN0dWRlbnRzLmFtcml0YS5lZHUiLCJleHAiOjE3NzgwNTc3NzIsImlhdCI6MTc3ODA1Njg3MiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjU5YTJhOTQ5LTIwZmUtNDA4YS1hOWJlLWY0Y2RjYmNlYTI2ZiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImhlbWEgbSIsInN1YiI6Ijg5M2JiY2IxLWYzODAtNDdkYS1hY2YwLTIyN2RlYWUzOTkzZSJ9LCJlbWFpbCI6ImNiLnNjLnU0Y3lzMjMwMTZAY2Iuc3R1ZGVudHMuYW1yaXRhLmVkdSIsIm5hbWUiOiJoZW1hIG0iLCJyb2xsTm8iOiJjYi5zYy51NGN5czIzMDE2IiwiYWNjZXNzQ29kZSI6IlBUQk1tUSIsImNsaWVudElEIjoiODkzYmJjYjEtZjM4MC00N2RhLWFjZjAtMjI3ZGVhZTM5OTNlIiwiY2xpZW50U2VjcmV0IjoiU0Z1c1dBZkNlZ3VobXFEQyJ9.yTNoqqCiwKlmiIwslEf9EPeuk9o9G7RJkgO-CCLJeMc";

async function Log(stack, level, pkg, message) {
  try {
    const response = await axios.post(
      "http://20.207.122.201/evaluation-service/logs",
      {
        stack: stack,
        level: level,
        package: pkg,
        message: message,
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    // Silent fail - don't break app if logging fails
    return null;
  }
}

module.exports = { Log };