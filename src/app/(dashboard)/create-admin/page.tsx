"use client";

import CreateAdminForm from "@/components/auth/create-admin-form";

export default function CreateAdminPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Admin Management
        </h1>
        <CreateAdminForm />
      </main>
    </div>
  );
}
