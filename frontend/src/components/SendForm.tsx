/* 
  TO DO:
  - File upload (attachments) [WiP]
*/

import { useState, type SyntheticEvent } from "react"
import type { SendMessageProps } from "../types/SendMessageProps"
import './SendForm.css'
import send from "../assets/send-svgrepo-com.png"
import add from "../assets/add-circle-svgrepo-com.png"

export default function SendForm(props: SendMessageProps) {
    const [message, setMessage] = useState<string>("")
    const [formDisabled, setFormDisabled] = useState<boolean>(false)
    
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
            setFormDisabled(true)
            setTimeout(() => {
                setFormDisabled(false)
            }, 1000)
        }
    }

    return (
        <form onSubmit={submitHandler}>
            <input type="text" placeholder="Aa" onChange={(e) => setMessage(e.target.value)} value={message} disabled={formDisabled} />
            <button type="button" disabled={formDisabled} id="add" >
                <img src={add} alt="add" />
            </button>
            <button type="submit" disabled={formDisabled} id="send" >
                <img src={send} alt="send" />
            </button>
        </form>
    )
}