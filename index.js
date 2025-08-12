const WebSocket = require('ws');

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });

console.log(`WebSocket server started on ws://localhost:${PORT}`);

// Структура: { roomName: { players: Map(client -> {name, x, y}) } }
const rooms = new Map();

wss.on('connection', (ws) => {
  ws.isAlive = true;
  ws.playerInfo = { roomName: null, name: null };

  ws.on('pong', () => { ws.isAlive = true; });

  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg);
      const { type, payload } = data;

      // Присоединение к комнате
      if (type === 'join') {
        const { roomName, name } = payload;
        if (!roomName || !name) return;

        // Если игрок был в другой комнате — удалить его оттуда
        leaveRoom(ws);

        if (!rooms.has(roomName)) {
          rooms.set(roomName, { players: new Map() });
          console.log(`Room "${roomName}" created`);
        }

        const room = rooms.get(roomName);
        ws.playerInfo.roomName = roomName;
        ws.playerInfo.name = name;

        room.players.set(ws, { name, x: 0, y: 0 });
        console.log(`Player "${name}" joined "${roomName}"`);

        broadcastRoom(roomName);
      }

      // Перемещение
      if (type === 'move') {
        const { x, y } = payload;
        const { roomName } = ws.playerInfo;
        if (!roomName || !rooms.has(roomName)) return;

        const room = rooms.get(roomName);
        const player = room.players.get(ws);
        if (!player) return;

        player.x = x;
        player.y = y;

        broadcastRoom(roomName);
      }

      // Выход из комнаты по сообщению
      if (type === 'leave') {
        leaveRoom(ws);
      }

      // Запрос списка комнат
      if (type === 'get_rooms') {
  const dataObj = {};
  for (const [roomName, room] of rooms.entries()) {
    dataObj[roomName] = `${room.players.size} plays`;
  }

  const message = JSON.stringify({
    c2dictionary: true,
    data: dataObj
  });

  ws.send(message);
}

    } catch (err) {
      console.error('Invalid message:', msg);
    }
  });

  ws.on('close', () => {
    leaveRoom(ws);
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
});

// Функция удаления игрока из комнаты
function leaveRoom(ws) {
  const { roomName, name } = ws.playerInfo;
  if (roomName && rooms.has(roomName)) {
    const room = rooms.get(roomName);
    room.players.delete(ws);
    console.log(`Player "${name}" left "${roomName}"`);

    ws.playerInfo.roomName = null;

    if (room.players.size === 0) {
      rooms.delete(roomName);
      console.log(`Room "${roomName}" deleted`);
    } else {
      broadcastRoom(roomName);
    }
  }
}

// Функция рассылки данных в формате Construct 2 c2dictionary
function broadcastRoom(roomName) {
  const room = rooms.get(roomName);
  if (!room) return;

  const dataObj = {};
  for (const player of room.players.values()) {
    dataObj[player.name] = `${player.x},${player.y}`;
  }

  const message = JSON.stringify({
    c2dictionary: true,
    data: dataObj
  });

  for (const client of room.players.keys()) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

// Пинг-понг
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);