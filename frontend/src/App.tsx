import { useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"
import Messages from "./components/Messages"
import SendForm from "./components/SendForm"
import './App.css'

function App() {
  const [socket, setSocket]= useState<Socket | null>(null)
  const [username, setUsername] = useState<string>("")
  
  // Establish a connection with server
  useEffect(() => {
    const s = io("http://localhost:3000")
    setSocket(s)
    return () => {
      s.disconnect()
    }
  }, [])

  // Retrieve a username
  useEffect(() => {
    if (!localStorage.getItem("username")) {
      const randomNum = Math.floor(Math.random() * 8999) + 1000 // Random number between 1000 and 9999
      const username = `User${randomNum}`
      localStorage.setItem("username", username)
    }

    setUsername(String(localStorage.getItem("username")))
  }, [])

  return (
    <div id="wrapper">
      <main>
        {socket && <Messages socket={socket} />}<br />
        {socket && <SendForm socket={socket} username={username} />}
      </main>
    </div>
  )
}

export default App
