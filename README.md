# Custom Slash Command Wrapper
Custom slash commands are complicated additions to your add-ons. Let's fix that.

You can add a custom command in 5 steps using this library. Keep scrolling down to find out how.

## Quick Example

Obviously, ensure you first import the functions and classes. You'll need to import from `@minecraft/server` too:

```typescript
import { system, CustomCommandParamType, CommandPermissionLevel } from "@minecraft/server";
import { CommandRegister, defineCommand, defineParameter } from "command-wrapper";
```

Configure the register.

```typescript
const commandRegister = new CommandRegister("hello", CommandPermissionLevel.GameDirectors, true)
```

Pick your parameters.

```typescript
const targetParam = defineParameter({
    name: "target",
    type: CustomCommandParamType.EntitySelector,
    mandatory: true
})
```

Create the command.

```typescript
const smiteCommand = defineCommand({
    name: "smite",
    description: "Smites selected entities.",
    parameters: [targetParam],
    callbackFunction(_origin, players) {
        system.run(() => {
            players.forEach(player => {
                player.runCommand("summon lightning_bolt")
            })
        })
    }
})
```

Recite to the register.

```typescript
commandRegister.registerCommand(smiteCommand)
```

---

Altogether, you'll finish with this file.

```typescript
import { system, CustomCommandParamType, CommandPermissionLevel } from "@minecraft/server"
import { CommandRegister, defineCommand, defineParameter } from "command-wrapper";

const commandRegister = new CommandRegister("hello", CommandPermissionLevel.GameDirectors, true)

const targetParam = defineParameter({
    name: "target",
    type: CustomCommandParamType.EntitySelector,
    mandatory: true
})

const smiteCommand = defineCommand({
    name: "smite",
    description: "Smites selected entities.",
    parameters: [targetParam],
    callbackFunction(_origin, players) {
        system.run(() => {
            players.forEach(player => {
                player.runCommand("summon lightning_bolt")
            })
        })
    }
})

commandRegister.registerCommand(smiteCommand)
```

Now, you can strike yourself with lightning using `/hello:smite @s`.

## Details

The `CommandRegister` needs you to define the command prefix, and, optionally, the `defaultPermissionLevel` and whether cheats are required to run them.

> [!IMPORTANT]
> Don't create more than one `CommandRegister`. Instead, export it as a global constant for your project.

```typescript
new CommandRegister(namespace: string, defaultPermissionLevel?: CommandPermissionLevel, cheatsRequired?: boolean)
```

Individual commands can override the `defaultPermissionLevel` and `cheatsRequired` setting defined here.

If not provided, the `defaultPermissionLevel` is set to `CommandPermissionLevel.GameDirectors`, and `cheatsRequired` is set to `true`.

---

The `defineParameter` function accepts this object for non `Enum` parameters.

```typescript
interface CommandParameterGeneric {
  name: string;
  mandatory: boolean;
  type: Exclude<CustomCommandParamType, CustomCommandParamType.Enum>>;
}
```

For an `Enum` parameter, there is an extra `values` property. `values` must not be an empty array.

```typescript
interface CommandParameterEnum {
  name: string;
  mandatory: boolean;
  type: CustomCommandParamType.Enum;
  values: string[];
}
```

No prefixes are required, they are handled automatically.

---

The `defineCommand` function accepts an object like this.

```typescript
interface CommandInfo {
  callbackFunction: CommandCallback<P>;
  successMessage?: string;
  failureMessage?: string;
  cheatsRequired?: boolean;
  name: string;
  description: string;
  permissionLevel?: CommandPermissionLevel;
  parameters?: (CommandParameterGeneric | CommandParameterEnum)[];
}
```

> [!IMPORTANT]
> Optional `parameters` must come *after* mandatory `parameters` in the array.

Again, no prefixes are required for the `name` property. It is handled automatically.
