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
 * @param param The command parameter object.
 */
export function defineParameter<V extends readonly string[]>(
    param: CommandParameterInfoEnum<V>
): CommandParameterInfoEnum<V>;

/**
 * Defines a generic custom command parameter. 
 * @param param The command parameter object.
 */
export function defineParameter<T extends Exclude<CustomCommandParamType, CustomCommandParamType.Enum>>(
    param: CommandParameterInfoGeneric<T>
): CommandParameterInfoGeneric<T>;

export function defineParameter<
    P extends CommandParameterInfo
>(param: P): P {
    return param
}


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