import { invitationsService } from "@/services/invitations.service";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { PaginationState, SortingState } from "@tanstack/react-table";

export interface UseGetInvitations {
  pagination: PaginationState;
  sorting: SortingState;
  search?: string;
}

const useGetInvitations = ({
  pagination,
  sorting,
  search,
}: UseGetInvitations) => {
  const { data, isFetching, isError } = useQuery({
    queryKey: ["invitations", pagination, sorting, search],
    queryFn: () => invitationsService.getAll({ pagination, sorting, search }),
    placeholderData: keepPreviousData,
  });

  return { data, isError, isFetching };
};

export default useGetInvitations;
