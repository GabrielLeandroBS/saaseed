/**
 * Team switcher interfaces
 *
 * Interfaces for team switcher component props.
 */

import { TeamData } from "./app-sidebar";

/**
 * Props for TeamSwitcher component
 */
export interface TeamSwitcherProps extends React.HTMLAttributes<HTMLElement> {
  teams: TeamData[];
}
