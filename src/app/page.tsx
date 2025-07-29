'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ContentItem } from '@/lib/data';

export default function HomePage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicContent();
  }, []);

  const fetchPublicContent = async () => {
    try {
      // In a real app, you'd have a public API endpoint
      // For now, we'll simulate fetching published content
      const mockPublishedContent: ContentItem[] = [
        {
          id: '1',
          title: 'Welcome to Winalum',
          content: 'This is the main welcome page content. Here you can introduce your organization and its mission. We are committed to providing excellent service and building strong relationships with our community.',
          type: 'page',
          status: 'published',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          author: 'Admin User'
        },
        {
          id: '2',
          title: 'About Us',
          content: 'Learn more about our organization, our history, and our commitment to excellence. We have been serving our community for many years and continue to grow and evolve.',
          type: 'page',
          status: 'published',
          createdAt: '2024-01-16T14:30:00Z',
          updatedAt: '2024-01-16T14:30:00Z',
          author: 'Admin User'
        },
        {
          id: '3',
          title: 'Latest News Update',
          content: 'Stay updated with the latest news and announcements from our organization. We regularly share important updates and information with our community.',
          type: 'post',
          status: 'published',
          createdAt: '2024-01-17T09:15:00Z',
          updatedAt: '2024-01-17T09:15:00Z',
          author: 'Admin User'
        }
      ];
      
      setContent(mockPublishedContent);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const pages = content.filter(item => item.type === 'page');
  const posts = content.filter(item => item.type === 'post');
  const announcements = content.filter(item => item.type === 'announcement');

  return (
    <div>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link href="/" className="navbar-brand">
            <strong>Winalum</strong>
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link href="/" className="nav-link">Home</Link>
              </li>
              {pages.map(page => (
                <li key={page.id} className="nav-item">
                  <Link href={`/page/${page.id}`} className="nav-link">
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
            
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link href="/admin" className="nav-link">
                  <i className="bi bi-gear me-1"></i>
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-3">Welcome to Winalum</h1>
              <p className="lead mb-4">
                Your trusted platform for community engagement and information sharing. 
                Stay connected, stay informed, and be part of something greater.
              </p>
              <div className="d-flex gap-3">
                <Link href="/about" className="btn btn-light btn-lg">
                  Learn More
                </Link>
                <Link href="/admin" className="btn btn-outline-light btn-lg">
                  Admin Panel
                </Link>
              </div>
            </div>
            <div className="col-lg-4 text-center">
              <i className="bi bi-building" style={{ fontSize: '8rem', opacity: 0.8 }}></i>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container my-5">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row">
            {/* Main Content Area */}
            <div className="col-lg-8">
              {/* Latest Posts */}
              {posts.length > 0 && (
                <section className="mb-5">
                  <h2 className="h3 mb-4">Latest News</h2>
                  <div className="row">
                    {posts.map(post => (
                      <div key={post.id} className="col-md-6 mb-4">
                        <div className="card h-100">
                          <div className="card-body">
                            <h5 className="card-title">{post.title}</h5>
                            <p className="card-text">
                              {post.content.substring(0, 150)}...
                            </p>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">
                                {new Date(post.createdAt).toLocaleDateString()}
                              </small>
                              <Link href={`/post/${post.id}`} className="btn btn-primary btn-sm">
                                Read More
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Announcements */}
              {announcements.length > 0 && (
                <section className="mb-5">
                  <h2 className="h3 mb-4">Announcements</h2>
                  {announcements.map(announcement => (
                    <div key={announcement.id} className="alert alert-info">
                      <h5 className="alert-heading">{announcement.title}</h5>
                      <p className="mb-0">{announcement.content}</p>
                      <hr />
                      <small className="text-muted">
                        Posted on {new Date(announcement.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  ))}
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Quick Links</h5>
                </div>
                <div className="card-body">
                  <div className="list-group list-group-flush">
                    {pages.map(page => (
                      <Link 
                        key={page.id}
                        href={`/page/${page.id}`} 
                        className="list-group-item list-group-item-action"
                      >
                        {page.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card mt-4">
                <div className="card-header">
                  <h5 className="card-title mb-0">Administration</h5>
                </div>
                <div className="card-body">
                  <p className="card-text">
                    Access the admin panel to manage content and site settings.
                  </p>
                  <Link href="/admin" className="btn btn-primary">
                    <i className="bi bi-gear me-2"></i>
                    Admin Panel
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5>Winalum</h5>
              <p className="mb-0">Building stronger communities through connection and communication.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="mb-0">
                © 2024 Winalum. All rights reserved.
              </p>
              <Link href="/admin" className="text-white-50">
                Admin Access
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}