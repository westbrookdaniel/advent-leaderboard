import { z, validate, router } from "core";
import { memory } from "~/state";
import { Layout } from "~/components/Layout";

const count = memory.newState<number>("home:count", { default: 0 });

router.view.GET("/", async () => {
  const c = await count.get();

  return (
    <Layout>
      <main class="h-screen w-screen grid place-content-center text-center bg-neutral-800 text-neutral-400">
        <h1 class="text-8xl font-thin mb-8">GLX Advent Leaderboard</h1>
        <p class="mb-4">For advent of code 2023</p>
        <form hx-post="/" hx-target="h1" class="space-x-2">
          <input
            type="text"
            name="name"
            placeholder="Name"
            class="border border-neutral-700 bg-neutral-800 py-2 px-4 rounded-full"
          />
          <button class="bg-neutral-700 py-2 px-4 rounded-full hover:bg-neutral-600 focus:bg-neutral-500">
            Update Greeting
          </button>
        </form>
        <div class="mt-16">
          <a href="/previous" class="hover:underline">
            Previous Days
          </a>
        </div>
      </main>
    </Layout>
  );
});

router.route.POST("/", async (req) => {
  const { parsed } = await validate(
    await req.formData(),
    z.object({ name: z.string() }),
  );

  if (!parsed.success) throw new Error("Form not valid");
  if (!parsed.data.name) return <>Welcome to Core</>;
  return (
    <>
      Hey {parsed.data.name},
      <br />
      Welcome to Core
    </>
  );
});
