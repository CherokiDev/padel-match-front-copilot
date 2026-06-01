import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import moment from "moment";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import ChatModal from "./ChatModal";
import { connectSocket } from "../services/socket";

const ChatList = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatPeer, setChatPeer] = useState(null);
  const [chatSchedule, setChatSchedule] = useState(null);

  const fetchConversations = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/messages/conversations`,
        { headers: { Authorization: token } }
      );
      setConversations(data.data);
    } catch (e) {
      console.error("Error fetching conversations", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    const socket = connectSocket();
    socket.on("message:new", fetchConversations);
    return () => socket.disconnect();
  }, [fetchConversations]);

  const openChat = (conversation) => {
    setChatPeer(conversation.peer);
    setChatSchedule(conversation.schedule);
    setChatOpen(true);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    fetchConversations();
  };

  if (loading) return <div className="container-main-logged"><p>Cargando chats...</p></div>;

  return (
    <>
      <div className="container-main-logged">
        <div className="title-h3">Chats</div>
        <hr className="hr-separator" />
        {conversations.length === 0 ? (
          <div style={{ textAlign: "center", color: "#ccc", marginTop: "3rem" }}>
            <ForumOutlinedIcon style={{ fontSize: 64, marginBottom: "0.75rem" }} />
            <p style={{ color: "gray" }}>No tienes conversaciones activas</p>
          </div>
        ) : (
          conversations.map((conv, i) => (
            <div
              key={i}
              className="card card-clickable"
              onClick={() => openChat(conv)}
              style={{ position: "relative" }}
            >
              {conv.unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    background: "#e53935",
                    color: "#fff",
                    borderRadius: "50%",
                    width: "22px",
                    height: "22px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                  }}
                >
                  {conv.unreadCount}
                </span>
              )}
              <div className="title-h5" style={{ fontWeight: "bold" }}>
                Pista {conv.schedule.courtNumber} —{" "}
                {moment(conv.schedule.dateOfReservation).format("DD/MM/YYYY, HH:mm")}
              </div>
              <div className="title-h5">Con: {conv.peer.name} ({conv.peer.username})</div>
              <div
                className="title-h6"
                style={{
                  color: conv.unreadCount > 0 ? "#000" : "gray",
                  fontWeight: conv.unreadCount > 0 ? "bold" : "normal",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {conv.lastMessage.senderId !== conv.peer.id ? "Tú: " : ""}
                {conv.lastMessage.content}
              </div>
            </div>
          ))
        )}
      </div>
      <ChatModal
        open={chatOpen}
        onClose={handleCloseChat}
        peer={chatPeer || {}}
        scheduleId={chatSchedule?.id || null}
        scheduleInfo={chatSchedule}
      />
    </>
  );
};

export default ChatList;
