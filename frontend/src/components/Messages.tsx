import { useEffect, useState, useRef } from "react"
import type { Message } from "../types/Message"
import type { MessageProps } from "../types/MessageProps"

export default function Messages(props: MessageProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [initialized, setInitialized] = useState<boolean>(false)
    const [buttonVisible, setButtonVisible] = useState<boolean>(false)
    const endRef = useRef<HTMLDivElement | null>(null)
    const messagesWrapper = useRef<HTMLDivElement | null>(null)

    // Retrieve new messages
    useEffect(() => {
        if (!props.socket) return

        const handleMessage = function(arg: Message) {
            setMessages(prev => [...prev, arg])
        }

        props.socket.on("message", handleMessage)

        return () => {
            props.socket.off("message", handleMessage)
        }
    }, [props.socket])

    // Scroll to the newest message on load
    useEffect(() => {
        if (!initialized && messages.length > 0) {
            endRef.current?.scrollIntoView()    
            setInitialized(true)
        }
    }, [initialized, messages])

    // When new message appears, scroll to it but only if client is on the bottom of the chat
    useEffect(() => {
        if (isAtBottom()) {
            endRef.current?.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    // When user isn't at the bottom show them a button to scroll down 
    useEffect(() => {
        const wrapper = messagesWrapper.current
        if (!wrapper) return

        const handleUserScroll = () => {
            setButtonVisible(!isAtBottom())
        }

        wrapper.addEventListener("scroll", handleUserScroll)
        
        return () => wrapper.removeEventListener("scroll", handleUserScroll)
    }, [])

    const isAtBottom = () => {
        if (!messagesWrapper.current) return false
            
        return (
            messagesWrapper.current.scrollHeight -
            messagesWrapper.current.scrollTop <=
            messagesWrapper.current.clientHeight + 100
        )
    }

    const handleScroll = function() {
        endRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <div id="messages-wrapper" ref={messagesWrapper}>
            {messages?.map((message, index) => {
                return (
                    <div id="message-group" key={index}>
                        {message.username}
                        <div id="message">
                            {message.content}
                        </div>
                    </div>
                )
            })}
            {buttonVisible && <button onClick={handleScroll}>&darr;</button>}
            <div ref={endRef}></div>
        </div>
    )
}