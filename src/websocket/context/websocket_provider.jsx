import React, { createContext, useContext, useEffect, useState } from "react";
import { WebSocketManager } from "./websocket_manager";

const WebSocketContext = createContext(null)

export const WebSocketProvider = ({ children }) => {
    const [wsManager, setWsManager] = useState(null)

    // useEffect(() => {
    //     const wsManager = new WebSocketManager('ws://localhost:8080/ws')
    //     setManager(wsManager)
    //     wsManager.connect()
        
    //     // return wsManager.disconnect()
    // }, [])

    return (
        <WebSocketContext.Provider value={{ wsManager, setWsManager }}>
            {children}
        </WebSocketContext.Provider>
    )
}

export const useWebSocketManager = () => useContext(WebSocketContext)