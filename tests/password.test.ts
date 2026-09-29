import { test } from "node:test";
import { strict as assert } from "node:assert";
import { hashPassword, verifyPassword } from "../lib/password";
test("passwords are salted and wrong credentials are rejected", async () => {
  const a = await hashPassword("long-password-here"), b = await hashPassword("long-password-here");
  assert.notEqual(a, b); assert.equal(await verifyPassword("long-password-here", a), true);
  assert.equal(await verifyPassword("wrong-password", a), false);
  assert.equal(await verifyPassword("long-password-here", "malformed"), false);
});
