import { Helmet } from 'react-helmet-async';
import { useWebSocketManager } from '../websocket/context/websocket_provider';
import { useEffect } from 'react';
import { WebSocketManager } from '../websocket/context/websocket_manager';

// ----------------------------------------------------------------------

export default function DashboardPage() {
  const { wsManager, setWsManager } = useWebSocketManager()

  useEffect(() => {
    if (wsManager != null) {
      return
    }

    const ws = new WebSocketManager('ws://localhost:8080/ws')
    
    // register global websocket connection
    setWsManager(ws)
    ws.connect()
  }, [])

  return (
    <>
      <Helmet>
        <title> Dashboard</title>
      </Helmet>

      <div>this is dashboard 1</div>
    </>
  );
}
