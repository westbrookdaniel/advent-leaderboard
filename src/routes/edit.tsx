import { z, validate, router } from "core";
import { api } from "~/api";
import { Layout } from "~/components/Layout";

router.view.GET("/edit", async () => {
  let today = await api.day.today();
  if (!today.data) today = await api.day.create(new Date());
  if (!today.data) throw new Error("Failed to create today's day");
  const entries = await api.entry.allForDay(today.data.id);
  if (!entries.data) throw new Error("Failed to get entries for today");

  return (
    <Layout>
      <main class="h-screen w-screen grid place-content-center text-center bg-neutral-800 text-neutral-400">
        <h1 class="text-6xl font-thin mb-16 text-neutral-700">
          Edit Leaderboard
        </h1>

        <Entries entries={entries} />

        <div class="mt-48">
          <a href="/" class="hover:underline">
            &larr; Back
          </a>
        </div>
      </main>
    </Layout>
  );
});

router.route.DELETE("/entry/:id", async (_, params) => {
  const id = parseInt(params.id);
  await api.entry.delete(id);
});

function Entries({ entries, ...props }: any) {
  return (
    <div
      id="entries"
      class="flex flex-col space-y-2 text-left max-w-xs mx-auto w-full text-left"
      {...props}
    >
      <h2 class="text-2xl mt-16 mb-4">Today's Results:</h2>
      {entries.data.map((entry: any) => (
        <form
          action={`/entry/${entry.id.toString()}`}
          method="DELETE"
          class="flex justify-between"
        >
          <div>{entry.name}</div>
          <div class="flex-1"></div>
          <div class="mr-4">{entry.time}</div>
          <button type="submit" class="text-neutral-500 hover:underline">
            Delete
          </button>
        </form>
      ))}
      {entries.data.length === 0 && (
        <div class="text-neutral-500 text-sm mb-2">
          No entries for today yet
        </div>
      )}
    </div>
  );
}
