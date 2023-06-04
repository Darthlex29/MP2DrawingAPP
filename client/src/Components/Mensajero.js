import "../Styles/App.css"
import io from "socket.io-client";
import React, { useEffect, useState } from "react";

const socket = io("http://localhost:4000");

function Mensajero() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([{
    body: "message text",
    from: "user1: "
  }]);


  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", message);
    const newMesagge = {
        body: message,
        from: "Me: "
    }
    setMessages([newMesagge, ...messages])
    setMessage('')
  };

  useEffect(() => {
    const receiveMessage = message => {
        setMessages([...messages, message])
      console.log(message)
    }
    socket.on("message", receiveMessage)

    return () => {
      socket.off("message", receiveMessage);
    };
  }, [messages]);

  return (
    <div className="Mensajes">
      <h1>Hello world</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={(e) => setMessage(e.target.value)} value={message}/>
        <button>Send</button>
      </form>

      {messages.map((message, index) =>(
        <div key={index}>
            <p>{message.from}{message.body}</p>
        </div>
      ))}
    </div>
  );
}

export default Mensajero