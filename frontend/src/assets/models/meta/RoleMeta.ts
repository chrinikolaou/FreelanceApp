import { Role } from "../Role";

type RoleMeta = {
    label: string,
    icon: string,
    color: string;
};

export const RoleMetaMap: Record<Role, RoleMeta> = {
    [Role.UI_DESIGNER]: {
      label: "UI Designer",
      icon: "🎨",
      color: "text-pink-500"
    },
    [Role.WEB_DEVELOPER]: {
      label: "Web Developer",
      icon: "💻",
      color: "text-blue-600"
    },
    [Role.DISCORD_BOT_DEVELOPER]: {
      label: "Discord Bot Developer",
      icon: "🤖",
      color: "text-indigo-500"
    },
    [Role.SOFTWARE_DEVELOPER]: {
      label: "Software Developer",
      icon: "🧑‍💻",
      color: "text-gray-700"
    },
    [Role.MOBILE_DEVELOPER]: {
      label: "Mobile Developer",
      icon: "📱",
      color: "text-yellow-500"
    },
    [Role.GAME_DEVELOPER]: {
      label: "Game Developer",
      icon: "🎮",
      color: "text-green-600"
    },
    [Role.GRAPHICS_DESIGNER]: {
      label: "Graphics Designer",
      icon: "🖌️",
      color: "text-purple-500"
    },
    [Role.VFX_DESIGNER]: {
      label: "VFX Designer",
      icon: "✨",
      color: "text-fuchsia-500"
    },
    [Role.ANIMATOR]: {
      label: "Animator",
      icon: "🎞️",
      color: "text-amber-600"
    },
    [Role.VIDEO_EDITOR]: {
      label: "Video Editor",
      icon: "🎬",
      color: "text-red-500"
    },
    [Role.CONTENT_WRITER]: {
      label: "Content Writer",
      icon: "✍️",
      color: "text-blue-700"
    }
  };
