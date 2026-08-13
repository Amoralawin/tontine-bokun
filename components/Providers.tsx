"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/lib/LanguageContext";
import { UserRoleProvider } from "@/lib/UserRoleContext";
import { GroupProvider } from "@/lib/GroupContext";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <LanguageProvider>
        <UserRoleProvider>
          <GroupProvider>
            {children}
            <Toaster position="bottom-right" richColors />
          </GroupProvider>
        </UserRoleProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
