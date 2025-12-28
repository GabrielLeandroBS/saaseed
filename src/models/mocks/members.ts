import type {
  Member,
  MemberRoleOption,
} from "@/models/interfaces/components/generic/members";

export const getMembersMock = (): Member[] => [
  {
    id: "1",
    name: "Toby Belhome",
    email: "contact@bundui.io",
    role: "Viewer",
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: "2",
    name: "Jackson Lee",
    email: "pre@example.com",
    role: "Developer",
    avatar: "https://github.com/evilrabbit.png",
  },
  {
    id: "3",
    name: "Hally Gray",
    email: "hally@site.com",
    role: "Viewer",
    avatar: "https://github.com/maxleiter.png",
  },
];

export const getMemberRoleOptions = (): MemberRoleOption[] => [
  {
    value: "Viewer",
    label: "Viewer",
    description: "Can view and comment.",
  },
  {
    value: "Developer",
    label: "Developer",
    description: "Can view, comment and edit.",
  },
  {
    value: "Billing",
    label: "Billing",
    description: "Can view, comment and manage billing.",
  },
  {
    value: "Owner",
    label: "Owner",
    description: "Admin-level access to all resources.",
  },
];
