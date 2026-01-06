import { FrontendRoutesEnum } from "@/models/enums/frontend-routes";
import { redirect } from "next/navigation";

/**
 * Home page component
 *
 * Main landing page for the application.
 * Displays a button that redirects to the sign-in page.
 *
 * @returns JSX element for home page
 */
export default async function Home() {
  return redirect(FrontendRoutesEnum.SIGN_IN);
}
