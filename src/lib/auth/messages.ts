import { DictionaryType } from "@/lib/get/dictionaries";

export const authErrorMessages = ({
  error,
  translation,
}: {
  error: string;
  translation: DictionaryType;
}) => {
  switch (error) {
    case "Invalid credentials":
      return translation?.errors.signInFailed;
    default:
      return translation?.errors.failedRequest;
  }
};
