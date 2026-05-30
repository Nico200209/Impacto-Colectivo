"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/lib/hooks";
import { MdPlayCircle, MdClose } from "react-icons/md";

interface Video {
  id: string;
  title: string;
  category: string;
  published_date: string;
  duration: string;
  video_url: string;
}

function isYouTubeUrl(url: string) {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.includes("/embed/")) return u.pathname.split("/embed/")[1].split("/")[0];
      return u.searchParams.get("v");
    }
  } catch {
    // invalid URL
  }
  return null;
}

function VideoModal({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="relative w-full max-w-3xl">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors"
          aria-label="Cerrar"
        >
          <MdClose size={28} />
        </button>
        <video
          src={url}
          title={title}
          controls
          autoPlay
          className="w-full rounded-xl shadow-2xl bg-black"
          style={{ maxHeight: "70vh" }}
        />
      </div>
    </div>
  );
}

function VideoCardSkeleton({ style }: { style: React.CSSProperties }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100" style={style}>
      <div className="w-full bg-gray-200 animate-pulse" style={{ paddingBottom: "56.25%" }} />
      <div className="p-5 flex flex-col gap-2">
        <div className="w-16 h-3 bg-gray-100 rounded animate-pulse" />
        <div className="w-full h-4 bg-gray-100 rounded animate-pulse" />
        <div className="w-2/3 h-4 bg-gray-100 rounded animate-pulse" />
      </div>
    </div>
  );
}

export default function Videos() {
  const [headerRef, headerInView] = useInView<HTMLDivElement>(0.15);
  const [gridRef, gridInView] = useInView<HTMLDivElement>(0.05);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVideo, setModalVideo] = useState<Video | null>(null);

  useEffect(() => {
    fetch("/api/videos")
      .then((r) => r.json())
      .then((data) => setVideos(data.videos ?? []))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="videos" className="bg-white py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div ref={headerRef} className="mb-12">
          <p className={`text-xs font-semibold tracking-[0.2em] uppercase text-[#2EBFC0] mb-4 ${headerInView ? "animate-reveal" : "opacity-0"}`}>
            Videos y análisis
          </p>
          <h2 className={`text-4xl sm:text-5xl font-bold text-[#1E2D3D] leading-tight max-w-xl ${headerInView ? "animate-reveal-d1" : "opacity-0"}`}>
            Análisis en formato audiovisual
          </h2>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
          {loading ? (
            [0, 1, 2, 3].map((i) => (
              <VideoCardSkeleton key={i} style={{ opacity: 0.6 - i * 0.1 }} />
            ))
          ) : videos.length === 0 ? (
            <div className="col-span-2 py-16 text-center text-sm text-[#6B7280]">
              No hay videos publicados aún.
            </div>
          ) : (
            videos.map((video, i) => {
              const isYT = isYouTubeUrl(video.video_url);
              const videoId = isYT ? extractYouTubeId(video.video_url) : null;
              const thumbnailUrl = videoId
                ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                : null;

              const handleClick = () => {
                if (isYT) {
                  window.open(video.video_url, "_blank", "noopener,noreferrer");
                } else {
                  setModalVideo(video);
                }
              };

              return (
                <button
                  key={video.id}
                  onClick={handleClick}
                  className="group text-left bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  style={{
                    opacity: gridInView ? 1 : 0,
                    transform: gridInView ? "translateY(0)" : "translateY(20px)",
                    transition: `opacity 0.5s ease-out ${i * 0.09}s, transform 0.5s ease-out ${i * 0.09}s, box-shadow 0.2s ease`,
                  }}
                >
                  {/* Thumbnail */}
                  <div className="relative w-full overflow-hidden" style={{ paddingBottom: "56.25%" }}>
                    {/* Background */}
                    <div
                      className="absolute inset-0 bg-[#1E2D3D]"
                      style={
                        thumbnailUrl
                          ? { backgroundImage: `url(${thumbnailUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                          : {
                              backgroundImage:
                                "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.04) 39px, rgba(255,255,255,0.04) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.04) 39px, rgba(255,255,255,0.04) 40px)",
                            }
                      }
                    />

                    {/* Overlay */}
                    <div className={`absolute inset-0 transition-colors ${thumbnailUrl ? "bg-[#1E2D3D]/40 group-hover:bg-[#1E2D3D]/55" : "bg-[#1E2D3D]/20 group-hover:bg-[#1E2D3D]/30"}`} />

                    {/* Category badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2.5 py-1 rounded-md bg-[#1E2D3D]/70 text-white text-[10px] font-bold tracking-[0.15em] uppercase backdrop-blur-sm">
                        {video.category}
                      </span>
                    </div>

                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="w-14 h-14 rounded-full bg-[#2EBFC0] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#27aaab] transition-all duration-200">
                        <MdPlayCircle size={32} className="text-white ml-0.5" />
                      </div>
                    </div>

                    {/* Duration badge */}
                    <div className="absolute bottom-3 right-3 z-10">
                      <span className="px-2 py-0.5 rounded bg-[#1E2D3D]/80 text-white text-xs font-bold tracking-wide backdrop-blur-sm">
                        {video.duration}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="px-5 py-4">
                    <p className="font-bold text-[#1E2D3D] text-sm sm:text-base leading-snug mb-1 group-hover:text-[#2EBFC0] transition-colors">
                      {video.title}
                    </p>
                    <p className="text-xs text-[#6B7280]">{video.published_date}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Modal for self-hosted videos */}
      {modalVideo && (
        <VideoModal
          url={modalVideo.video_url}
          title={modalVideo.title}
          onClose={() => setModalVideo(null)}
        />
      )}
    </section>
  );
}
