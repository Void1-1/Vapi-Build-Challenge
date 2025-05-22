export function isCommand(text: string): boolean {
  return text.trim().startsWith("--");
}

/**
 * Parses and executes commands.
 * @param command The full command string including '--'
 * @returns An object with success status, optional message, and optional function flags
 */
export function handleCommand(command: string): {
  success: boolean;
  message?: string;
  clearChat?: boolean;
  emergencyColors?: boolean;
} {
  const parts = command.trim().slice(2).split(/\s+/); // remove '--', split by space
  const cmd = parts[0].toLowerCase();

  switch (cmd) {
    case "reset":
    case "reload":
      window.location.reload();
      return { success: true, message: "Page reloaded." };

    case "emergency":
    case "alarm":
    case "alert":
    case "!":
      return {
        success: true,
        message: "Emergency Mode Activated.",
        emergencyColors: true,
      };

    case "normal":
    case ".":
      return {
        success: true,
        message: "Emergency Mode Deactivated.",
        emergencyColors: false,
      };

    case "help":
      return {
        success: true,
        message:
          "Available commands: --reset or --reload, --help, --clear, --emergency, --normal",
      };

    case "clear":
      console.clear();
      return { success: true, message: "Console cleared.", clearChat: true };

    default:
      return { success: false, message: `Unknown command: ${cmd}` };
  }
}
