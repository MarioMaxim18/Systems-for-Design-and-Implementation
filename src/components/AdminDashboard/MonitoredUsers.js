import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function MonitoredUsers({ adminId, onViewActivity }) {
  const [monitoredUsers, setMonitoredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMonitoredUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/monitored-users?adminId=${adminId}`);
      const text = await res.text();

      if (!res.ok) throw new Error("Failed to fetch monitored users");

      const data = JSON.parse(text);
      setMonitoredUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminId) {
      fetchMonitoredUsers();
    }
  }, [adminId]);

  if (loading) return <div className="p-4">Loading monitored users...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Monitored Users</h2>

      {monitoredUsers.length === 0 ? (
        <p>No users are currently being monitored.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 border-b font-medium">User</th>
                <th className="py-3 px-6 border-b font-medium">Flagged</th>
                <th className="py-3 px-6 border-b font-medium">Reason</th>
                <th className="py-3 px-6 border-b font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {monitoredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    {user.userId ? (
                      <>
                        <div>{user.userId.name}</div>
                        <div className="text-sm text-gray-500">{user.userId.email}</div>
                      </>
                    ) : (
                      <span className="text-gray-500">Unknown User</span>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {formatDistanceToNow(new Date(user.flaggedAt), { addSuffix: true })}
                  </td>
                  <td className="py-2 px-4 border-b">{user.reason || 'Suspicious activity'}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex justify-center items-center h-full">
                      <button
                        onClick={() => onViewActivity(user.userId._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                      >
                        View Activity
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}