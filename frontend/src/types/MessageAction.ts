import type { Message } from "./Message"

export type MessageAction = {
    type: "ADD_MESSAGE",
    payload: Message
}