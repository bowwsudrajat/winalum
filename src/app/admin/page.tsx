'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

interface Stats {
  total: number;
  published: number;
  drafts: number;
  pages: number;
  posts: number;
  announcements: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/admin/login');
      return;
    }

    fetchStats();
  }, [session, status, router]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
        <h1 className="h2">Dashboard</h1>
      </div>

      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card stats-card">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h3>{stats?.total || 0}</h3>
                  <p className="mb-0">Total Content</p>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-file-text" style={{ fontSize: '2rem' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h3>{stats?.published || 0}</h3>
                  <p className="mb-0">Published</p>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-check-circle" style={{ fontSize: '2rem' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h3>{stats?.drafts || 0}</h3>
                  <p className="mb-0">Drafts</p>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-pencil" style={{ fontSize: '2rem' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h3>{stats?.pages || 0}</h3>
                  <p className="mb-0">Pages</p>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-file-earmark" style={{ fontSize: '2rem' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Content Overview</h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-4">
                  <h4 className="text-primary">{stats?.pages || 0}</h4>
                  <p className="text-muted">Pages</p>
                </div>
                <div className="col-md-4">
                  <h4 className="text-success">{stats?.posts || 0}</h4>
                  <p className="text-muted">Posts</p>
                </div>
                <div className="col-md-4">
                  <h4 className="text-warning">{stats?.announcements || 0}</h4>
                  <p className="text-muted">Announcements</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <a href="/admin/content/new" className="btn btn-primary">
                  <i className="bi bi-plus-circle me-2"></i>
                  Add New Content
                </a>
                <a href="/admin/content" className="btn btn-outline-secondary">
                  <i className="bi bi-list me-2"></i>
                  Manage Content
                </a>
                <a href="/" className="btn btn-outline-info">
                  <i className="bi bi-eye me-2"></i>
                  View Site
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}