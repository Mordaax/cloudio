import { GetCloudResources, GetPublicCloudResources } from "@/actions/form";
import CreateCloudResourceBtn from "@/components/CreateCloudResourceBtn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistance } from "date-fns";
import Link from "next/link";
import { Suspense } from "react";
/* import { ReactNode, Suspense } from "react"; 
import { HiCursorClick } from "react-icons/hi";
import { TbArrowBounce } from "react-icons/tb";*/
import { BiRightArrowAlt } from "react-icons/bi";
import { FaWpforms } from "react-icons/fa";

import { LuView } from "react-icons/lu";


export default function Home() {
  return (
    <div className="container pt-4">
      {/* TODO: <Suspense fallback={<StatsCards loading={true} />}>
        <CardStatsWrapper />
      </Suspense> */}
      {/* <Separator className="my-6" /> */}
      <h2 className="text-3xl font-bold col-span-2">Your Cloud Resources</h2>
      <p>Host your services or create a vulnerable machine</p>
      <Separator className="my-6" />
      <div className="grid gric-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <CreateCloudResourceBtn/>
        
        <Suspense
          fallback={[1, 2, 3, 4].map((el) => (
            <FormCardSkeleton key={el} />
          ))}
        >
          
          <CloudResourceCards/>
        </Suspense>
      </div>

      
      <h2 className="text-3xl font-bold col-span-2">Public Vulnerable Machines</h2>
      <p>Vulnerable machines made by other users</p>
      <Separator className="my-6" />
      <div className="grid gric-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Suspense
          fallback={[1, 2, 3, 4].map((el) => (
            <FormCardSkeleton key={el} />
          ))}
        >
          <PublicCloudResourceCards/>
        </Suspense>
      </div>
    </div>

    
  );
}



/*

interface StatsCardProps {
  data?: Awaited<ReturnType<typeof GetFormStats>>;
  loading: boolean;
}

async function CardStatsWrapper() {
  const stats = await GetFormStats();
  return <StatsCards loading={false} data={stats} />;
}


function StatsCards(props: StatsCardProps) {
  const { data, loading } = props;

  return (
    <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total visits"
        icon={<LuView className="text-blue-600" />}
        helperText="All time machine visits"
        value={data?.visits.toLocaleString() || ""}
        loading={loading}
        className="shadow-md shadow-blue-600"
      />

      <StatsCard
        title="Total submissions"
        icon={<FaWpforms className="text-yellow-600" />}
        helperText="All number machine solves"
        value={data?.submissions.toLocaleString() || ""}
        loading={loading}
        className="shadow-md shadow-yellow-600"
      />

      <StatsCard
        title="Passing rate"
        icon={<HiCursorClick className="text-green-600" />}
        helperText="Percentage of successful solves"
        value={data?.submissionRate.toLocaleString() + "%" || ""}
        loading={loading}
        className="shadow-md shadow-green-600"
      />

      <StatsCard
        title="Privsec rate"
        icon={<TbArrowBounce className="text-red-600" />}
        helperText="Percentage of successful priviledge escalation solves"
        value={data?.submissionRate.toLocaleString() + "%" || ""}
        loading={loading}
        className="shadow-md shadow-red-600"
      />
    </div>
  );
}

export function StatsCard({
  title,
  value,
  icon,
  helperText,
  loading,
  className,
}: {
  title: string;
  value: string;
  helperText: string;
  className: string;
  loading: boolean;
  icon: ReactNode;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading && (
            <Skeleton>
              <span className="opacity-0">0</span>
            </Skeleton>
          )}
          {!loading && value}
        </div>
        <p className="text-xs text-muted-foreground pt-1">{helperText}</p>
      </CardContent>
    </Card>
  );
} */

function FormCardSkeleton() {
  return <Skeleton className="border-2 border-primary-/20 h-[190px] w-full" />;
}



async function CloudResourceCards() {
  const cloudresources = await GetCloudResources();
  return (
    <>
      {cloudresources.map((cloudresource) => (
        <CloudResourceCard key={cloudresource.id} cardResource={cloudresource} />
      ))}
    </>
  );
}

function CloudResourceCard({ cardResource }: { cardResource: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <span className="truncate font-bold">{cardResource.name}</span>
          {cardResource.running && <Badge>Running</Badge>}
          {!cardResource.running && <Badge variant={"destructive"}>Not Running</Badge>}
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
          {formatDistance(cardResource.createdAt, new Date(), {
            addSuffix: true,
          })}
          {cardResource.running && (
            <span className="flex items-center gap-2">
              <LuView className="text-muted-foreground" />
              <span>{cardResource.visits.toLocaleString()}</span>
              <FaWpforms className="text-muted-foreground" />
              {/* <span>{cardResource.logs.toLocaleString()}</span> */}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
        {cardResource.description || "No description"}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full mt-2 text-md gap-4">
            <Link href={`/manage-resource/${cardResource.id}`}>
              Manage Resource <BiRightArrowAlt />
            </Link>
          </Button>
       
       
      </CardFooter>
    </Card>
  );
}


async function PublicCloudResourceCards() {
  const cloudresources = await GetPublicCloudResources();
  return (
    <>
      {cloudresources.map((cloudresource) => (
        <PublicCloudResourceCard key={cloudresource.id} cardResource={cloudresource} />
      ))}
    </>
  );
}

function PublicCloudResourceCard({ cardResource }: { cardResource: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <span className="truncate font-bold">{cardResource.name}</span>
          {cardResource.running && <Badge>Running</Badge>}
          {!cardResource.running && <Badge variant={"destructive"}>Not Running</Badge>}
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
          {formatDistance(cardResource.createdAt, new Date(), {
            addSuffix: true,
          })}
          {cardResource.running && (
            <span className="flex items-center gap-2">
              <LuView className="text-muted-foreground" />
              <span>{cardResource.visits.toLocaleString()}</span>
              <FaWpforms className="text-muted-foreground" />
              {/* <span>{cardResource.logs.toLocaleString()}</span> */}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
        {cardResource.description || "No description"}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full mt-2 text-md gap-4">
            <Link href={`/public-resource/${cardResource.publicId}`}>
              Access Challenge
            </Link>
          </Button>
       
       
      </CardFooter>
    </Card>
  );
}