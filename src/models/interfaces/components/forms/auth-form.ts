/**
 * Auth form interfaces
 *
 * Interfaces for authentication form component props.
 */

import type { DictionaryType } from "@/models/types/i18n";
import type { AuthFormMode } from "@/models/types/components/forms";

/**
 * Props for AuthForm component
 */
export interface AuthFormProps extends React.ComponentProps<"div"> {
  mode: AuthFormMode;
  translation: DictionaryType;
  token?: string;
}
