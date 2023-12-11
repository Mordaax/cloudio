"use client";

import { CreateCloudResourceForm } from "@/actions/formCloudResourceAction";
import { formCloudResourceSchema, formCloudResourceSchemaType } from "@/schemas/formCloudResourceSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ImSpinner2 } from "react-icons/im";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "./ui/use-toast";
/* import { BsFileEarmarkPlus } from "react-icons/bs"; */
import { useRouter } from "next/navigation";
import { PiComputerTowerThin } from "react-icons/pi";



function CreateFormBtn() {
  const router = useRouter();
  const form = useForm<formCloudResourceSchemaType>({
    resolver: zodResolver(formCloudResourceSchema),
  });

  async function onSubmit(values: formCloudResourceSchemaType) {
    try {
      const formId = await CreateCloudResourceForm(values);
      toast({
        title: "Success",
        description: "Cloud resource created successfully",
      });
      router.push(`/manage-resource/${formId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong, please try again later",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className="group border border-primary/20 h-[190px] items-center justify-center flex flex-col hover:border-primary hover:cursor-pointer border-dashed gap-4"
        >

          <PiComputerTowerThin className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
          <p className="font-bold text-xl text-muted-foreground group-hover:text-primary">Create new resource</p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create resource</DialogTitle>
          <DialogDescription>Create a new cloud resource</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resource Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
          </form>
        </Form>
        <DialogFooter>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting} className="w-full mt-4">
            {!form.formState.isSubmitting && <span>Save</span>}
            {form.formState.isSubmitting && <><span>Creating Cloud Resource &#160;</span><ImSpinner2 className="animate-spin" /></>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateFormBtn;
