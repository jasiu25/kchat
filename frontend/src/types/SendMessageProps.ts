import type { Socket } from "socket.io-client"

export type SendMessageProps = {
    socket: Socket,
    username: string
}