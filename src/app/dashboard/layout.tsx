import ServerSideRequireAuth from '@/components/auth/ServerSideRequireAuth'

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <ServerSideRequireAuth>
        {children}
      </ServerSideRequireAuth>
    </div>
  )
}
