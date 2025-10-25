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


import { BlockType, CommandPermissionLevel, CustomCommandOrigin, CustomCommandParamType, Entity, EntityType, ItemType, Player, Vector3 } from "@minecraft/server";

export interface CommandInfo<P extends CommandParameterInfo[] = CommandParameterInfo[]> {
    /**
     * The callback function the command should run.
     * @remarks This function should throw an error or return false to indicate command failure.
     * 
     * @remarks Callbacks happen in read-only mode.
     * 
     */
    callbackFunction: CommandCallback<P>
    /**
     * @remarks
     * Message displayed to chat after successful command execution.
     *
     */
    successMessage?: string
    /**
     * @remarks
     * Message displayed to chat after unsuccessful command execution.
     *
     */
    failureMessage?: string
    /**
     * @remarks
     * Whether or not cheats must be enabled to run the command.
     * 
     * Uses configuration setting if not specified.
     * 
     */
    cheatsRequired?: boolean
    /**
     * @remarks
     * The name of the command. The namespace will be added automatically.
     *
     */
    name: string
    /**
     * @remarks
     * Command description as seen on the command line.
     *
     */
    description: string
    /**
     * @remarks
     * The permission level required to execute the command.
     * 
     * Uses configuration setting if not specified.
     *
     */
    permissionLevel?: CommandPermissionLevel
    /**
     * @remarks
     * List of command parameters.
     *
     */
    parameters?: P
}

type CommandParameterArgumentMap<T extends CommandParameterInfo> =
    T extends CommandParameterInfoEnum ? T['values'][number] :
    T['type'] extends CustomCommandParamType.BlockType ? BlockType :
    T['type'] extends CustomCommandParamType.Boolean ? boolean :
    T['type'] extends CustomCommandParamType.EntitySelector ? Entity[] :
    T['type'] extends CustomCommandParamType.EntityType ? EntityType :
    T['type'] extends CustomCommandParamType.Float ? number :
    T['type'] extends CustomCommandParamType.Integer ? number :
    T['type'] extends CustomCommandParamType.ItemType ? ItemType :
    T['type'] extends CustomCommandParamType.Location ? Vector3 :
    T['type'] extends CustomCommandParamType.PlayerSelector ? Player[] :
    T['type'] extends CustomCommandParamType.String ? string :
    unknown;

type CommandParameterMap<T extends CommandParameterInfo[]> = {
  [K in keyof T]: T[K] extends CommandParameterInfo ? CommandParameterArgumentMap<T[K]> : never;
};

type CommandCallback<P extends CommandParameterInfo[]> =
    (origin: CustomCommandOrigin, ...args: CommandParameterMap<P>) => void | boolean;

/**
 * Information of the command parameter.
 */
export type CommandParameterInfo = CommandParameterInfoGeneric<any> | CommandParameterInfoEnum

interface CommandParameterInfoBase {
    /**
     * @remarks
     * The name of parameter as it appears on the command line.
     *
     */
    name: string
    /**
     * @remarks
     * Whether the parameter is mandatory for the command.
     */
    mandatory: boolean
}

export interface CommandParameterInfoGeneric<T extends Exclude<CustomCommandParamType, CustomCommandParamType.Enum>> extends CommandParameterInfoBase {
    /**
     * @remarks
     * The data type of the parameter.
     *
     */
    type: T
    values?: never
}

export interface CommandParameterInfoEnum<V extends readonly string[] = readonly string[]> extends CommandParameterInfoBase {
    /**
     * @remarks
     * The data type of the parameter.
     *
     */
    type: CustomCommandParamType.Enum
    /**
     * @remarks
     * Values that the enum expects.
     */
    values: V
}
