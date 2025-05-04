"use client";
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function UserActivity({ userId, adminId, onClose }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchUserActivity(page);
  }, [userId, page]);

  const fetchUserActivity = async (pageNum) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/user-activity?userId=${userId}&adminId=${adminId}&page=${pageNum}`);
      if (!res.ok) throw new Error('Failed to fetch user activity');
      const data = await res.json();
      setUserData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading && !userData) return <div className="p-6 text-center">Loading user activity...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">Error: {error}</div>;
  if (!userData) return <div className="p-6 text-center">No data available</div>;

  const { user, logs, stats, pagination } = userData;

  return (
    <div className="bg-white shadow-xl rounded-lg max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">User Activity: {user.name}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Close</button>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-medium mb-2">User Information</h3>
        <div className="grid grid-cols-1  gap-4">
          <div><span className="text-gray-500">Email:</span> {user.email}</div>
          <div><span className="text-gray-500">Role:</span> {user.role}</div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-2">Activity Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-600">Total Actions</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <h3 className="font-medium mb-2">Activity Log</h3>
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 border-b text-left">Action</th>
              <th className="py-2 px-4 border-b text-left">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="2" className="py-4 text-center text-gray-500">No activity logs found</td>
              </tr>
            ) : (
              logs.filter(log => log.action !== 'READ').map((log) => (
                <tr key={log._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      log.action === 'CREATE' ? 'bg-green-100 text-green-800' :
                      log.action === 'READ' ? 'bg-blue-100 text-blue-800' :
                      log.action === 'UPDATE' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>{log.action}</span>
                  </td>
                  <td className="py-2 px-4 border-b">{format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="inline-flex rounded-md shadow">
            <button
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded-l-md border ${
                page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              let pageNum;
              if (pagination.pages <= 5) pageNum = i + 1;
              else if (page <= 3) pageNum = i + 1;
              else if (page >= pagination.pages - 2) pageNum = pagination.pages - 4 + i;
              else pageNum = page - 2 + i;

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 border-t border-b ${
                    page === pageNum
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(Math.min(pagination.pages, page + 1))}
              disabled={page === pagination.pages}
              className={`px-3 py-1 rounded-r-md border ${
                page === pagination.pages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}