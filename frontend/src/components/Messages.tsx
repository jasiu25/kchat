import { useEffect, useState } from "react"
import type { Message } from "../types/Message"
import type { MessageProps } from "../types/MessageProps"

export default function Messages(props: MessageProps) {
    const [messages, setMessages] = useState<Message[]>([])

    // Retrieve new messages
    useEffect(() => {
        if (!props.socket) return

        props.socket.on("message", (arg) => {
            setMessages(prev => [...prev, arg])
        })

        return () => {
            props.socket.off("message")
        }
    }, [props.socket])


    return (
        <div id="messages-wrapper">
            {messages?.map((message, index) => {
                return <div id="message" key={index}>
                {message.username}: {message.content}
                </div>
            })}
        </div>
    )
}