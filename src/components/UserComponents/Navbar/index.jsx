import React from "react";

export default function Navbar({ theme, onToggleTheme }) {
    return (
        <header className="navbar">
            <div className="brand">
                <span className="logo">🧿</span>
                <span className="title">Buyonida AZ</span>
            </div>
            <div className="actions">
                <button onClick={onToggleTheme} className="btn ghost">
                    {theme === "dark" ? "🌞 İşıq" : "🌙 Tünd"}
                </button>
                <a className="btn primary" href="mailto:hello@example.com">Əlaqə</a>
            </div>
        </header>
    );
}
