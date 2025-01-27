import NoAuthRedirectTo from '@/app/auth/NoAuthRedirectTo';
import useIsAuthorized from '@/hooks/useIsAuthorized';

export default function RequireRoles(
    { children, requiredRoles }:
        { children: React.ReactNode, requiredRoles: string[] }) {

    return (
        <>
            {
                useIsAuthorized(requiredRoles) ?
                    <>
                        {children}
                    </>
                    :
                    <NoAuthRedirectTo redirectUrl={"/"} />
            }
        </>
    )
}
