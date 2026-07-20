import { useSession } from "@/lib/actions/auth-actions";
import { useMemo } from "react";

type MyRole = "user" | "admin" | "superAdmin";

const useGetRole = () => {
  const { data: session, isPending } = useSession();

  const role = useMemo(() => {
    const role = session?.user?.role as MyRole;
    return { role, isPending };
  }, [session?.user?.role, isPending]);

  return role;
};

export default useGetRole;
