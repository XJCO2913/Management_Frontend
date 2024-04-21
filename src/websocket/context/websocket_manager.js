export class WebSocketManager {
    constructor(url) {
        this.url = url
        this.socket = null
    }

    connect() {
        if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
            this.socket = new WebSocket(this.url);
            this.socket.onopen = () => {
                const token = sessionStorage.getItem("accessToken")
                const adminId = sessionStorage.getItem("adminID")

                this.socket.send(`我是 ${token}, 我是${adminId}号管理员`)
                console.log('WebSocket Connected');
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