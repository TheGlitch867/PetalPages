import { useState, type FormEvent, type KeyboardEvent } from "react";
import { TbrBookshelfColorIn } from "../components/TbrBookshelfColorIn/TbrBookshelfColorIn";
import { TbrColorPicker } from "../components/TbrColorPicker/TbrColorPicker";
import { PageBackground } from "../components/PageBackground/PageBackground";
import type { TbrBookshelfColors, TbrBookshelfPartId } from "../constants/tbrBookshelf";
import {
  DEFAULT_TBR_COLOR,
  defaultColorForIndex,
  getTbrColor,
  type TbrColorId,
} from "../constants/tbr";
import type { TbrBook } from "../types/tbr";
import "./TbrListPage.css";

interface TbrListPageProps {
  tbrList: TbrBook[];
  tbrBookshelfColors: TbrBookshelfColors;
  addTbrBook: (title: string, colorId: TbrColorId) => void;
  updateTbrBook: (id: string, updates: { title?: string; colorId?: TbrColorId }) => void;
  toggleTbrBookCompleted: (id: string) => void;
  removeTbrBook: (id: string) => void;
  setTbrBookshelfPartColor: (partId: TbrBookshelfPartId, colorId: TbrColorId | null) => void;
}

export function TbrListPage({
  tbrList,
  tbrBookshelfColors,
  addTbrBook,
  updateTbrBook,
  toggleTbrBookCompleted,
  removeTbrBook,
  setTbrBookshelfPartColor,
}: TbrListPageProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newColorId, setNewColorId] = useState<TbrColorId>(DEFAULT_TBR_COLOR);
  const [bookshelfBrush, setBookshelfBrush] = useState<TbrColorId>(DEFAULT_TBR_COLOR);
  const [bookshelfEraser, setBookshelfEraser] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editColorId, setEditColorId] = useState<TbrColorId>(DEFAULT_TBR_COLOR);

  const sorted = [...tbrList].sort((a, b) => a.order - b.order);
  const completedCount = sorted.filter((b) => b.completed).length;

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    addTbrBook(trimmed, newColorId);
    setNewTitle("");
    setNewColorId(defaultColorForIndex(sorted.length + 1));
  };

  const startEdit = (book: TbrBook) => {
    setEditingId(book.id);
    setEditTitle(book.title);
    setEditColorId(book.colorId);
  };

  const commitEdit = (id: string) => {
    const trimmed = editTitle.trim();
    if (trimmed) {
      updateTbrBook(id, { title: trimmed, colorId: editColorId });
    }
    setEditingId(null);
    setEditTitle("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === "Enter") commitEdit(id);
    if (e.key === "Escape") cancelEdit();
  };

  return (
    <PageBackground pageId="tbr" className="tbr-page" contentClassName="tbr-page__inner">
      <header className="tbr-page__header">
        <h1 className="tbr-page__title">To Be Read</h1>

        <div className="tbr-page__bookshelf-tools">
          <p className="tbr-page__bookshelf-hint">
            Pick a colour, then tap a book on the shelf to fill it in.
          </p>
          <TbrColorPicker
            value={bookshelfBrush}
            onChange={(id) => {
              setBookshelfBrush(id);
              setBookshelfEraser(false);
            }}
            label="Bookshelf colours"
            compact
          />
          <button
            type="button"
            className={`tbr-page__eraser${bookshelfEraser ? " tbr-page__eraser--active" : ""}`}
            onClick={() => setBookshelfEraser((e) => !e)}
          >
            {bookshelfEraser ? "Eraser on — tap to clear" : "Eraser"}
          </button>
        </div>

        <TbrBookshelfColorIn
          colors={tbrBookshelfColors}
          brushColor={bookshelfBrush}
          eraser={bookshelfEraser}
          onPartColor={setTbrBookshelfPartColor}
        />

        {sorted.length > 0 && (
          <p className="tbr-page__progress">
            {completedCount} of {sorted.length} finished
          </p>
        )}
      </header>

      <form className="tbr-page__add-form" onSubmit={handleAdd}>
        <div className="tbr-page__add">
          <input
            type="text"
            className="tbr-page__add-input"
            placeholder="Add a book title…"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            aria-label="New book title"
          />
          <button type="submit" className="tbr-page__add-btn" disabled={!newTitle.trim()}>
            Add book
          </button>
        </div>
        <TbrColorPicker
          value={newColorId}
          onChange={setNewColorId}
          label="Choose a colour for this book"
        />
      </form>

      {sorted.length === 0 ? (
        <div className="tbr-page__empty">
          <p>Your reading list is empty.</p>
          <p className="tbr-page__empty-sub">
            Add titles above, pick a colour, then tap the circle when you finish a book.
          </p>
        </div>
      ) : (
        <ul className="tbr-page__list">
          {sorted.map((book, index) => {
            const color = getTbrColor(book.colorId, index);
            const isEditing = editingId === book.id;

            return (
              <li
                key={book.id}
                className={`tbr-page__item${book.completed ? " tbr-page__item--done" : ""}${isEditing ? " tbr-page__item--editing" : ""}`}
                style={{ background: color.row }}
              >
                <button
                  type="button"
                  className={`tbr-page__circle${book.completed ? " tbr-page__circle--filled" : ""}`}
                  style={
                    book.completed
                      ? { background: color.fill, borderColor: color.fill }
                      : { borderColor: color.fill }
                  }
                  onClick={() => toggleTbrBookCompleted(book.id)}
                  aria-label={
                    book.completed
                      ? `Mark "${book.title}" as not finished`
                      : `Mark "${book.title}" as finished`
                  }
                  aria-pressed={book.completed}
                />

                {isEditing ? (
                  <div className="tbr-page__edit">
                    <input
                      type="text"
                      className="tbr-page__edit-input"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => handleEditKeyDown(e, book.id)}
                      autoFocus
                      aria-label="Edit book title"
                    />
                    <TbrColorPicker
                      value={editColorId}
                      onChange={setEditColorId}
                      label="Book colour"
                      compact
                    />
                    <div className="tbr-page__edit-actions">
                      <button
                        type="button"
                        className="tbr-page__edit-save"
                        onClick={() => commitEdit(book.id)}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="tbr-page__edit-cancel"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="tbr-page__title-btn"
                    onClick={() => startEdit(book)}
                    title="Click to edit title and colour"
                  >
                    <span
                      className="tbr-page__color-dot"
                      style={{ background: color.fill }}
                      aria-hidden="true"
                    />
                    <span className="tbr-page__book-title">{book.title}</span>
                  </button>
                )}

                {!isEditing && (
                  <button
                    type="button"
                    className="tbr-page__remove"
                    onClick={() => removeTbrBook(book.id)}
                    aria-label={`Remove "${book.title}"`}
                  >
                    ×
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </PageBackground>
  );
}
