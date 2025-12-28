import { TeamData } from "./app-sidebar";

export interface TeamSwitcherProps extends React.HTMLAttributes<HTMLElement> {
  teams: TeamData[];
}
