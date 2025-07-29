export interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'page' | 'post' | 'announcement';
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
  author: string;
}

// Mock data - in a real application, this would come from a database
let contentData: ContentItem[] = [
  {
    id: '1',
    title: 'Welcome to Winalum',
    content: 'This is the main welcome page content. Here you can introduce your organization and its mission.',
    type: 'page',
    status: 'published',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    author: 'Admin User'
  },
  {
    id: '2',
    title: 'About Us',
    content: 'Learn more about our organization, our history, and our commitment to excellence.',
    type: 'page',
    status: 'published',
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
    author: 'Admin User'
  },
  {
    id: '3',
    title: 'Latest News Update',
    content: 'Stay updated with the latest news and announcements from our organization.',
    type: 'post',
    status: 'published',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z',
    author: 'Admin User'
  },
  {
    id: '4',
    title: 'Important Announcement',
    content: 'This is an important announcement that all members should be aware of.',
    type: 'announcement',
    status: 'draft',
    createdAt: '2024-01-18T16:45:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    author: 'Admin User'
  }
];

export const getContentItems = (): ContentItem[] => {
  return contentData;
};

export const getContentItem = (id: string): ContentItem | undefined => {
  return contentData.find(item => item.id === id);
};

export const createContentItem = (item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): ContentItem => {
  const newItem: ContentItem = {
    ...item,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  contentData.push(newItem);
  return newItem;
};

export const updateContentItem = (id: string, updates: Partial<ContentItem>): ContentItem | null => {
  const index = contentData.findIndex(item => item.id === id);
  if (index === -1) return null;
  
  contentData[index] = {
    ...contentData[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return contentData[index];
};

export const deleteContentItem = (id: string): boolean => {
  const index = contentData.findIndex(item => item.id === id);
  if (index === -1) return false;
  
  contentData.splice(index, 1);
  return true;
};

export const getStats = () => {
  const total = contentData.length;
  const published = contentData.filter(item => item.status === 'published').length;
  const drafts = contentData.filter(item => item.status === 'draft').length;
  const pages = contentData.filter(item => item.type === 'page').length;
  const posts = contentData.filter(item => item.type === 'post').length;
  const announcements = contentData.filter(item => item.type === 'announcement').length;

  return {
    total,
    published,
    drafts,
    pages,
    posts,
    announcements
  };
};