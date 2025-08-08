import { useEffect, useMemo, useState } from "react";
import Navbar from "../../../components/UserComponents/Navbar/index.jsx";
import ChannelList from "../../../components/ChannelList/index.jsx";
import AudioPlayer from "../../../components/AudioPlayer/index.jsx";
import HlsPlayer from "../../../components/HlsPlayer/index.jsx";
import Footer from "../../../components/UserComponents/Footer/index.jsx";
import CHANNELS from "../../../data/channels.js";

export default function HomePage() {
    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
    const [query, setQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [current, setCurrent] = useState(() => {
        const last = localStorage.getItem("lastChannel");
        return last ? JSON.parse(last) : CHANNELS[0];
    });
    const [favorites, setFavorites] = useState(() => {
        const raw = localStorage.getItem("favorites");
        return new Set(raw ? JSON.parse(raw) : []);
    });

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        if (current) localStorage.setItem("lastChannel", JSON.stringify(current));
    }, [current]);

    const list = useMemo(() => CHANNELS, []);

    const toggleFavorite = (id) => {
        const s = new Set(favorites);
        if (s.has(id)) s.delete(id); else s.add(id);
        setFavorites(s);
        localStorage.setItem("favorites", JSON.stringify(Array.from(s)));
    };

    return (
        <section className="page">
            <Navbar theme={theme} onToggleTheme={() => setTheme(t => t==="dark"?"light":"dark")} />
            <div className="container">
                <div className="grid">
                    <ChannelList
                        channels={list}
                        currentId={current?.id}
                        onSelect={setCurrent}
                        query={query}
                        setQuery={setQuery}
                        typeFilter={typeFilter}
                        setTypeFilter={setTypeFilter}
                        favorites={favorites}
                        toggleFavorite={toggleFavorite}
                    />
                    <main className="content">
                        <div className="now-playing">
                            <div className="title">{current?.name || current?.id}</div>
                            <div className="pill">{current?.media_type}</div>
                        </div>

                        {current?.media_type === "audio" ? (
                            <AudioPlayer src={current.hls_url} />
                        ) : (
                            <HlsPlayer initialSrc={current.hls_url} />
                        )}
                    </main>
                </div>
            </div>
            <Footer />
        </section>
    );
}
