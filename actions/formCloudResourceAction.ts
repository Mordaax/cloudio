"use server";

import prisma from "@/lib/prisma";
import { formCloudResourceSchema, formCloudResourceSchemaType } from "@/schemas/formCloudResourceSchema"; 
import { currentUser } from "@clerk/nextjs";

class UserNotFoundErr extends Error {}

const backendAddress = process.env.BACKEND_ADDRESS

export async function GetFormStats() {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  const stats = await prisma.cloudResource.aggregate({
    where: {
      userId: user.id,
    },
    _sum: {
      visits: true,
      logcount: true,
    },
  });

  const visits = stats._sum.visits || 0;
  const submissions = stats._sum.logcount || 0;

  let submissionRate = 0;

  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
  }

  const bounceRate = 100 - submissionRate;

  return {
    visits,
    submissions,
    submissionRate,
    bounceRate,
  };
}

export async function CreateCloudResourceForm(data: formCloudResourceSchemaType) {
  const validation = formCloudResourceSchema.safeParse(data);
  if (!validation.success) {
    throw new Error("form not valid");
  }

  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  const { name, description } = data;


  try {
    const response = await fetch(`${backendAddress}/cloud/create-instance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
      }),
    });
      if (response.ok) {
        const responseData = await response.json()
        const cloudresource = await prisma.cloudResource.create({
          data: {
            userId: user.id,
            name,
            description,
            ipaddress:responseData.external_ip,
            internalipaddress:responseData.internal_ip,
            privatekey:responseData.key,
            zone:responseData.zone,
            subnet:responseData.subnet, 
            operatingsystem:responseData.sourceimage,
            machinetype:responseData.machinetype,
            disksize:responseData.disksize, 
            running:true
          },
        });

        if (!cloudresource) {
          throw new Error("something went wrong");
        }
        return cloudresource.id;
      } else {
        console.error('Failed to create instance');
      }
    } catch (error) {
      console.error('Error creating instance:', error);
    }
  
}

export async function StopCloudResource(id:string, name:string) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }
  try {
    const response = await fetch(`${backendAddress}/cloud/stop-instance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
      }),
    });
    if (response.ok){
      await prisma.cloudResource.update({
        where: {
          id,
        },
        data: {
          running: false,
          ipaddress: '-'
        },
      });
    }
    return true;
  } catch(error){
    return false;
  }
  
}
export async function TogglePublicCloudResource(id:string, ispublic:boolean) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }
  try {
    /* const response = await fetch('http://localhost:8000/cloud/stop-instance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
      }),
    }); */
    
      await prisma.cloudResource.update({
        where: {
          userId: user.id,
          id,
        },
        data: {
          public:!ispublic
        },
      });
    
    return true;
  } catch(error){
    return false;
  }
  
}


export async function StartCloudResource(id:string, name:string) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }
  try {
    const response = await fetch(`${backendAddress}/cloud/start-instance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
      }),
    });
    const responseData = await response.json()
    if (response.ok){
      
      await prisma.cloudResource.update({
        where: {
          id,
        },
        data: {
          running: true,
          ipaddress: responseData.external_ip
        },
      });
    }
    return responseData.external_ip;
  } catch(error){
    return false;
  }
   
}

export async function DeleteCloudResource(id:string, name:string) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }
  try {
    await prisma.cloudResource.delete({
      where: {
        userId: user.id,
        id,
      }
    });
    const response = fetch(`${backendAddress}/cloud/delete-instance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
      }),
    });
    
      
    
    
    return true;
  } catch(error){
    return false;
  }
   
}


export async function GetForms() {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return await prisma.cloudResource.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function GetCloudResourceById(id: string) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return await prisma.cloudResource.findUnique({
    where: {
      userId: user.id,
      id,
    },
  });
}
export async function GetPublicCloudResourceById(publicId: string) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return await prisma.cloudResource.findUnique({
    where: {
      publicId:publicId
    },
  });
}


export async function UpdateFormContent(id: string, jsonContent: string) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return await prisma.cloudResource.update({
    where: {
      userId: user.id,
      id,
    },
    data: {
      content: jsonContent,
    },
  });
}

export async function PublishForm(id: string) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return await prisma.cloudResource.update({
    data: {
      running: true,
    },
    where: {
      userId: user.id,
      id,
    },
  });
}

export async function GetFormContentByUrl(formUrl: string) {
  return await prisma.cloudResource.update({
    select: {
      content: true,
    },
    data: {
      visits: {
        increment: 1,
      },
    },
    where: {
      ipaddress: formUrl,
    },
  });
}

export async function SubmitForm(formUrl: string, content: string) {
  return await prisma.cloudResource.update({
    data: {
      logcount: {
        increment: 1,
      },
      LogEntrys: {
        create: {
          content,
        },
      },
    },
    where: {
      ipaddress: formUrl,
      running: true,
    },
  });
}

export async function GetCloudResourceWithLogEntrys(id: string) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return await prisma.cloudResource.findUnique({
    where: {
      userId: user.id,
      id,
    },
    include: {
      LogEntrys: true,
    },
  });
}
