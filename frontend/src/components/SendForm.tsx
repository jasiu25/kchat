import { useState, type SyntheticEvent } from "react"
import type { SendMessageProps } from "../types/SendMessageProps"

export default function SendForm(props: SendMessageProps) {
    const [message, setMessage] = useState<string>("")
    
    // Send a message
    function submitHandler(e: SyntheticEvent) {
        e.preventDefault()
        if (!props.socket) return

        if (message.trim() !== "") {
            props.socket.emit("message", {
                username: props.username,
                content: message,
                type: "text"
            })
            setMessage("")
        }
    }

    return (
        <form onSubmit={submitHandler}>
            <input type="text" placeholder="Aa" onChange={(e) => setMessage(e.target.value)} value={message} />
            <button type="submit">Send</button>
        </form>
    )
}