export default function Footer() {
    return (
        <footer className="footer">
            <div>© {new Date().getFullYear()} Buyonida — Açıq yayımlar üçün sadə player</div>
            <div className="muted">Qeyd: Bəzi kanallar CORS və ya regional məhdudiyyətə görə açılmaya bilər.</div>
        </footer>
    );
}
