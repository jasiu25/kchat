/* 
  TO DO:
  - When sending attachments will be done, update this code to display them
*/

import { useEffect, useState, useRef, useReducer } from "react"
import type { Message } from "../types/Message"
import type { MessageProps } from "../types/MessageProps"
import type { MessageAction } from "../types/MessageAction"
import type { MessageGroup } from "../types/MessageGroup"
import arrow from "../assets/arrow-down-large-svgrepo-com.png"

const messagesReducer = (state: MessageGroup[], action: MessageAction) => {
    switch (action.type) {
        case "ADD_MESSAGE":
            const lastGroup = state.at(-1)
            if (lastGroup && lastGroup.username === action.payload.username) {
                return state.map((group, index) =>
                    index === state.length - 1
                        ? {...group, messages: [...group.messages, action.payload]}
                        : group
                )
                
            } else {
                return [
                    ...state, {
                        username: action.payload.username,
                        messages: [action.payload]
                    }
                ]
            }
            
        default:
            return state
    }
}

export default function Messages(props: MessageProps) {
    const [messages, dispatch] = useReducer(messagesReducer, [])
    const [initialized, setInitialized] = useState<boolean>(false)
    const [buttonVisible, setButtonVisible] = useState<boolean>(false)
    const endRef = useRef<HTMLDivElement | null>(null)
    const messagesWrapper = useRef<HTMLDivElement | null>(null)

    // Retrieve new messages
    useEffect(() => {
        if (!props.socket) return

        const handleMessage = function(arg: Message) {
            dispatch({ type: "ADD_MESSAGE", payload: arg })
        }

        props.socket.on("message", handleMessage)

        return () => {
            props.socket.off("message", handleMessage)
        }
    }, [props.socket])

    // Scroll to the newest message on load
    useEffect(() => {
        setTimeout(() => {
            if (!initialized && messages.length > 0) {
                endRef.current?.scrollIntoView()    
                setInitialized(true)
            }
        }, 10)
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

    useEffect(() => {
        setButtonVisible(!isAtBottom)
    }, [messages])

    const isAtBottom = () => {
        if (!messagesWrapper.current) return false
            
        return (
            messagesWrapper.current.scrollHeight -
            messagesWrapper.current.scrollTop <=
            messagesWrapper.current.clientHeight + 100
        )
    }

    // Scroll smoothly to the bottom of the page
    const handleScroll = function() {
        endRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <div id="messages-wrapper" ref={messagesWrapper}>
            {messages?.map((messageGroup, index) => {
                return (
                    <div id="message-group" key={index}>
                        {messageGroup.username}
                        {messageGroup.messages.map((message, idx) => {
                            return (
                                <div id="message" key={idx}>
                                    {message.content}
                                </div>
                            )
                        })}
                    </div>
                )
            })}

            {buttonVisible && <button onClick={handleScroll} id="down">
                <img src={arrow} alt="&darr;" />    
            </button>}
            <div ref={endRef}></div>
        </div>
    )
}