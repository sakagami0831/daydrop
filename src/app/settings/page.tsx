"use client";

import { AppShell } from "@/components/AppShell";
import { useDayDrop } from "@/lib/store";

const reasonLabels = {
  inappropriate: "\u4e0d\u9069\u5207\u306a\u5185\u5bb9",
  harassment: "\u8ff7\u60d1\u884c\u70ba",
  impersonation: "\u306a\u308a\u3059\u307e\u3057",
  personal_info: "\u500b\u4eba\u60c5\u5831",
  other: "\u305d\u306e\u4ed6",
};

export default function SettingsPage() {
  const {
    currentUser,
    users,
    diaries,
    blockedUserIds,
    mutedUserIds,
    hiddenDiaryIds,
    safetyReports,
    toggleBlockUser,
    toggleMuteUser,
    unhideDiary,
  } = useDayDrop();

  if (!currentUser) {
    return null;
  }

  const blocked = blockedUserIds[currentUser.id] ?? [];
  const muted = mutedUserIds[currentUser.id] ?? [];
  const hidden = hiddenDiaryIds[currentUser.id] ?? [];
  const reports = safetyReports.filter(
    (report) => report.reporterId === currentUser.id,
  );

  return (
    <AppShell>
      <div className="mx-auto grid max-w-4xl gap-3">
        <header className="rounded-2xl border border-[#ece7fb] bg-white/90 px-4 py-4 shadow-[0_10px_26px_rgba(126,112,174,0.08)]">
          <p className="text-xs font-black text-[#8b7cf6]">
            {"\u8a2d\u5b9a"}
          </p>
          <h1 className="mt-1 text-2xl font-black">
            {"\u5b89\u5168\u8a2d\u5b9a"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#746d82]">
            {"\u898b\u305f\u304f\u306a\u3044\u3082\u306e\u3092\u6e1b\u3089\u3057\u3066\u3001\u5b89\u5fc3\u3057\u3066\u65e5\u8a18\u3092\u8aad\u3081\u308b\u3088\u3046\u306b\u3057\u307e\u3059\u3002"}
          </p>
        </header>

        <SafetySection title={"\u30d6\u30ed\u30c3\u30af\u4e2d\u30e6\u30fc\u30b6\u30fc"}>
          {blocked.length === 0 ? (
            <EmptyText />
          ) : (
            blocked.map((userId) => {
              const user = users.find((item) => item.id === userId);
              return (
                <SafetyRow
                  key={userId}
                  title={user?.name ?? userId}
                  detail={user?.title ?? ""}
                  actionLabel={"\u89e3\u9664"}
                  onAction={() => toggleBlockUser(userId)}
                />
              );
            })
          )}
        </SafetySection>

        <SafetySection title={"\u30df\u30e5\u30fc\u30c8\u4e2d\u30e6\u30fc\u30b6\u30fc"}>
          {muted.length === 0 ? (
            <EmptyText />
          ) : (
            muted.map((userId) => {
              const user = users.find((item) => item.id === userId);
              return (
                <SafetyRow
                  key={userId}
                  title={user?.name ?? userId}
                  detail={user?.title ?? ""}
                  actionLabel={"\u89e3\u9664"}
                  onAction={() => toggleMuteUser(userId)}
                />
              );
            })
          )}
        </SafetySection>

        <SafetySection title={"\u975e\u8868\u793a\u65e5\u8a18"}>
          {hidden.length === 0 ? (
            <EmptyText />
          ) : (
            hidden.map((diaryId) => {
              const diary = diaries.find((item) => item.id === diaryId);
              return (
                <SafetyRow
                  key={diaryId}
                  title={diary?.title ?? diaryId}
                  detail={"\u30db\u30fc\u30e0\u306b\u8868\u793a\u3057\u306a\u3044\u65e5\u8a18"}
                  actionLabel={"\u8868\u793a\u306b\u623b\u3059"}
                  onAction={() => unhideDiary(diaryId)}
                />
              );
            })
          )}
        </SafetySection>

        <SafetySection title={"\u901a\u5831\u5c65\u6b74"}>
          {reports.length === 0 ? (
            <EmptyText />
          ) : (
            reports.map((report) => (
              <div key={report.id} className="rounded-2xl bg-[#fbfaff] p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-black">
                    {report.targetType === "diary"
                      ? "\u65e5\u8a18"
                      : "\u611f\u60f3"}
                    {"\u3092\u901a\u5831"}
                  </p>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-black text-[#b15b77]">
                    {reasonLabels[report.reason]}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#9b94aa]">
                  {new Date(report.createdAt).toLocaleString("ja-JP")}
                </p>
              </div>
            ))
          )}
        </SafetySection>
      </div>
    </AppShell>
  );
}

function SafetySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#ece7fb] bg-white/90 p-4 shadow-[0_10px_26px_rgba(126,112,174,0.08)]">
      <h2 className="mb-3 text-lg font-black">{title}</h2>
      <div className="grid gap-2">{children}</div>
    </section>
  );
}

function SafetyRow({
  title,
  detail,
  actionLabel,
  onAction,
}: {
  title: string;
  detail: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#fbfaff] p-3">
      <div className="min-w-0">
        <p className="truncate font-black">{title}</p>
        <p className="truncate text-xs text-[#9b94aa]">{detail}</p>
      </div>
      <button
        onClick={onAction}
        className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-black text-[#7c6ee6] ring-1 ring-[#ece7fb]"
      >
        {actionLabel}
      </button>
    </div>
  );
}

function EmptyText() {
  return (
    <p className="rounded-2xl bg-[#fbfaff] p-3 text-sm text-[#9b94aa]">
      {"\u307e\u3060\u3042\u308a\u307e\u305b\u3093\u3002"}
    </p>
  );
}
