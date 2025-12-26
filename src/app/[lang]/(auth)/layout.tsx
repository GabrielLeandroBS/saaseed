import { Rocket } from "lucide-react";

import { LayoutProps } from "@/models/types/layout";

const AuthLayout = async ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Rocket className="size-4" />
          </div>
          Template
        </div>

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
