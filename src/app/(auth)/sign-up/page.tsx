'use client'
// eslint-disable
// import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDebounceCallback, } from 'usehooks-ts'
// import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
// import { signUpSchema } from "@/schema/signUpSchema"
import axios from "axios"
// import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"


const  SignUp =()=> {

  const router = useRouter();
  // states
  const [username, setUsername] = useState<string>('');
  const [isUserChecking, setIsUserChecking] = useState<boolean>(false);
  const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
  const [ isOrg, setIsOrg ] = useState<boolean>(false);

  // error message states
  const [usernameError, setUsernameError] = useState<string>('');

  console.log(isUserChecking,usernameError);
  const debouncedUserName = useDebounceCallback(setUsername, 500);

  const form = useForm({
    // resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      org_name:''
    }
  });
  // const { register, handleSubmit, formState: { errors } } = form;
  const checkUserName = async () => {
    setIsUserChecking(true);
    setUsernameError('');
    try{
     const response = await axios.get('/api/check-username?username='+username);
     if(response?.data?.success){
       setIsUserChecking(false);
     }
    }
    catch(error){
      setIsUserChecking(false);
      const axiosError = error as any;
      console.error('error checking username',error);
      setUsernameError(axiosError?.response?.data?.message);
      toast({
        title: 'Error checking username',
        description: axiosError?.response?.data?.message,
        variant: 'destructive'
      })
    }
  }

  const onSubmit = async(data:any)=>{
    setIsSubmitting(true);
    try{
      const response = await axios.post("https://pdf-backend-wsqn.onrender.com/user_auth/signup", 
       data
    , {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    });
      if(response?.status === 200){
        toast({
          title: 'Account created successfully',
          description: response?.data,
          variant: 'default'
        });
        router.replace(`/login`);
        setIsSubmitting(false);
      }
      // setIsSubmitting(false);
    }
    catch(error){
      setIsSubmitting(false);
      const axiosError = error as any;
      console.error('error while siging up',error);
      toast({
        title: 'error while siging up',
        description: axiosError?.response?.data?.message,
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
      if(username.length > 0) {
        checkUserName();
      }
  }, [username])

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className=" w-full max-w-md p-8 space-y-8 rounded-lg bg-white shadow-md">
       <div className="text-center">
          <h2 className="text-2xl font-bold text-center tracking-tight mb-6">Sign Up</h2>
       </div>
     
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="username" render={()=>(
              <FormItem>
               <FormField
                  name="username"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="username" {...field} onChange={(e)=>{
                          field.onChange(e);
                          debouncedUserName(e.target.value);
                        }}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormItem>
            )}/>
            <FormField control={form.control} name="email" render={()=>(
              <FormItem>
               <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email" {...field} onChange={(e)=> field.onChange(e)}/>
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
             <div className="flex items-center space-x-2">
              <Checkbox   checked={isOrg}
                  onCheckedChange={()=>(setIsOrg(!isOrg))}/>
                <label
                  htmlFor="terms2"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                 Is you creating a organisation account
                </label>
            </div>
            {isOrg && <FormField control={form.control} name="org_name" render={()=>(
              <FormItem>
               <FormField
                  name="org_name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organisation Name</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="organisation name" {...field} onChange={(e)=> field.onChange(e)}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormItem>
            )}/>}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ?  ' Please wait': 'Sign Up'  }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>Already Member? <Link href={'/signin'} className="text-blue-500 hover:underline">Sign In</Link></p>
       </div>
      </div>
    </div>
  )
}

export default SignUp;