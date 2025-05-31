export function createWebSocket(
  confing = { open() {}, message() {}, close() {}, error() {} }
) {
  if (typeof window !== 'object') return;

  if (typeof confing !== 'object') throw new Error('invalid confing');

  const { url, open, message, close, error } = confing;

  if (
    typeof url !== 'string' ||
    url === '' ||
    (url.includes('ws://') === false && url.includes('wss://') === false)
  ) {
    throw new Error('invalid url');
  }

  const socket = new WebSocket(url);

  socket._send = socket.send;
  socket.send = function (event, data) {
    const payload = { event, data };
    console.log(payload);
    this._send(JSON.stringify(payload));
  };

  if (typeof open === 'function') {
    socket.addEventListener('open', open);
  }
  if (typeof message === 'function') {
    socket.addEventListener('message', message);
  }
  if (typeof close === 'function') {
    socket.addEventListener('close', close);
  }
  if (typeof error === 'function') {
    socket.addEventListener('error', error);
  }

  return socket;
}
