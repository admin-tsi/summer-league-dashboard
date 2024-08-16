"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import DynamicBreadcrumbs from "@/components/share/breadcrumbPath";
import TeamCreation from "@/components/Tdashboard/teamCreation";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function Page() {
  const breadcrumbPaths = [
    { label: "Home", href: "/" },
    { label: "Dashboard" },
  ];
  const currentUser: any = useCurrentUser();

  // useEffect(() => {
  //   const checkToken = async () => {
  //     const newAccessToken = await verifyTokenExpiration(
  //       currentUser.accessToken,
  //       currentUser.refreshToken
  //     );
  //     if (newAccessToken) {
  //       console.log(Old access token: ${currentUser.accessToken});
  //       console.log(New access token: ${newAccessToken});
  //     } else {
  //       console.log("Impossible to get a new access token.");
  //     }
  //   };

  //   checkToken();
  // }, [currentUser.accessToken, currentUser.refreshToken]);

  return (
    <ContentLayout title="Dashboard">
      <DynamicBreadcrumbs paths={breadcrumbPaths} />
      <div className="w-full h-[85vh] flex justify-center items-center">
        {currentUser.role === "user" ? (
          <p>
            Hello {currentUser.firstName} {currentUser.lastName}, welcome to the
            platform for Summer League team managers. Your account is currently
            being validated. Our team is working diligently to complete this
            process as quickly as possible. Please check back in a few moments
            to see if your account has been validated.
          </p>
        ) : (
          <TeamCreation />
        )}
      </div>
    </ContentLayout>
  );
}
