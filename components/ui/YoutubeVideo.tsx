import { clx } from "../../utils/clx.ts";
import { useScript } from "@deco/deco/hooks";

interface YoutubeVideoProps {
  url: string;
  class?: string;
  thumbnailUrl?: string;
  title?: string;
}

export default function YoutubeVideo(
  { url, class: _class, thumbnailUrl, title = "YouTube video player" }: YoutubeVideoProps,
) {
  const videoId = url.includes("watch?v=") 
    ? url.split("watch?v=")[1]?.split("&")[0]
    : url.split("/").pop()?.split("?")[0];
  
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  const defaultThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const thumbnail = thumbnailUrl || defaultThumbnail;

  return (
    <div class={clx("relative w-full h-full", _class)}>
      {/* Thumbnail placeholder */}
      <div
        class="youtube-placeholder relative w-full h-full cursor-pointer group"
        data-video-id={videoId}
        data-embed-url={embedUrl}
        data-title={title}
      >
        <img
          src={thumbnail}
          alt={title}
          class="w-full h-full object-cover"
        />
        {/* Play button overlay */}
        <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all duration-200">
          <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
            <svg
              class="w-6 h-6 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Script para lazy loading */}
      <script
        dangerouslySetInnerHTML={{
          __html: useScript(() => {
            // Função para carregar vídeo quando clicado
            function loadYouTubeVideo() {
              const placeholders = document.querySelectorAll('.youtube-placeholder');
              
              placeholders.forEach((placeholder) => {
                placeholder.addEventListener('click', function(this: HTMLElement) {
                  const embedUrl = this.dataset.embedUrl;
                  const title = this.dataset.title;
                  
                  // Criar iframe
                  const iframe = document.createElement('iframe');
                  iframe.src = embedUrl!;
                  iframe.title = title!;
                  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                  iframe.allowFullscreen = true;
                  iframe.className = "w-full h-full max-w-full max-h-full z-20";
                  
                  // Substituir placeholder pelo iframe
                  this.parentNode?.replaceChild(iframe, this);
                });
              });
            }
            
            // Carregar quando DOM estiver pronto
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', loadYouTubeVideo);
            } else {
              loadYouTubeVideo();
            }
          }),
        }}
      />
    </div>
  );
}
