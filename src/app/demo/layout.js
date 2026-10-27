import { WorkspaceProvider } from '@/components/workspace';

export const metadata = { title: 'Demonstração', robots: { index: false } };

export default function Layout({ children }) {
  return <WorkspaceProvider mode="demo">{children}</WorkspaceProvider>;
}
