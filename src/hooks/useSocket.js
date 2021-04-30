import { useMemo, useEffect, useState } from 'react';
import io from 'socket.io-client';

export const useSocket = (serverPath) => {
  // it will only re execute when the serverPath changes for not login many times
  const socket = useMemo(() => io.connect(serverPath, { 
      transports: ['websocket']
    }), [serverPath]);

  const [online, setOnline] = useState(false);

  useEffect(() => {
    setOnline(socket.connected); // sabemos cuando nos conectamos
  }, [socket])

  useEffect(() => {
    socket.on('connect', () => { // cuando se recupera la conexion
      setOnline(true);
    })
    // return socket.disconnect(); clean up
  }, [socket])

  useEffect(() => {
    socket.on('disconnect', () => { // cuando se pierde la conexion
      setOnline(false);
    })
  }, [socket])

  return {
    socket,
    online
  }
}