/* 
  TO DO:
  - File upload (attachments) [WiP]
*/

import { useRef, useState, type SyntheticEvent } from "react"
import type { SendMessageProps } from "../types/SendMessageProps"
import './SendForm.css'
import send from "../assets/send-svgrepo-com.png"
import add from "../assets/add-circle-svgrepo-com.png"

export default function SendForm(props: SendMessageProps) {
    const [message, setMessage] = useState<string>("")
    const [formDisabled, setFormDisabled] = useState<boolean>(false)
    const [attachments, setAttachments] = useState<File[] | null>(null)
    const attachmentRef = useRef<HTMLInputElement | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)
    
    // Send a message
    function submitHandler(e: SyntheticEvent) {
        e.preventDefault()
        if (!props.socket) return
        if (message.trim() === "") return

        if (!attachments) {
            props.socket.emit("message", {
                username: props.username,
                content: message,
                type: "text"
            })
        } else {
            props.socket.emit("message", {
                username: props.username,
                content: attachments[0],
                type: "image"
            })
        }
        

        setMessage("")
        setFormDisabled(true)
        setTimeout(() => {
            setFormDisabled(false)
            inputRef.current?.focus()
        }, 1000)
    }

    const handleAttachmentClick = () => {
        attachmentRef.current?.click()
    }

    const handleAttachmentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = event.target.files
            setAttachments([...files])
        }
    }

    return (
        <form onSubmit={submitHandler}>
            <input type="text" placeholder="Aa" onChange={(e) => setMessage(e.target.value)} value={message} disabled={formDisabled} ref={inputRef} autoFocus />
            <input type="file" accept="image/*" id="addInput" onChange={handleAttachmentUpload} ref={attachmentRef} multiple></input>
            <button id="add">
                <img src={add} alt="Attach" onClick={handleAttachmentClick} />
            </button>
            <button type="submit" disabled={formDisabled} id="send" >
                <img src={send} alt="Send" />
            </button>
        </form>
    )
}