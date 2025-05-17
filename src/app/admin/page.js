'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MonitoredUsers from '../../components/AdminDashboard/MonitoredUsers';
import UserActivity from '../../components/AdminDashboard/UserActivity';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewingUserId, setViewingUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
          <h2 className="text-lg font-medium">Security Monitoring</h2>
        </div>

        {viewingUserId ? (
          <UserActivity
            userId={viewingUserId}
            adminId={user._id || user.userId}
            onClose={() => setViewingUserId(null)}
          />
        ) : (
          <MonitoredUsers
            adminId={user._id || user.userId}
            onViewActivity={(userId) => setViewingUserId(userId)}
          />
        )}
      </div>
    </div>
  );
}