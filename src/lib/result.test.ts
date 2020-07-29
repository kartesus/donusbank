import { wrapped } from "./result";

test("Wrapped value", () => {
  let value = wrapped("VALUE")
  expect(value).toMatchObject({ ok: true, data: "VALUE" })
})

test("Wrapped error", () => {
  let err = wrapped(new Error("ERR"))
  expect(err).toMatchObject({ ok: false, data: { message: "ERR" } })
})