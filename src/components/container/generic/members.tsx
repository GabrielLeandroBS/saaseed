"use client";

import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Combobox } from "@/components/container/generic/combobox";
import { avatarFallback, cn } from "@/lib/utils";
import type { MembersProps } from "@/models/interfaces/components/generic/members";

const Members = React.memo(function Members({
  members: initialMembers,
  translation,
  className,
  ...props
}: MembersProps) {
  const [members, setMembers] = React.useState(initialMembers);

  const roleOptions = React.useMemo(() => {
    const roles = translation?.dashboard?.members?.roles;
    if (!roles) return [];

    return [
      {
        value: "Viewer" as const,
        label: roles.viewer.label,
        description: roles.viewer.description,
      },
      {
        value: "Developer" as const,
        label: roles.developer.label,
        description: roles.developer.description,
      },
      {
        value: "Billing" as const,
        label: roles.billing.label,
        description: roles.billing.description,
      },
      {
        value: "Owner" as const,
        label: roles.owner.label,
        description: roles.owner.description,
      },
    ];
  }, [translation?.dashboard?.members?.roles]);

  const handleRoleChange = React.useCallback(
    (memberId: string, newRole: MembersProps["members"][0]["role"]) => {
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)),
      );
    },
    [],
  );

  const comboboxTranslations = React.useMemo(
    () => ({
      searchPlaceholder: translation?.dashboard?.members?.searchPlaceholder,
      emptyMessage: translation?.dashboard?.members?.emptyMessage,
    }),
    [
      translation?.dashboard?.members?.searchPlaceholder,
      translation?.dashboard?.members?.emptyMessage,
    ],
  );

  const createRoleChangeHandler = React.useCallback(
    (memberId: string) => (value: string) => {
      handleRoleChange(memberId, value as MembersProps["members"][0]["role"]);
    },
    [handleRoleChange],
  );

  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader>
        <CardTitle>
          <Text as="h2" size="base" weight="medium">
            {translation?.dashboard?.members?.title || "Members"}
          </Text>
        </CardTitle>
        <CardDescription>
          <Text as="p" size="sm" color="muted">
            {translation?.dashboard?.members?.description ||
              "Invite your team members to collaborate."}
          </Text>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={member.avatar}
                    alt={`${member.name} avatar`}
                  />
                  <AvatarFallback>{avatarFallback(member.name)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <Text as="span" size="sm" weight="medium">
                    {member.name}
                  </Text>
                  <Text as="span" size="sm" color="muted">
                    {member.email}
                  </Text>
                </div>
              </div>
              <Combobox
                options={roleOptions}
                value={member.role}
                translations={comboboxTranslations}
                onSelect={createRoleChangeHandler(member.id)}
                align="end"
                side="bottom"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

Members.displayName = "Members";

export { Members };
