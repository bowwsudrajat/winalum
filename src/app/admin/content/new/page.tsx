'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import AdminLayout from '@/components/AdminLayout';

interface ContentForm {
  title: string;
  content: string;
  type: 'page' | 'post' | 'announcement';
  status: 'published' | 'draft';
}

export default function NewContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ContentForm>();

  if (status === 'loading') {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push('/admin/login');
    return null;
  }

  const onSubmit = async (data: ContentForm) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/admin/content');
      } else {
        alert('Error creating content');
      }
    } catch (error) {
      console.error('Error creating content:', error);
      alert('Error creating content');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
        <h1 className="h2">Add New Content</h1>
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
                        Creating...
                      </>
                    ) : (
                      'Create Content'
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
              <h5 className="card-title mb-0">Publishing Guidelines</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <h6>Content Types:</h6>
                <ul className="list-unstyled small">
                  <li><strong>Page:</strong> Static content like About, Contact</li>
                  <li><strong>Post:</strong> Blog posts and articles</li>
                  <li><strong>Announcement:</strong> Important notices</li>
                </ul>
              </div>
              
              <div className="mb-3">
                <h6>Status Options:</h6>
                <ul className="list-unstyled small">
                  <li><strong>Draft:</strong> Not visible to public</li>
                  <li><strong>Published:</strong> Live on the website</li>
                </ul>
              </div>

              <div className="alert alert-info small">
                <i className="bi bi-info-circle me-2"></i>
                Make sure to review your content before publishing it live.
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}