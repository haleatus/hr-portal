import React from "react";

const ReviewNotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Review Summary not found
        </h2>
        <p className="text-gray-700">
          {`The review you're looking for doesn't exist or you don't have
          permission to view it.`}
        </p>
      </div>
    </div>
  );
};

export default ReviewNotFound;
