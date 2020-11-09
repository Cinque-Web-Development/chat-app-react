import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import TextField from "@material-ui/core/TextField";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import "./App.css";

const socket = io.connect("http://localhost:4000");

function App() {
  const [data, setData] = useState({ message: "", name: "" });
  const [chat, setChat] = useState([]);
  const [emoji, setEmoji] = useState();
  const emojiPicker = useRef(null);
  const [emojiShow, setEmojiShow] = useState(false);

  useEffect(() => {
    socket.on("message", ({ name, message }) => {
      setChat([...chat, { name, message }]);
      console.log(chat)
    });
  });

  const onTextChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onMessageSubmit = (e) => {
    e.preventDefault();
    const { name, message } = data;
    socket.emit("message", { name, message });
    setData({ message: "", name });
    closeMenu(e);
  };

  const renderChat = () => {
    return chat.map(({ name, message }, index) => (
      <div key={index}>
        <h3>
          {name}: <span>{message}</span>
        </h3>
      </div>
    ));
  };

  const addEmoji = (e) => {
    let emoji = e.native;
    setData({ message: data.message + emoji, name: data.name });
  };

  const showEmojis = (e) => {
    setEmojiShow(true);
  };

  const closeMenu = (e) => {
    setEmojiShow(false);
  };

  return (
    <div id="App" className="card">
      <form onSubmit={onMessageSubmit}>
        <h1>&lt; Cinque Chat /&gt;</h1>
        <div className="name-field">
          <TextField
            className="name-input"
            name="name"
            onChange={(e) => onTextChange(e)}
            value={data.name}
            label="Name"
          />
        </div>
        <div className="render-chat">{renderChat()}</div>
        <div className="message-input">
          <TextField
            className="text-input"
            name="message"
            onChange={(e) => onTextChange(e)}
            value={data.message}
            id="outlined-multiline-static"
            variant="outlined"
            label="Message"
          />
          <button className="stlt-btn stlt-std-btn">&gt;&gt;</button>
          {emojiShow ? (
            <span ref={emojiPicker}>
              <Picker onSelect={addEmoji} value={emoji} />
            </span>
          ) : (
            <p onClick={showEmojis}>Emoji</p>
          )}
        </div>
      </form>
    </div>
  );
}

export default App;
