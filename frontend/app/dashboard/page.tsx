import React from "react";

"use client";
import { ProposalsList } from "@/components/PublicFundManagement/ProposalsList";
import { Dashboard } from "@/components/PublicFundManagement/Dashboard";
import { Notification } from "@/components/PublicFundManagement/Notification";

export default function DashboardPage() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Public Fund Management Dashboard</h1>
      <Notification message="Welcome to the dashboard!" type="success" />
      <Dashboard address="" proposals={[]} contractBalance={"0"} />
      <ProposalsList proposals={[]} isAdmin={false} showNotification={() => {}} onError={() => {}} />
    </main>
  );
}
