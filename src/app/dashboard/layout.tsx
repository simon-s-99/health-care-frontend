import ServerSideRequireAuth from '@/components/ServerSideRequireAuth'

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
