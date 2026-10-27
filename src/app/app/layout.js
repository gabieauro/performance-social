import { WorkspaceProvider } from '@/components/workspace';

export const metadata = { title: 'Meus Clientes', robots: { index: false } };

export default function Layout({ children }) {
  return <WorkspaceProvider mode="cloud">{children}</WorkspaceProvider>;
}
