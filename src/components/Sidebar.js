export default function Sidebar({ history, dark, setSidebarOpen }) {
  return (
    <div className={`sidebar ${dark ? "sidebar-dark" : "sidebar-light"}`}>
      <div className="sidebar-header">
        <h2>Prakruti Chatbot</h2>
        <button className="close-btn" onClick={() => setSidebarOpen(false)}>☰</button>
      </div>
    </div>
  );
}
