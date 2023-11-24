import { createApi } from "core";
import { entry } from "./entry";
import { day } from "./day";

export const api = createApi({
  entry,
  day,
});
