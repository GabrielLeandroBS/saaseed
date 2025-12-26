import { getDictionary } from "@/lib/get/dictionaries";

import { ParamsProps } from "@/models/interfaces/params";

export default async function SearchPage({ params }: ParamsProps) {
  const { lang } = await params;

  const dict = await getDictionary(lang);

  return (
    <div className="flex-1 items-center flex h-full justify-center">
      {dict.dashboard.title}
    </div>
  );
}
