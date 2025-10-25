/**
 * MIT License
 * 
 * Copyright (c) 2025 Aevarkan
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * Project: command-wrapper
 */

import { CustomCommandParamType } from "@minecraft/server";
import { CommandInfo, CommandParameterInfo, CommandParameterInfoEnum, CommandParameterInfoGeneric } from "./types";

/**
 * Defines an `Enum` command parameter.
 * 
 * `Enum` parameters have an extra `values` property that must not be empty.
 * 
 * @param parameter The command parameter object.
 * 
 * @example fillCommand.ts
 * ```ts
 * const fillType = defineParameter({
 *     name: "mode",
 *     type: CustomCommandParamType.Enum,
 *     mandatory: true,
 *     values: ["default", "hollow", "walls"]
 * });
 * ```
 */
export function defineParameter<V extends readonly string[]>(
    parameter: CommandParameterInfoEnum<V>
): CommandParameterInfoEnum<V>;

/**
 * Defines a generic custom command parameter.
 * 
 * @param parameter The command parameter object.
 * 
 * @example moneyCommand.ts
 * ```ts
 * const allowDebt = defineParameter({
 *     name: "allowDebt",
 *     type: CustomCommandParamType.Boolean,
 *     mandatory: false,
 * });
 * ```
 */
export function defineParameter<T extends Exclude<CustomCommandParamType, CustomCommandParamType.Enum>>(
    parameter: CommandParameterInfoGeneric<T>
): CommandParameterInfoGeneric<T>;

export function defineParameter<
    P extends CommandParameterInfo
>(parameter: P): P {
    return parameter
}

/**
 * Define a custom command.
 * 
 * @param command The {@link CommandInfo} object.
 * 
 * @throws Optional `parameters` **MUST** come after mandatory `parameters` in the array, a runtime error will be thrown otherwise.
 * 
 * @example chanceCommand.ts
 * ```typescript
 * const percentageChanceParameter = defineParameter({
 *     name: "percentageChance",
 *     type: CustomCommandParamType.Integer,
 *     mandatory: true
 * })
 *  
 * const commandParam = defineParameter({
 *     name: "command",
 *     type: CustomCommandParamType.String,
 *     mandatory: true
 * })
 *  
 * const chanceCommand = defineCommand({
 *     name: "chance",
 *     description: "Runs a command randomly, according to if generated number is less than percentage chance.",
 *     permissionLevel: CommandPermissionLevel.GameDirectors,
 *     cheatsRequired: true,
 *     parameters: [percentageChanceParameter, commandParam],
 *     callbackFunction: (origin, chance, command) => {
 *         // chance command function
 *     }
 * })
 * 
 */
export function defineCommand<const P extends CommandParameterInfo[]>(
    command: CommandInfo<P>
): CommandInfo<P> {
    const params = command.parameters ?? [];

    // Find first optional parameter
    const firstOptionalIndex = params.findIndex(p => !p.mandatory);

    // Runtime error because I cannot be bothered to make a compile time error
    // You only see the error once anyway. After that, you should know ;)
    if (firstOptionalIndex !== -1) {
        // Check if there are any mandatory after it
        const invalid = params.slice(firstOptionalIndex).some(p => p.mandatory);
        if (invalid) {
            throw new Error("command-wrapper error: mandatory parameters must appear before optional parameters.")
        }
    }
    
    return command;
}
