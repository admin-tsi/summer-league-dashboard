import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react";
import { Overview } from "@/components/overview";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import CustomBreadcrumb from "@/components/custom-breadcumb";

export default function Page() {
  return (
    <ContentLayout title="Dashboard">
      <CustomBreadcrumb />
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full rounded-none justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="earning">Earning</TabsTrigger>
        </TabsList>
        <Separator />
        <TabsContent value="overview">
          <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Subscriptions
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+2350</div>
                  <p className="text-xs text-muted-foreground">
                    +180.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sales</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+12,234</div>
                  <p className="text-xs text-muted-foreground">
                    +19% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Now
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+573</div>
                  <p className="text-xs text-muted-foreground">
                    +201 since last hour
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
              <Card className="xl:col-span-2">
                <CardHeader className="flex flex-row items-center">
                  <div className="grid gap-2">
                    <CardTitle>Transactions</CardTitle>
                    <CardDescription>
                      Recent transactions from your store.
                    </CardDescription>
                  </div>
                  <Button className="ml-auto gap-1" variant="outline">
                    View All
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <Overview />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-8">
                  <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage
                        src="https://i.pinimg.com/564x/72/d7/cc/72d7cc32e51ef9c829011bb9bf84f36a.jpg"
                        alt="Avatar"
                        className="object-cover"
                      />
                      <AvatarFallback>OM</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        Olivia Martin
                      </p>
                      <p className="text-sm text-muted-foreground">
                        olivia.martin@email.com
                      </p>
                    </div>
                    <div className="ml-auto font-medium">+$1,999.00</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage
                        src="https://i.pinimg.com/564x/72/d7/cc/72d7cc32e51ef9c829011bb9bf84f36a.jpg"
                        alt="Avatar"
                        className="object-cover"
                      />
                      <AvatarFallback>JL</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        Jackson Lee
                      </p>
                      <p className="text-sm text-muted-foreground">
                        jackson.lee@email.com
                      </p>
                    </div>
                    <div className="ml-auto font-medium">+$39.00</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage
                        src="https://i.pinimg.com/564x/72/d7/cc/72d7cc32e51ef9c829011bb9bf84f36a.jpg"
                        alt="Avatar"
                        className="object-cover"
                      />
                      <AvatarFallback>IN</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        Isabella Nguyen
                      </p>
                      <p className="text-sm text-muted-foreground">
                        isabella.nguyen@email.com
                      </p>
                    </div>
                    <div className="ml-auto font-medium">+$299.00</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage
                        src="https://i.pinimg.com/564x/72/d7/cc/72d7cc32e51ef9c829011bb9bf84f36a.jpg"
                        alt="Avatar"
                        className="object-cover"
                      />
                      <AvatarFallback>WK</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        William Kim
                      </p>
                      <p className="text-sm text-muted-foreground">
                        will@email.com
                      </p>
                    </div>
                    <div className="ml-auto font-medium">+$99.00</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage
                        src="https://i.pinimg.com/564x/72/d7/cc/72d7cc32e51ef9c829011bb9bf84f36a.jpg"
                        alt="Avatar"
                        className="object-cover"
                      />
                      <AvatarFallback>SD</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        Sofia Davis
                      </p>
                      <p className="text-sm text-muted-foreground">
                        sofia.davis@email.com
                      </p>
                    </div>
                    <div className="ml-auto font-medium">+$39.00</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="courses">
          <h6>i</h6>
        </TabsContent>
      </Tabs>
    </ContentLayout>
  );
}
