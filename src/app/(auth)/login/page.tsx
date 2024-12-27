"use client";
// eslint-disable
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const SignIn = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm({
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    try{
        const resp:any = await axios.post("https://a03b-35-207-224-203.ngrok-free.app/user_auth/login", {
          id:data?.identifier,
          password:data?.password
      }, {
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
          }
      });
     
      if (resp?.status ===200) {
        document.cookie = `access_token=${resp?.data.access_token}; path=/; secure; samesite=strict;`;
        router.replace("/dashboard");
        toast({
          title: "Login Successful",
          description: "You are being redirected to the dashboard",
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid login credentials",
        });
      }

    }
    catch(err){
      console.error(err)
    }
   
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg bg-white shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-center tracking-tight mb-6">
            Sign In
          </h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={() => (
                <FormItem>
                  <FormField
                    name="identifier"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email / Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="email/username"
                            {...field}
                            onChange={(e) => field.onChange(e)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={() => (
                <FormItem>
                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="password"
                            {...field}
                            onChange={(e) => field.onChange(e)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? " Please wait" : "Sign In"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignIn;
