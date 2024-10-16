'use client'
// eslint-disable
// import * as z from "zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Form, FormControl,  FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
// import { signInSchema } from "@/schema/signInSchema"
// import { signIn } from "next-auth/react"

const  SignIn =()=> {
  const router = useRouter();
  const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

  const form = useForm({
    // resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    }
  });

  
  const onSubmit = async (data: any) => {
    // const result = await signIn('credentials', {
    //   redirect: false,
    //   identifier: data.identifier,
    //   password: data.password,
    // });console.log(result)

    // if (result?.error) {
    //   if (result.error === 'CredentialsSignin') {
    //     toast({
    //       title: 'Login Failed',
    //       description: 'Incorrect username or password',
    //       variant: 'destructive',
    //     });
    //   } else {
    //     toast({
    //       title: 'Error',
    //       description: result.error,
    //       variant: 'destructive',
    //     });
    //   }
    // }

    // if (result?.url) {
    //   router.replace('/dashboard');
    // }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className=" w-full max-w-md p-8 space-y-8 rounded-lg bg-white shadow-md">
       <div className="text-center">
          <h2 className="text-2xl font-bold text-center tracking-tight mb-6">Sign In</h2>
       </div>
     
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="identifier" render={()=>(
              <FormItem>
               <FormField
                  name="identifier"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email / Username</FormLabel>
                      <FormControl>
                        <Input placeholder="email/username" {...field} onChange={(e)=> field.onChange(e)}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              
              </FormItem>
            )}/>
              <FormField control={form.control} name="password" render={()=>(
              <FormItem>
               <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="password" {...field} onChange={(e)=> field.onChange(e)}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormItem>
            )}/>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ?  ' Please wait': 'Sign In'  }
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default SignIn;