import image1 from "/public/assets/buyonidaLogo.png"

export default function Navbar({theme, onToggleTheme}) {
    return (
        <header className="navbar">
            <div className="brand">
                <img alt={"Logo"} src={image1} className="title"/>
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
