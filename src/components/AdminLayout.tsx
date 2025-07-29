'use client';

import { ReactNode } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <nav className="col-md-3 col-lg-2 d-md-block sidebar collapse">
          <div className="position-sticky pt-3">
            <div className="text-center mb-4">
              <h5 className="text-white">Winalum Admin</h5>
              <small className="text-muted">Welcome, {session?.user?.name}</small>
            </div>
            
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link 
                  href="/admin" 
                  className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                >
                  <i className="bi bi-house-door me-2"></i>
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  href="/admin/content" 
                  className={`nav-link ${isActive('/admin/content') ? 'active' : ''}`}
                >
                  <i className="bi bi-file-text me-2"></i>
                  Content Management
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  href="/admin/content/new" 
                  className={`nav-link ${isActive('/admin/content/new') ? 'active' : ''}`}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Content
                </Link>
              </li>
            </ul>

            <hr className="my-3" />
            
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link href="/" className="nav-link">
                  <i className="bi bi-arrow-left me-2"></i>
                  View Site
                </Link>
              </li>
              <li className="nav-item">
                <button 
                  onClick={() => signOut()} 
                  className="nav-link btn btn-link text-start w-100 border-0"
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="/admin">Admin</Link>
                </li>
                {pathname !== '/admin' && (
                  <li className="breadcrumb-item active" aria-current="page">
                    {pathname.split('/').pop()?.replace('-', ' ') || 'Page'}
                  </li>
                )}
              </ol>
            </nav>
          </div>
          
          {children}
        </main>
      </div>
    </div>
  );
}