import { DictionaryType } from "@/lib/get/dictionaries";

export type MemberRole = "Owner" | "Developer" | "Viewer" | "Billing";

export interface MemberRoleOption {
  value: MemberRole;
  label: string;
  description: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  avatar?: string;
}

export interface MembersProps extends React.HTMLAttributes<HTMLDivElement> {
  members: Member[];
  translation?: DictionaryType;
}
