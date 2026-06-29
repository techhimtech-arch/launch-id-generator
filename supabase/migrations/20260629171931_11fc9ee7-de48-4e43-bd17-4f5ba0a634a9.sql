REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;

REVOKE EXECUTE ON FUNCTION public.is_subscribed(uuid) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.is_subscribed(uuid) FROM anon;