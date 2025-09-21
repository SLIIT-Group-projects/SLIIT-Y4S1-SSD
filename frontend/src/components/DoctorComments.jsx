import React from "react";

function DoctorComments({ comments }) {
  return (
    <div className="mt-6 bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold">Doctor Comments</h3>
      {comments.map((comment, index) => (
        <div key={index} className="border-t mt-4 pt-4">
          <p className="font-bold">{comment.doctorName}</p>
          <p>{comment.comment}</p>
          <p className="text-sm text-gray-500">
            {new Date(comment.date).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default DoctorComments;
