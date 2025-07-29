'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { ContentItem } from '@/lib/data';

export default function ContentManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'page' | 'post' | 'announcement'>('all');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/admin/login');
      return;
    }

    fetchContent();
  }, [session, status, router]);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content');
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const response = await fetch(`/api/content/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setContent(content.filter(item => item.id !== id));
      } else {
        alert('Error deleting content');
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Error deleting content');
    }
  };

  const filteredContent = content.filter(item => {
    const statusMatch = filter === 'all' || item.status === filter;
    const typeMatch = typeFilter === 'all' || item.type === typeFilter;
    return statusMatch && typeMatch;
  });

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
        <h1 className="h2">Content Management</h1>
        <Link href="/admin/content/new" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Add New Content
        </Link>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h5 className="card-title mb-0">All Content</h5>
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-6">
                  <select 
                    className="form-select form-select-sm"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <select 
                    className="form-select form-select-sm"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as any)}
                  >
                    <option value="all">All Types</option>
                    <option value="page">Pages</option>
                    <option value="post">Posts</option>
                    <option value="announcement">Announcements</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          {filteredContent.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-file-text" style={{ fontSize: '3rem', color: '#dee2e6' }}></i>
              <p className="text-muted mt-3">No content found</p>
              <Link href="/admin/content/new" className="btn btn-primary">
                Create your first content
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Author</th>
                    <th>Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContent.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div>
                          <strong>{item.title}</strong>
                          <div className="content-preview text-muted small">
                            {item.content.substring(0, 100)}...
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${
                          item.type === 'page' ? 'bg-primary' :
                          item.type === 'post' ? 'bg-success' :
                          'bg-warning'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${
                          item.status === 'published' ? 'bg-success' : 'bg-secondary'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td>{item.author}</td>
                      <td>
                        <small className="text-muted">
                          {new Date(item.updatedAt).toLocaleDateString()}
                        </small>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link 
                            href={`/admin/content/edit/${item.id}`}
                            className="btn btn-outline-primary"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="btn btn-outline-danger"
                          >
                            <i className="bi bi-trash"></i>
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
      </div>
    </AdminLayout>
  );
}