import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Mic, MicOff } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { sendToAi } from "../../../services/user";
export default function DraggableAIChatbot({
  restaurantId,
}: {
  restaurantId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Bubble position
  const [bubblePos, setBubblePos] = useState({
    x: window.innerWidth - 100,
    y: window.innerHeight - 100,
  });

  // Chat position (TOP-LEFT, no transform)
  const [chatPos, setChatPos] = useState({
    x: window.innerWidth / 2 - 190,
    y: window.innerHeight / 2 - 250,
  });

  const [dragType, setDragType] = useState<"bubble" | "chat" | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hello! I'm your AI assistant. How can I help you today?",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  /* -------------------- SPEECH -------------------- */
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (e: any) => {
        setInputText(e.results[0][0].transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = recognitionRef.current.onend = () =>
        setIsListening(false);
    }
  }, []);

  /* -------------------- AUTOSCROLL -------------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  /* -------------------- DRAG HANDLING -------------------- */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragType) return;

      setHasMoved(true);

      if (dragType === "bubble") {
        setBubblePos({
          x: Math.max(
            0,
            Math.min(e.clientX - dragOffset.x, window.innerWidth - 64)
          ),
          y: Math.max(
            0,
            Math.min(e.clientY - dragOffset.y, window.innerHeight - 64)
          ),
        });
      }

      if (dragType === "chat") {
        setChatPos({
          x: Math.max(
            0,
            Math.min(e.clientX - dragOffset.x, window.innerWidth - 380)
          ),
          y: Math.max(
            0,
            Math.min(e.clientY - dragOffset.y, window.innerHeight - 500)
          ),
        });
      }
    };

    const onUp = () => setDragType(null);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragType, dragOffset]);

  /* -------------------- CHAT -------------------- */
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    setMessages((p) => [...p, { role: "user", text: inputText }]);
    setInputText("");
    setIsLoading(true);

    try {
      const res = await sendToAi(inputText,restaurantId);
      setMessages((p) => [...p, { role: "ai", text: res.reply }]);
    } catch {
      setMessages((p) => [...p, { role: "ai", text: "Error 😕" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return;
    isListening
      ? recognitionRef.current.stop()
      : recognitionRef.current.start();
    setIsListening(!isListening);
  };

  return (
    <>
      {/* AI BUBBLE */}
      {!isOpen && (
        <div
          className="fixed w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg cursor-move hover:shadow-xl transition-shadow flex items-center justify-center"
          style={{ left: bubblePos.x, top: bubblePos.y }}
          onMouseDown={(e) => {
            e.preventDefault();
            setHasMoved(false);
            setDragType("bubble");
            setDragOffset({
              x: e.clientX - bubblePos.x,
              y: e.clientY - bubblePos.y,
            });
          }}
          onClick={() => !hasMoved && setIsOpen(true)}
        >
          <MessageCircle className="w-8 h-8 text-white" />
        </div>
      )}

      {/* CHAT WINDOW */}
      {isOpen && (
        <div
          className="fixed bg-white rounded-2xl shadow-2xl flex flex-col"
          style={{ left: chatPos.x, top: chatPos.y, width: 380, height: 500 }}
        >
          {/* HEADER */}
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-t-2xl flex items-center justify-between cursor-move"
            onMouseDown={(e) => {
              e.preventDefault();
              setDragType("chat");
              setDragOffset({
                x: e.clientX - chatPos.x,
                y: e.clientY - chatPos.y,
              });
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold">AI Assistant</h3>
                <p className="text-blue-100 text-xs">Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden  p-4 space-y-4 bg-gray-50 scrollbar-hide">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    m.role === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 shadow rounded-bl-none"
                  }`}
                >
                  <ReactMarkdown>{m.text}</ReactMarkdown>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className="p-4 border-t bg-white rounded-b-2xl">
            <div className="flex items-center gap-2">
              <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 px-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message..."
              />
              <button
                onClick={toggleVoiceInput}
                className={`p-2 rounded-full ${
                  isListening ? "bg-red-500 text-white" : "bg-gray-200"
                }`}
              >
                {isListening ? <MicOff /> : <Mic />}
              </button>
              <button
                onClick={handleSendMessage}
                className="p-2 bg-blue-500 text-white rounded-full"
              >
                <Send />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
