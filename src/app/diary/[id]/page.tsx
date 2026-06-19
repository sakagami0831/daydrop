import { AppShell } from "@/components/AppShell";
import { DiaryDetail } from "@/components/DiaryDetail";

export default async function DiaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppShell>
      <DiaryDetail diaryId={id} />
    </AppShell>
  );
}

