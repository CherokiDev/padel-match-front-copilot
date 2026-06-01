import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import moment from "moment";
import { connectSocket } from "../services/socket";
import "./ChatModal.css";

const ChatModal = ({ open, onClose, peer, scheduleId, scheduleInfo }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const markRead = () => {
    socketRef.current?.emit("message:markRead", { fromUserId: peer.id });
    window.dispatchEvent(new CustomEvent("messages:read"));
  };

  useEffect(() => {
    if (!open) return;
    socketRef.current = connectSocket();
    socketRef.current.on("message:new", (msg) => {
      if (msg.senderId === peer.id || msg.receiverId === peer.id) {
        setMessages((m) => [...m, msg]);
        if (msg.senderId === peer.id) markRead();
      }
    });
    return () => socketRef.current?.disconnect();
  }, [open, peer.id]);

  useEffect(() => {
    if (!open) return;
    const token = localStorage.getItem("token");
    let url = `${import.meta.env.VITE_API_URL}/messages/with/${peer.id}`;
    if (scheduleId) url += `?scheduleId=${scheduleId}`;
    axios
      .get(url, { headers: { Authorization: token } })
      .then(({ data }) => {
        setMessages(data.data);
        markRead();
      });
  }, [open, peer.id, scheduleId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const clean = text.trim();
    if (!clean) return;
    socketRef.current?.emit("message:send", {
      toUserId: peer.id,
      content: clean,
      scheduleId: scheduleId || null,
    });
    socketRef.current?.emit("message:markRead", { fromUserId: peer.id });
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  if (!open) return null;

  return (
    <div className="chat-overlay">
      <div className="chat-modal">
        <div className="chat-header">
          <div className="chat-header-info">
            <span className="chat-header-name">Chat con {peer.username}</span>
            {scheduleInfo && (
              <span className="chat-header-schedule">
                Pista {scheduleInfo.courtNumber} —{" "}
                {moment(scheduleInfo.dateOfReservation).format("DD/MM/YYYY, HH:mm")}
              </span>
            )}
          </div>
          <button className="chat-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="chat-messages">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`chat-bubble ${m.senderId === peer.id ? "received" : "sent"}`}
            >
              {m.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <input
            className="chat-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje..."
          />
          <button className="chat-send-btn" onClick={send} disabled={!text.trim()}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

ChatModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  peer: PropTypes.shape({ id: PropTypes.number, username: PropTypes.string }).isRequired,
  scheduleId: PropTypes.number,
  scheduleInfo: PropTypes.shape({
    courtNumber: PropTypes.number,
    dateOfReservation: PropTypes.string,
  }),
};

export default ChatModal;
