import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

export default function App() {
  const [dark, setDark] = useState(true);
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`app ${dark ? "dark" : "light"}`}>
      {sidebarOpen && (
        <Sidebar
          history={history}
          dark={dark}
          setSidebarOpen={setSidebarOpen}
        />
      )}

      <ChatWindow
        dark={dark}
        setDark={setDark}
        history={history}
        setHistory={setHistory}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
    </div>
  );
}
