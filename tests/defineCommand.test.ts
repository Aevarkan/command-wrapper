import { describe, test, expect } from "vitest";
import { defineCommand, defineParameter } from "../src/index";
import { CustomCommandParamType } from "@minecraft/server";

const stringParam = defineParameter({
  name: "mode",
  type: CustomCommandParamType.String,
  mandatory: false,
});

const boolParam = defineParameter({
  name: "flag",
  type: CustomCommandParamType.Boolean,
  mandatory: true,
});

describe("defineCommand", () => {
  test("throws if a mandatory parameter appears after an optional one", () => {
    expect(() => {
      defineCommand({
        name: "testCommand",
        description: "testing parameter order",
        parameters: [stringParam, boolParam],
        callbackFunction: () => true,
      });
    }).toThrow("command-wrapper error: mandatory parameters must appear before optional parameters.");
  });

  test("does NOT throw if parameters are in correct order", () => {
    expect(() => {
      defineCommand({
        name: "testCommand",
        description: "testing parameter order",
        parameters: [boolParam, stringParam],
        callbackFunction: () => true,
      });
    }).not.toThrow();
  });

  test("does NOT throw if there are no parameters", () => {
    expect(() => {
      defineCommand({
        name: "testCommand",
        description: "testing parameter order",
        callbackFunction: () => true,
      });
    }).not.toThrow();
  });
});
