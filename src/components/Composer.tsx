"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDayDrop } from "@/lib/store";
import { visibilityLabels, type Visibility } from "@/lib/daydrop";

export function Composer() {
  const router = useRouter();
  const { currentUser, users, createDiary } = useDayDrop();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [visibility, setVisibility] = useState<Visibility>("followers");
  const [recipientIds, setRecipientIds] = useState<string[]>([]);

  if (!currentUser) {
    return null;
  }

  const candidates = users.filter((user) => user.id !== currentUser.id);

  const onImageChange = (file: File | undefined) => {
    if (!file) {
      setImageUrl(undefined);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImageUrl(String(reader.result));
    reader.readAsDataURL(file);
  };

  const toggleRecipient = (userId: string) => {
    setRecipientIds((current) =>
      current.includes(userId)
        ? current.filter((id) => id !== userId)
        : [...current, userId],
    );
  };

  const submit = () => {
    if (!title.trim() || !body.trim()) {
      return;
    }

    const diary = createDiary({
      title: title.trim(),
      body: body.trim(),
      imageUrl,
      visibility,
      recipientIds: visibility === "specified" ? recipientIds : [],
    });

    setTitle("");
    setBody("");
    setImageUrl(undefined);
    setVisibility("followers");
    setRecipientIds([]);
    router.push(`/diary/${diary.id}`);
  };

  return (
    <section className="rounded-[1.75rem] border border-[#f2e4d6] bg-white p-5 shadow-sm">
      <div className="mb-4">
        <p className="text-sm font-bold text-[#d1708e]">今日の日記を書く</p>
        <h2 className="text-2xl font-black">だれに届けますか？</h2>
      </div>

      <div className="grid gap-3">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="タイトル"
          className="rounded-3xl border border-[#f2e4d6] bg-[#fffdf9] px-4 py-3 font-bold outline-none focus:border-[#d1708e]"
        />
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="今日あったこと、残しておきたい気持ち"
          className="min-h-32 rounded-3xl border border-[#f2e4d6] bg-[#fffdf9] px-4 py-3 leading-7 outline-none focus:border-[#d1708e]"
        />

        <label className="rounded-3xl border border-dashed border-[#efc7d4] bg-[#fff7f9] p-4 text-sm font-bold text-[#9b4c64]">
          画像を添える
          <input
            type="file"
            accept="image/*"
            onChange={(event) => onImageChange(event.target.files?.[0])}
            className="mt-2 block w-full text-xs text-[#7d6a5c]"
          />
        </label>

        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt="投稿画像プレビュー"
            className="max-h-64 rounded-3xl object-cover"
          />
        ) : null}

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {(Object.keys(visibilityLabels) as Visibility[]).map((key) => (
            <button
              key={key}
              onClick={() => setVisibility(key)}
              className={`rounded-full border px-3 py-2 text-sm font-bold ${
                visibility === key
                  ? "border-[#d1708e] bg-[#ffdfe8] text-[#9b4c64]"
                  : "border-[#f2e4d6] bg-white text-[#7d6a5c]"
              }`}
            >
              {visibilityLabels[key]}
            </button>
          ))}
        </div>

        {visibility === "specified" ? (
          <div className="rounded-3xl bg-[#fffaf2] p-3">
            <p className="mb-2 text-sm font-bold">届ける相手</p>
            <div className="flex flex-wrap gap-2">
              {candidates.map((user) => (
                <button
                  key={user.id}
                  onClick={() => toggleRecipient(user.id)}
                  className={`rounded-full px-3 py-2 text-sm font-bold ${
                    recipientIds.includes(user.id)
                      ? "bg-[#d1708e] text-white"
                      : "bg-white text-[#7d6a5c]"
                  }`}
                >
                  {user.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <button
          onClick={submit}
          disabled={!title.trim() || !body.trim()}
          className="rounded-full bg-[#d1708e] px-5 py-3 font-black text-white shadow-sm transition disabled:cursor-not-allowed disabled:bg-[#e5c4cf]"
        >
          日記を届ける
        </button>
      </div>
    </section>
  );
}

