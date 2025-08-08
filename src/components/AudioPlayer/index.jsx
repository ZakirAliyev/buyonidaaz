import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export default function AudioPlayer({ src = "" }) {
    const audioRef = useRef(null);
    const hlsRef = useRef(null);
    const [status, setStatus] = useState("");

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !src) return;

        // cleanup
        const destroy = () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
            audio.pause();
            audio.removeAttribute("src");
            audio.load();
        };

        setStatus("Yüklənir...");

        // Safari üçün native HLS
        if (audio.canPlayType("application/vnd.apple.mpegurl")) {
            audio.src = src;
            const onCanPlay = () => setStatus("Hazır");
            const onError = () => setStatus("Xəta — CORS/mixed content ola bilər");
            audio.addEventListener("canplay", onCanPlay);
            audio.addEventListener("error", onError);
            audio.play().catch(() => {});
            return () => {
                audio.removeEventListener("canplay", onCanPlay);
                audio.removeEventListener("error", onError);
                destroy();
            };
        }

        // Digər brauzerlər üçün hls.js
        if (Hls.isSupported()) {
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90,
            });
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
                audio.play().catch(() => {});
            });

            hls.loadSource(src);
            hls.attachMedia(audio);
        } else {
            setStatus("Bu brauzer HLS (audio) dəstəkləmir.");
        }

        return destroy;
    }, [src]);

    return (
        <div className="player-card">
            <audio ref={audioRef} controls className="audio-el" crossOrigin="anonymous" />
        </div>
    );
}
