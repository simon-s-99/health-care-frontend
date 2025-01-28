'use client';
import ServerSideRequireAuth from '@/app/auth/RequireAuth'

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
