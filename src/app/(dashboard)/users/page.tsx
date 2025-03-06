import Image from "next/image";
import React from "react";

const users = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Alice Johnson", email: "alice@example.com" },
  { id: 4, name: "Bob Brown", email: "bob@example.com" },
];

const UsersPage = () => {
  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {users.map((user) => (
        <div key={user.id} className="bg-white p-3 rounded-lg shadow-md flex flex-col items-center text-center text-sm">
          <Image
            src="/placeholder.svg"
            alt="User"
            className="w-16 h-16 rounded-full mb-2"
            width={64}
            height={64}
          />
          <h3 className="font-medium">{user.name}</h3>
          <p className="text-gray-500 text-xs">{user.email}</p>
        </div>
      ))}
    </div>
  );
};

export default UsersPage;