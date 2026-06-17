import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbsProps {
  bcpPages: string[];
}

const Breadcrumbs = ({ bcpPages }: BreadcrumbsProps) => {
  return (
    <Breadcrumb className="fixed">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            className="text-white text-base hover:text-gray-500"
            href="/"
          >
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        {bcpPages.map((page) => (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white hover:text-white text-base">
                {page}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
