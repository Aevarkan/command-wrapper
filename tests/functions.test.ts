import { expect, expectTypeOf, test } from 'vitest'
import { CommandParameterInfoGeneric, defineParameter } from "../src/index"
import { CustomCommandParamType } from '@minecraft/server';

test("stringParam infers as CommandParameterInfoGeneric<CustomCommandParamType.String>", () => {

  const stringParam = defineParameter({
    name: "mode",
    type: CustomCommandParamType.String,
    mandatory: false,
  });

  expectTypeOf(stringParam).toEqualTypeOf<CommandParameterInfoGeneric<CustomCommandParamType.String>>();

  expect(true).toBe(true);
});
