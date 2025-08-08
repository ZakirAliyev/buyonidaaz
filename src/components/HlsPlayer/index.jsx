import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export default function HlsPlayer({ initialSrc = "" }) {
    const videoRef = useRef(null);
    const hlsRef = useRef(null);
    const [src, setSrc] = useState(initialSrc);
    const [tempSrc, setTempSrc] = useState(initialSrc);
    const [status, setStatus] = useState("");

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !src) return;

        const destroy = () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
            video.removeAttribute("src"); // iOS boş ekran fix
            video.load();
        };

        setStatus("Yüklənir...");

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
            const onLoaded = () => {
                setStatus("Hazır");
                video.play().catch(() => {});
            };
            video.addEventListener("loadedmetadata", onLoaded);
        } else if (Hls.isSupported()) {
            const hls = new Hls({ enableWorker: true, lowLatencyMode: true, backBufferLength: 90 });
            hlsRef.current = hls;

            hls.on(Hls.Events.ERROR, (_, data) => {
                if (data?.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            setStatus("Şəbəkə xətası. Yenidən cəhd edilir...");
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            setStatus("Media xətası. Bərpa edilir...");
                            hls.recoverMediaError();
                            break;
                        default:
                            setStatus("Kritik xəta.");
                            hls.destroy();
                            break;
                    }
                } else {
                    setStatus(`Xəbərdarlıq: ${data?.details || "naməlum"}`);
                }
            });

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                setStatus("Hazır");
                video.play().catch(() => {});
            });

            hls.loadSource(src);
            hls.attachMedia(video);
        } else {
            setStatus("Bu brauzer HLS dəstəkləmir.");
        }

        return destroy;
    }, [src]);

    useEffect(() => {
        setSrc(initialSrc);
        setTempSrc(initialSrc);
    }, [initialSrc]);

    const handleLoad = (e) => {
        e.preventDefault();
        if (!tempSrc.trim().endsWith(".m3u8")) {
            setStatus("Düzgün m3u8 linki daxil et.");
            return;
        }
        setSrc(tempSrc.trim());
    };

    return (
        <div className="player-card">
            <video ref={videoRef} controls playsInline muted className="video-el" />
        </div>
    );
}
