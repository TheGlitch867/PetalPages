import { SHOWS_PER_ROW } from "../../constants/shows";
import type { Rating } from "../../constants/ratings";
import type { ShowTvColorId } from "../../types/shows";
import { TvSlot } from "../TvSlot/TvSlot";
import "./TvRow.css";

interface TvRowSlotData {
  imageDataUrl?: string;
  title?: string;
  rating?: Rating;
  airDate?: string;
  colorId?: ShowTvColorId;
}

interface TvRowProps {
  rowKey: string;
  showRating?: boolean;
  showDate?: boolean;
  slots: TvRowSlotData[];
  openColorPicker: string | null;
  setOpenColorPicker: (key: string | null) => void;
  onImageChange: (slotIndex: number, imageDataUrl: string | null) => void;
  onTitleChange: (slotIndex: number, title: string) => void;
  onColorChange: (slotIndex: number, colorId: ShowTvColorId) => void;
  onRatingChange?: (slotIndex: number, rating: Rating | null) => void;
  onAirDateChange?: (slotIndex: number, airDate: string) => void;
}

export function TvRow({
  rowKey,
  showRating = false,
  showDate = false,
  slots,
  openColorPicker,
  setOpenColorPicker,
  onImageChange,
  onTitleChange,
  onColorChange,
  onRatingChange,
  onAirDateChange,
}: TvRowProps) {
  const row = Array.from({ length: SHOWS_PER_ROW }, (_, index) => slots[index] ?? {});

  return (
    <div className="tv-row">
      {row.map((slot, index) => {
        const pickerKey = `${rowKey}-${index}`;
        return (
          <TvSlot
            key={index}
            slotIndex={index}
            imageDataUrl={slot.imageDataUrl}
            title={slot.title}
            rating={slot.rating}
            airDate={slot.airDate}
            colorId={slot.colorId}
            showRating={showRating}
            showDate={showDate}
            colorPickerOpen={openColorPicker === pickerKey}
            onColorPickerOpenChange={(open) => setOpenColorPicker(open ? pickerKey : null)}
            onImageChange={(url) => onImageChange(index, url)}
            onTitleChange={(title) => onTitleChange(index, title)}
            onColorChange={(colorId) => onColorChange(index, colorId)}
            onRatingChange={onRatingChange ? (rating) => onRatingChange(index, rating) : undefined}
            onAirDateChange={
              onAirDateChange ? (airDate) => onAirDateChange(index, airDate) : undefined
            }
          />
        );
      })}
    </div>
  );
}
