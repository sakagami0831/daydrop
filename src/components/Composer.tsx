"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  visibilityDescriptions,
  visibilityLabels,
  type Visibility,
} from "@/lib/daydrop";
import { findNgWord } from "@/lib/moderation";
import { useDayDrop } from "@/lib/store";

export function Composer() {
  const router = useRouter();
  const { currentUser, users, createDiary } = useDayDrop();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [visibility, setVisibility] = useState<Visibility>("followers");
  const [recipientIds, setRecipientIds] = useState<string[]>([]);
  const [tagText, setTagText] = useState("");
  const [error, setError] = useState("");

  if (!currentUser) {
    return null;
  }

  const candidates = users.filter((user) => user.id !== currentUser.id);
  const followerUsers = users.filter((user) =>
    currentUser.followers.includes(user.id),
  );
  const selectedRecipients =
    visibility === "followers" ? followerUsers.length : recipientIds.length;
  const selectedRecipientNames = candidates
    .filter((user) => recipientIds.includes(user.id))
    .map((user) => user.name);
  const coinShortage = error.includes("\u30b3\u30a4\u30f3\u304c\u4e0d\u8db3");

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
    setError("");
    if (!title.trim() || !body.trim()) {
      return;
    }

    const ngWord = findNgWord(`${title}\n${body}`);
    if (ngWord) {
      setError(`\u5b89\u5168\u306e\u305f\u3081\u300c${ngWord}\u300d\u3092\u542b\u3080\u65e5\u8a18\u306f\u5c4a\u3051\u3089\u308c\u307e\u305b\u3093\u3002`);
      return;
    }

    if (currentUser.coinBalance < 30) {
      setError("\u30b3\u30a4\u30f3\u304c\u4e0d\u8db3\u3057\u3066\u3044\u307e\u3059\u3002\u65e5\u8a18\u306e\u6295\u7a3f\u306b\u306f30\u30b3\u30a4\u30f3\u5fc5\u8981\u3067\u3059\u3002");
      return;
    }

    if (visibility === "specified" && recipientIds.length === 0) {
      setError("\u6307\u5b9a\u30e6\u30fc\u30b6\u30fc\u3078\u9001\u4fe1\u3059\u308b\u5834\u5408\u306f\u3001\u5c4a\u3051\u308b\u76f8\u624b\u3092\u9078\u3093\u3067\u304f\u3060\u3055\u3044\u3002");
      return;
    }

    if (visibility === "followers" && followerUsers.length === 0) {
      setError("\u30d5\u30a9\u30ed\u30ef\u30fc\u3078\u9001\u4fe1\u3059\u308b\u5c4a\u3051\u5148\u304c\u307e\u3060\u3044\u307e\u305b\u3093\u3002\u5168\u4f53\u516c\u958b\u304b\u6307\u5b9a\u30e6\u30fc\u30b6\u30fc\u3092\u9078\u3093\u3067\u304f\u3060\u3055\u3044\u3002");
      return;
    }

    const diary = createDiary({
      title: title.trim(),
      body: body.trim(),
      imageUrl,
      visibility,
      recipientIds: visibility === "specified" ? recipientIds : [],
      tags: tagText
        .split(/[,\s\u3001]+/)
        .map((tag) => tag.trim())
        .filter(Boolean),
    });

    if (!diary) {
      setError("\u65e5\u8a18\u3092\u6295\u7a3f\u3067\u304d\u307e\u305b\u3093\u3067\u3057\u305f\u3002");
      return;
    }

    setTitle("");
    setBody("");
    setImageUrl(undefined);
    setTagText("");
    setVisibility("followers");
    setRecipientIds([]);
    router.push("/");
  };

  return (
    <section className="rounded-2xl border border-[#ece7fb] bg-white/90 p-4 shadow-[0_10px_26px_rgba(126,112,174,0.08)]">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black text-[#8b7cf6]">
            {"\u4eca\u65e5\u306e\u65e5\u8a18\u3092\u66f8\u304f"}
          </p>
          <h2 className="mt-0.5 text-xl font-black">
            {"\u5c4a\u3051\u5148\u3092\u9078\u3076"}
          </h2>
        </div>
        <div className="w-fit rounded-2xl bg-[#f0edff] px-3 py-1.5 text-right">
          <p className="text-xs font-black text-[#8b7cf6]">
            {"\u5c4a\u3051\u308b\u6570"}
          </p>
          <p className="text-lg font-black text-[#7c6ee6]">
            {visibility === "public"
              ? "\u5168\u4f53"
              : `${selectedRecipients}\u4eba`}
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={"\u30bf\u30a4\u30c8\u30eb"}
          className="rounded-2xl border border-[#ece7fb] bg-[#fbfaff] px-3 py-2.5 text-sm font-bold outline-none focus:border-[#9b8be8]"
        />
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder={"\u4eca\u65e5\u3042\u3063\u305f\u3053\u3068\u3001\u6b8b\u3057\u3066\u304a\u304d\u305f\u3044\u6c17\u6301\u3061"}
          className="min-h-40 rounded-2xl border border-[#ece7fb] bg-[#fbfaff] px-3 py-2.5 text-sm leading-6 outline-none focus:border-[#9b8be8] sm:min-h-52"
        />

        <label className="rounded-2xl border border-dashed border-[#ded7fb] bg-[#fbfaff] p-3 text-xs font-black text-[#8b7cf6]">
          {"\u753b\u50cf\u3092\u6dfb\u3048\u308b"}
          <input
            type="file"
            accept="image/*"
            onChange={(event) => onImageChange(event.target.files?.[0])}
            className="mt-1.5 block w-full text-xs text-[#746d82]"
          />
        </label>

        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={"\u6295\u7a3f\u753b\u50cf\u30d7\u30ec\u30d3\u30e5\u30fc"}
            className="max-h-56 w-full rounded-2xl object-cover"
          />
        ) : null}

        <input
          value={tagText}
          onChange={(event) => setTagText(event.target.value)}
          placeholder={"\u30bf\u30b0\uff08\u4f8b: \u65e5\u5e38\u3001\u6563\u6b69\uff09"}
          className="rounded-2xl border border-[#ece7fb] bg-[#fbfaff] px-3 py-2.5 text-sm outline-none focus:border-[#9b8be8]"
        />

        <div className="grid gap-2 md:grid-cols-3">
          {(Object.keys(visibilityLabels) as Visibility[]).map((key) => (
            <button
              key={key}
              onClick={() => setVisibility(key)}
              className={`rounded-2xl border p-2.5 text-left transition ${
                visibility === key
                  ? "border-[#9b8be8] bg-[#f0edff]"
                  : "border-[#ece7fb] bg-white"
              }`}
            >
              <span className="block text-xs font-black text-[#363142]">
                {visibilityLabels[key]}
              </span>
              <span className="mt-0.5 block text-[11px] leading-4 text-[#9b94aa]">
                {visibilityDescriptions[key]}
              </span>
            </button>
          ))}
        </div>

        {visibility === "followers" ? (
          <div className="rounded-2xl bg-[#fbfaff] p-2.5">
            <p className="text-xs font-black">
              {"\u4eca\u56de\u5c4a\u304f\u30d5\u30a9\u30ed\u30ef\u30fc"}
            </p>
            <p className="mt-1 text-[11px] text-[#9b94aa]">
              {followerUsers.length > 0
                ? followerUsers.map((user) => user.name).join("\u3001")
                : "\u307e\u3060\u30d5\u30a9\u30ed\u30ef\u30fc\u304c\u3044\u307e\u305b\u3093\u3002"}
            </p>
          </div>
        ) : null}

        {visibility === "specified" ? (
          <div className="rounded-2xl bg-[#fbfaff] p-2.5">
            <p className="mb-2 text-xs font-black">
              {"\u5c4a\u3051\u308b\u76f8\u624b"}
            </p>
            <div className="flex flex-wrap gap-2">
              {candidates.map((user) => (
                <button
                  key={user.id}
                  onClick={() => toggleRecipient(user.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-black ${
                    recipientIds.includes(user.id)
                      ? "bg-[#8b7cf6] text-white"
                      : "bg-white text-[#746d82]"
                  }`}
                >
                  {user.name}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] font-bold text-[#9b94aa]">
              {selectedRecipientNames.length > 0
                ? `${selectedRecipientNames
                    .map((name) => `${name}\u3055\u3093`)
                    .join("\u3001")}\u306b\u5c4a\u3051\u307e\u3059`
                : "\u5c4a\u3051\u308b\u76f8\u624b\u3092\u9078\u3093\u3067\u304f\u3060\u3055\u3044\u3002"}
            </p>
          </div>
        ) : null}

        <button
          onClick={submit}
          disabled={!title.trim() || !body.trim()}
          className="rounded-full bg-[#8b7cf6] px-5 py-2.5 text-sm font-black text-white shadow-[0_10px_20px_rgba(139,124,246,0.20)] transition disabled:cursor-not-allowed disabled:bg-[#cfc8f8]"
        >
          {"\u65e5\u8a18\u3092\u5c4a\u3051\u308b"}
        </button>
        {error ? (
          <div className="rounded-2xl bg-[#fff7fa] px-3 py-2 text-xs font-bold text-[#b15b77]">
            <p>{error}</p>
            {coinShortage ? (
              <Link
                href="/shop"
                className="mt-2 inline-block rounded-full bg-white px-3 py-1 text-[#7c6ee6]"
              >
                {"\u30b3\u30a4\u30f3\u3092\u6e96\u5099\u3059\u308b"}
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
