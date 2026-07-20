import { authClient } from "@/lib/actions/auth-actions";
import useGetRole from "./use-get-role";

const useHaveAccess = (permissions: Record<string, string[]>) => {
  const { role, isPending } = useGetRole();

  if (!isPending && !role) {
    return {
      hasPermissions: false,
      isPending,
    };
  }

  const hasPermissions = authClient.admin.checkRolePermission({
    permissions,
    role,
  });

  return {
    hasPermissions,
    isPending,
  };
};

export default useHaveAccess;
