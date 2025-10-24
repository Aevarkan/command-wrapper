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
import { CommandInfo, CommandParameterInfo, CommandParameterInfoEnum, CommandParameterInfoGeneric } from "types/CustomCommands";

/**
 * Defines an `Enum` command parameter.
 * @param param The command parameter object.
 */
export function createParameter<V extends readonly string[]>(
  param: CommandParameterInfoEnum<V>
): CommandParameterInfoEnum<V>;

/**
 * Defines a generic custom command parameter. 
 * @param param The command parameter object.
 */
export function createParameter<T extends Exclude<CustomCommandParamType, CustomCommandParamType.Enum>>(
  param: CommandParameterInfoGeneric<T>
): CommandParameterInfoGeneric<T>;

export function createParameter<
  P extends CommandParameterInfo
>(param: P): P {
  return param
}


export function createCommand<const P extends CommandParameterInfo[]>(
    command: CommandInfo<P>
): CommandInfo<P> {
    return command;
}