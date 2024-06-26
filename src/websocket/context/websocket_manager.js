export class WebSocketManager {
    constructor(url) {
        this.url = url
        this.socket = null
    }

    connect() {
        if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
            this.socket = new WebSocket(this.url);
            this.socket.onopen = () => {
                const connectMsg = {
                    "Type": "connect",
                    "SenderID": "64691a68-cd4c-11ee-bd80-02be5496381c",
                    "Data": {},
                }

                this.socket.send(JSON.stringify(connectMsg))
            };
            this.socket.onclose = () => {
                console.log('WebSocket Disconnected');
            };
            this.socket.onerror = (error) => {
                console.error('WebSocket Error:', error);
            };
            this.socket.onmessage = (e) => {
                console.log('Received message: ', e.data);
            }
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close()
        }
        console.log(`disconnect ${this.url}`)
    }

    getSocket() {
        return this.socket
    }

    send(msg) {
        if (!this.socket) {
            console.log('ws is null')
            return
        }

        this.socket.send(msg)
    }

    changeOnMessage(newOnMessageFunc) {
        this.socket.onmessage = newOnMessageFunc
    }
}