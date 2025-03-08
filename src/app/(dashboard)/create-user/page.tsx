"use client";

import CreateUserForm from "@/components/auth/create-user-form";

export default function CreateUserPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">User Management</h1>
        <CreateUserForm />
      </main>
    </div>
  );
}
