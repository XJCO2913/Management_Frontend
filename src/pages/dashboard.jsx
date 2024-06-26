import { Helmet } from 'react-helmet-async';
import { OverviewAppView } from 'src/sections/overview/view';
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

    const ws = new WebSocketManager('ws://43.136.232.116:5000/ws')
    
    // register global websocket connection
    setWsManager(ws)
    ws.connect()
  }, [])

  return (
    <>
      <Helmet>
        <title> OverviewPage</title>
      </Helmet>

      <OverviewAppView />
    </>
  );
}