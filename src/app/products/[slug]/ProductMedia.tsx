import WixImage from "@/components/WixImage";
import { cn } from "@/lib/utils";
import { products } from "@wix/stores";
import { PlayIcon } from "lucide-react";
import { useEffect, useState } from "react";
import React from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
interface ProductMediaProps {
  media: products.MediaItem[] | undefined;
}

export default function ProductMedia({ media }: ProductMediaProps) {
  const [selectedMedia, setSelectedMedia] = useState(media?.[0]);
  useEffect(() => {
    setSelectedMedia(media?.[0]);
  }, [media]);
  if (!media?.length) return null;

  const selectedImage = selectedMedia?.image;
  const selectedVideo = selectedMedia?.video?.files?.[0];
  return (
    <div className="h-fit basis-2/5 space-y-5 md:sticky md:top-10">
      <div className="aspect-square bg-secondary">
        {selectedImage?.url ? (
          <Zoom>
            <WixImage
              mediaIdentifier={selectedImage.url}
              alt={selectedImage.altText}
              width={1000}
              height={1000}
            />
          </Zoom>
        ) : selectedVideo?.url ? (
          <div className="flex size-full items-center bg-black">
            <video controls className="h-full w-full">
              <source
                src={selectedVideo.url}
                type={`video/${selectedVideo.format}`}
              />
            </video>
          </div>
        ) : null}
      </div>
      {media.length > 1 && (
        <div className="flex flex-wrap gap-5">
          {media.map((mediaItem) => (
            <MediaPreview
              mediaItem={mediaItem}
              key={mediaItem._id}
              isSelected={mediaItem._id === selectedMedia?._id}
              onSelect={() => setSelectedMedia(mediaItem)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
interface MediaPreviewProps {
  mediaItem: products.MediaItem;
  isSelected: boolean;
  onSelect: () => void;
}

function MediaPreview({ mediaItem, isSelected, onSelect }: MediaPreviewProps) {
  const imgUrl = mediaItem?.image?.url;
  const stillFrameMediaId = mediaItem?.video?.stillFrameMediaId;
  const thumbnailUrl = mediaItem.thumbnail?.url;
  const resolvedThumbnailUrl =
    stillFrameMediaId && thumbnailUrl
      ? thumbnailUrl.split(stillFrameMediaId)[0] + stillFrameMediaId
      : undefined;
  if (!imgUrl && !resolvedThumbnailUrl) return null;
  return (
    <div
      className={cn(
        "relative cursor-pointer bg-secondary",
        isSelected && "outline outline-1 outline-primary",
      )}
    >
      <WixImage
        mediaIdentifier={imgUrl || resolvedThumbnailUrl}
        alt={mediaItem?.image?.altText || mediaItem.video?.files?.[0].altText}
        width={100}
        height={100}
        onClick={onSelect}
      />
      {resolvedThumbnailUrl && (
        <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 p-2">
          <PlayIcon className="size-12 text-white/60" />
        </span>
      )}
    </div>
  );
}
