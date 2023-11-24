import { z, validate, router } from "core";
import { api } from "~/api";
import { Layout } from "~/components/Layout";

router.view.GET("/", async () => {
  let today = await api.day.today();
  if (!today.data) today = await api.day.create(new Date());
  if (!today.data) throw new Error("Failed to create today's day");
  const entries = await api.entry.allForDay(today.data.id);
  if (!entries.data) throw new Error("Failed to get entries for today");

  return (
    <Layout>
      <main class="h-screen w-screen grid place-content-center text-center bg-neutral-800 text-neutral-400">
        <h1 class="text-6xl font-thin mb-16 text-neutral-700">
          GLX Advent of Code Leaderboard
        </h1>
        <Form />

        <Entries entries={entries} />

        <div class="mt-48">
          <a href="/edit" class="hover:underline">
            Edit Leaderboard &rarr;
          </a>
        </div>
      </main>
    </Layout>
  );
});

router.route.POST("/", async (req) => {
  const { parsed, raw } = await validate(
    await req.formData(),
    z.object({
      name: z.string().min(1, "Name is required"),
      time: z.string().min(1, "Time is required"),
    }),
  );

  if (!parsed.success) {
    return <Form errors={parsed.error.flatten().fieldErrors} fields={raw} />;
  }

  const today = await api.day.today();
  if (!today.data) throw new Error("Failed to get today");

  await api.entry.create({
    name: parsed.data.name,
    time: parsed.data.time,
    day_id: today.data.id,
  });

  const entries = await api.entry.allForDay(today.data.id);

  console.log(entries);

  return (
    <>
      <Form />
      <Entries entries={entries} hx-swap-oob="true" />
    </>
  );
});

function Form({ errors, fields }: { errors?: any; fields?: any }) {
  return (
    <form
      hx-post="/"
      hx-swap="outerHTML"
      class="flex flex-col space-y-2 max-w-xs mx-auto w-full text-left"
    >
      <h2 class="text-2xl mb-4">Your results for today:</h2>
      <input
        type="text"
        name="name"
        placeholder="Name"
        class="border border-neutral-700 bg-neutral-800 py-2 px-4 rounded-full"
        value={fields?.name}
      />
      {errors?.name && (
        <div class="text-red-500 text-sm mb-2">{errors.name}</div>
      )}
      <input
        type="text"
        name="time"
        placeholder="Time Completed"
        class="border border-neutral-700 bg-neutral-800 py-2 px-4 rounded-full"
        value={fields?.time}
      />
      {errors?.time && (
        <div class="text-red-500 text-sm mb-2">{errors.time}</div>
      )}
      <label class="text-sm text-neutral-500 w-full pb-2">
        (In the format of HH:MM:SS)
      </label>
      <button class="bg-neutral-700 py-2 px-4 rounded-full hover:bg-neutral-600 focus:bg-neutral-500">
        Submit
      </button>
    </form>
  );
}

function Entries({ entries, ...props }: any) {
  return (
    <div
      id="entries"
      class="flex flex-col space-y-2 text-left max-w-xs mx-auto w-full text-left"
      {...props}
    >
      <h2 class="text-2xl mt-16 mb-4">Today's Results:</h2>
      {entries.data.map((entry: any) => (
        <div class="flex justify-between">
          <div>{entry.name}</div>
          <div>{entry.time}</div>
        </div>
      ))}
      {entries.data.length === 0 && (
        <div class="text-neutral-500 text-sm mb-2">
          No entries for today yet
        </div>
      )}
    </div>
  );
}
