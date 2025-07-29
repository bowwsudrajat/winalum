'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import AdminLayout from '@/components/AdminLayout';
import { ContentItem } from '@/lib/data';

interface ContentForm {
  title: string;
  content: string;
  type: 'page' | 'post' | 'announcement';
  status: 'published' | 'draft';
}

export default function EditContent({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contentItem, setContentItem] = useState<ContentItem | null>(null);
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ContentForm>();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/admin/login');
      return;
    }

    fetchContent();
  }, [session, status, router, params.id]);

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/content/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setContentItem(data);
        
        // Set form values
        setValue('title', data.title);
        setValue('content', data.content);
        setValue('type', data.type);
        setValue('status', data.status);
      } else {
        router.push('/admin/content');
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      router.push('/admin/content');
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

  if (!session || !contentItem) {
    return null;
  }

  const onSubmit = async (data: ContentForm) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/content/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/admin/content');
      } else {
        alert('Error updating content');
      }
    } catch (error) {
      console.error('Error updating content:', error);
      alert('Error updating content');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
        <h1 className="h2">Edit Content</h1>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Content Details</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input
                    type="text"
                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                    id="title"
                    {...register('title', { required: 'Title is required' })}
                  />
                  {errors.title && (
                    <div className="invalid-feedback">
                      {errors.title.message}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="content" className="form-label">Content</label>
                  <textarea
                    className={`form-control ${errors.content ? 'is-invalid' : ''}`}
                    id="content"
                    rows={10}
                    {...register('content', { required: 'Content is required' })}
                  ></textarea>
                  {errors.content && (
                    <div className="invalid-feedback">
                      {errors.content.message}
                    </div>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="type" className="form-label">Type</label>
                      <select
                        className={`form-select ${errors.type ? 'is-invalid' : ''}`}
                        id="type"
                        {...register('type', { required: 'Type is required' })}
                      >
                        <option value="">Select type</option>
                        <option value="page">Page</option>
                        <option value="post">Post</option>
                        <option value="announcement">Announcement</option>
                      </select>
                      {errors.type && (
                        <div className="invalid-feedback">
                          {errors.type.message}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="status" className="form-label">Status</label>
                      <select
                        className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                        id="status"
                        {...register('status', { required: 'Status is required' })}
                      >
                        <option value="">Select status</option>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                      {errors.status && (
                        <div className="invalid-feedback">
                          {errors.status.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : (
                      'Update Content'
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Content Info</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <small className="text-muted">Created:</small>
                <div>{new Date(contentItem.createdAt).toLocaleString()}</div>
              </div>
              
              <div className="mb-3">
                <small className="text-muted">Last Updated:</small>
                <div>{new Date(contentItem.updatedAt).toLocaleString()}</div>
              </div>

              <div className="mb-3">
                <small className="text-muted">Author:</small>
                <div>{contentItem.author}</div>
              </div>

              <div className="alert alert-info small">
                <i className="bi bi-info-circle me-2"></i>
                Changes will be saved immediately when you click Update.
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}