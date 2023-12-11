//import { GetFormById, GetFormWithSubmissions } from "@/actions/form";
import FormLinkShare from "@/components/FormLinkShare";
//import VisitBtn from "@/components/VisitBtn";
import { GetCloudResourceById, GetCloudResourceWithLogEntrys } from "@/actions/formCloudResourceAction";
import FormDeleteResource from "@/components/FormDeleteResource";
import { ElementsType, FormElementInstance } from "@/components/FormElements";
import FormStopResource from "@/components/FormStopResource";
import FormTogglePublicResource from "@/components/FormTogglePublicResource";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, formatDistance } from "date-fns";
import { ReactNode } from "react";
import { FaKey } from "react-icons/fa";

async function FormDetailPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = params;
  const form = await GetCloudResourceById(String(id));
  if (!form) {
    throw new Error("form not found");
  }

  const { visits, logcount } = form;

  let submissionRate = 0;

  if (visits > 0) {
    submissionRate = (logcount / visits) * 100;
  }

  const bounceRate = 100 - submissionRate;
  /* function addressreducer(state:any, action:any) {  
      return {
        address: action.address
      };
  }
  const [state, dispatch] = useReducer(addressreducer, {address:form.ipaddress})
 */
  const file = new Blob([form.privatekey], {type: 'text/plain'});
  
  return (
    <>
      <div className="py-10 border-b border-muted">
        <div className="flex justify-between container">
          <h1 className="text-4xl font-bold truncate">{form.name}</h1>

          
          <div className="flex justify-between">
          {/* <VisitBtn shareUrl={form.ipaddress} /> */}
          <FormStopResource isrunning={form.running} id={form.id} name={form.name} />
          <FormTogglePublicResource id={form.id} ispublic={form.public}/>

          </div>
          
        </div>
        <p className="container my-3">{form.description}</p>
      </div>

      

      <div className="py-4 border-muted">
        <div className="container flex gap-2 items-center justify-between">
          <FormLinkShare address={form.ipaddress} title="External Address:" />
        </div>
      </div>
      <div className="pb-4 border-b border-muted">
        <div className="container flex gap-2 items-center justify-between">
          <FormLinkShare address={form.internalipaddress} title="Internal Address:"/>
        </div>
      </div>
    {/* <GuacamoleStage /> */}
      <div >
  {/* <div className="px-4 sm:px-0">
    <h3 className="text-base font-semibold leading-7 ">Applicant Information</h3>
    <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details and application.</p>
  </div> */}
  <div className="mt-1 container">
    <dl className="divide-y border-b border-muted">
    <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm font-medium leading-6 ">Key</dt>
        <dd className="mt-2 text-sm  sm:col-span-2 sm:mt-0">
          <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
            <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
              <div className="flex w-0 flex-1 items-center">
                
                <FaKey />

                <div className="ml-4 flex min-w-0 flex-1 gap-2">
                <span className="flex-shrink-0 text-gray-400">Connect with: </span>
                <span className="truncate font-medium">ssh -i key.pem user@{form.ipaddress}</span>
                </div>
                
              </div>
              
              <div className="ml-4 flex-shrink-0">

      
                <a download="key.pem" target="_blank" rel="noreferrer" href={URL.createObjectURL(file)} className="font-medium text-indigo-600 hover:text-indigo-500">Download</a>
              </div>
            </li>
           
          </ul>
        </dd>
      </div>
      <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
        <dt className="text-sm font-medium leading-6">Zone</dt>
        <dd className="mt-1 text-sm leading-6   sm:col-span-2 sm:mt-0">{form.zone}</dd>
      </div>
      <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm font-medium leading-6 ">Subnet</dt>
        <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">{form.subnet}</dd>
      </div>
      <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm font-medium leading-6 ">Operating System</dt>
        <dd className="mt-1 text-sm leading-6  sm:col-span-2 sm:mt-0">{form.operatingsystem}</dd>
      </div>
      <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm font-medium leading-6 ">Machine Type</dt>
        <dd className="mt-1 text-sm leading-6  sm:col-span-2 sm:mt-0">{form.machinetype}</dd>
      </div>
      
      <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm font-medium leading-6 ">Disk Size</dt>
        <dd className="mt-1 text-sm leading-6  sm:col-span-2 sm:mt-0">{form.disksize}</dd>
      </div>
     
    </dl>
  </div>
</div>
      {/* <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 container">
        <StatsCard
          title="Total visits"
          icon={<LuView className="text-blue-600" />}
          helperText="All time form visits"
          value={visits.toLocaleString() || ""}
          loading={false}
          className="shadow-md shadow-blue-600"
        />

        <StatsCard
          title="Total submissions"
          icon={<FaWpforms className="text-yellow-600" />}
          helperText="All time form submissions"
          value={logcount.toLocaleString() || ""}
          loading={false}
          className="shadow-md shadow-yellow-600"
        />

        <StatsCard
          title="Submission rate"
          icon={<HiCursorClick className="text-green-600" />}
          helperText="Visits that result in form submission"
          value={submissionRate.toLocaleString() + "%" || ""}
          loading={false}
          className="shadow-md shadow-green-600"
        />

        <StatsCard
          title="Bounce rate"
          icon={<TbArrowBounce className="text-red-600" />}
          helperText="Visits that leaves without interacting"
          value={bounceRate.toLocaleString() + "%" || ""}
          loading={false}
          className="shadow-md shadow-red-600"
        />
      </div>

      <div className="container pt-10">
        <SubmissionsTable id={form.id} />
      </div> */}
      <div className="container">
        <FormDeleteResource id={form.id} name={form.name}/>
      </div>
    </>
  );
}

export default FormDetailPage;

type Row = { [key: string]: string } & {
  submittedAt: Date;
};

async function SubmissionsTable({ id }: { id: string }) {
  const form = await GetCloudResourceWithLogEntrys(id);

  if (!form) {
    throw new Error("form not found");
  }

  const formElements = JSON.parse(form.content) as FormElementInstance[];
  const columns: {
    id: string;
    label: string;
    required: boolean;
    type: ElementsType;
  }[] = [];

  formElements.forEach((element) => {
    switch (element.type) {
      case "TextField":
      case "NumberField":
      case "TextAreaField":
      case "DateField":
      case "SelectField":
      case "CheckboxField":
        columns.push({
          id: element.id,
          label: element.extraAttributes?.label,
          required: element.extraAttributes?.required,
          type: element.type,
        });
        break;
      default:
        break;
    }
  });

  const rows: Row[] = [];
  form.LogEntrys.forEach((submission) => {
    const content = JSON.parse(submission.content);
    rows.push({
      ...content,
      submittedAt: submission.createdAt,
    });
  });

  return (
    <>
      <h1 className="text-2xl font-bold my-4">Logs</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className="uppercase">
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="text-muted-foreground text-right uppercase">Submitted at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <RowCell key={column.id} type={column.type} value={row[column.id]} />
                ))}
                <TableCell className="text-muted-foreground text-right">
                  {formatDistance(row.submittedAt, new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function RowCell({ type, value }: { type: ElementsType; value: string }) {
  let node: ReactNode = value;

  switch (type) {
    case "DateField":
      if (!value) break;
      const date = new Date(value);
      node = <Badge variant={"outline"}>{format(date, "dd/MM/yyyy")}</Badge>;
      break;
    case "CheckboxField":
      const checked = value === "true";
      node = <Checkbox checked={checked} disabled />;
      break;
  }

  return <TableCell>{node}</TableCell>;
}
