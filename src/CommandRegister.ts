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

import { CommandPermissionLevel, CustomCommand, CustomCommandOrigin, CustomCommandParamType, CustomCommandResult, CustomCommandStatus, system } from "@minecraft/server"
import { CommandInfo, CommandParameterInfo } from "./types"

export class CommandRegister {

    private defaultPermissionLevel: CommandPermissionLevel
    private cheatsRequired: boolean

    private commandNamespacePrefix: string
    private commandsToRegister: CommandInfo[] = []

    /**
     * The command register instance.
     * @param namespace The namespace that will be prefixed onto registered commands.
     * @param defaultPermissionLevel The permission level required to call registered commands. Overriden by individual command properties.
     * @param cheatsRequired Whether commands will require cheats to run. Overriden by individual command properties.
     * 
     * @remarks
     * This should be created in the global scope, and during early execution.
     */
    public constructor(namespace: string, defaultPermissionLevel?: CommandPermissionLevel, cheatsRequired?: boolean) {
        this.commandNamespacePrefix = namespace
        this.defaultPermissionLevel = defaultPermissionLevel ?? CommandPermissionLevel.GameDirectors
        this.cheatsRequired = cheatsRequired ?? true
        this._registerCommands()
    }

    /**
     * Register a new command.
     * @param commandInfo The command info object.
     */
    public registerCommand<const P extends CommandParameterInfo[]>(commandInfo: CommandInfo<P>) {
        this.commandsToRegister.push(commandInfo as CommandInfo<CommandParameterInfo[]>)
    }

    /**
     * Registers all custom commands.
     * 
     * @internal
     * This should only be run in main after all commands are registered.
     */
    private _registerCommands() {
        system.beforeEvents.startup.subscribe(event => {
            const commandRegistry = event.customCommandRegistry

            // Register each command put in the register
            this.commandsToRegister.forEach(command => {

                // register any enums first
                const enumParameters = command.parameters?.filter(p => p.type === CustomCommandParamType.Enum)
                enumParameters?.forEach(enumParameter => {
                    const namespacedEnumName = this.commandNamespacePrefix + ":" + enumParameter.name
                    // Spreading to suppress readonly error. This is only a TypeScript error.
                    if (!enumParameter.values) {
                        throw new Error("command-wrapper error: enum parameter needs to have values!")
                    }
                    commandRegistry.registerEnum(namespacedEnumName, [...enumParameter.values])
                })

                const namespacedName = this.commandNamespacePrefix + ":" + command.name

                const permissionLevel = command.permissionLevel ?? this.defaultPermissionLevel
                const cheatsRequired = command.cheatsRequired ?? this.cheatsRequired

                const customCommand: CustomCommand = {
                    name: namespacedName,
                    description: command.description,
                    permissionLevel: permissionLevel,
                    cheatsRequired: cheatsRequired,
                    mandatoryParameters: command.parameters?.filter(p => p.mandatory),
                    optionalParameters: command.parameters?.filter(p => !p.mandatory)
                }

                function callbackWrapper(origin: CustomCommandOrigin, ...args: any[]): CustomCommandResult {
                    try {
                        const result = command.callbackFunction(origin, ...args)

                        // If the command returns false, then it's also a failure (instead of throwing an error)
                        if (result === false) {
                            return { message: command.failureMessage, status: CustomCommandStatus.Failure }
                        } else {
                            return { message: command.successMessage, status: CustomCommandStatus.Success }
                        }
                    } catch (error) {
                        return { message: command.failureMessage, status: CustomCommandStatus.Failure }
                    }
                }

                commandRegistry.registerCommand(customCommand, callbackWrapper)
            })
            
        })
    }

}