import React, { useMemo } from "react";

export default function ChannelList({
                                        channels,
                                        currentId,
                                        onSelect,
                                        query,
                                        setQuery,
                                        typeFilter,
                                        setTypeFilter,
                                        favorites,
                                        toggleFavorite
                                    }) {
    const filtered = useMemo(() => {
        const q = query.toLowerCase().trim();
        return channels.filter((c) => {
            const passType = typeFilter === "all" ? true : c.media_type === typeFilter;
            const passQuery = !q || (c.name || c.id).toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
            return passType && passQuery;
        });
    }, [channels, query, typeFilter]);

    return (
        <aside className="sidebar">
            <div className="filters">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Kanal axtar..."
                />
                <div className="segmented">
                    <button className={typeFilter==="all"?"active":""} onClick={()=>setTypeFilter("all")}>Hamısı</button>
                    <button className={typeFilter==="video"?"active":""} onClick={()=>setTypeFilter("video")}>TV</button>
                    <button className={typeFilter==="audio"?"active":""} onClick={()=>setTypeFilter("audio")}>Radio</button>
                </div>
            </div>

            <div className="list">
                {filtered.length === 0 ? (
                    <div className="empty">Heç nə tapılmadı.</div>
                ) : filtered.map((c) => {
                    const active = currentId === c.id;
                    const fav = favorites.has(c.id);
                    return (
                        <button
                            key={c.id}
                            className={`item ${active ? "active" : ""}`}
                            onClick={() => onSelect(c)}
                            title={c.hls_url}
                        >
                            <div className="meta">
                                <span className="name">{c.name || c.id}</span>
                                <span className={`badge ${c.media_type}`}>{c.media_type}</span>
                            </div>
                            <div
                                className={`fav ${fav ? "on" : ""}`}
                                onClick={(e) => { e.stopPropagation(); toggleFavorite(c.id); }}
                                title={fav ? "Favoritdən çıxar" : "Favoritə at"}
                            >
                                ★
                            </div>
                        </button>
                    );
                })}
            </div>
        </aside>
    );
}
