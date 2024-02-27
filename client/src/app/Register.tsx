import { NavLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

const formSchema: any = z
   .object({
      email: z.string().email({
         message: 'Email is not valid',
      }),
      password: z
         .string()
         .min(8, { message: 'Password should must have atleast 8 characters' }),
      cpassword: z.string().min(8),
   })
   .refine((data) => data.password === data.cpassword, {
      message: "Password Doesn't Match",
      path: ['confirm'],
   });

const Register = () => {
   const navigate = useNavigate();
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         email: '',
         password: '',
         cpassword: '',
      },
   });
   const onSubmit = (values: z.infer<typeof formSchema>) => {
      if (values.password === values.cpassword) {
         axios
            .post('http://localhost:8000/api/v1/users/register', {
               email: values.email,
               password: values.password,
            })
            .then((res) => {
               if (res) {
                  console.log(res.data.data);
                  navigate('/');
               }
            })
            .catch(function (error) {
               console.log(error);
            });
      } else {
         console.log('error');
      }
   };

   return (
      <Form {...form}>
         <div className="w-full h-screen flex items-center justify-center">
            <div className="w-[360px] min-[470px]:w-[450px] border-2 p-8 space-y-4 rounded-xl shadow-sm">
               <div className="flex justify-end ">
                  <Button
                     variant="outline"
                     onClick={() => {
                        navigate('/login');
                     }}
                  >
                     Login
                  </Button>
               </div>
               <form className="space-y-4 mb-4">
                  <header className="text-center text-3xl pb-2 font-semibold">
                     <p>Signup</p>
                  </header>
                  <FormField
                     control={form.control}
                     name="email"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel className="text-lg">Email</FormLabel>
                           <FormControl>
                              <Input {...field} />
                           </FormControl>
                           <FormDescription className="text-primary">
                              This email will be used to create Account.
                           </FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="password"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel className="text-lg">Password</FormLabel>
                           <FormControl>
                              <Input type="password" {...field} />
                           </FormControl>
                           <FormDescription className="text-primary">
                              Enter a password which must contains atleast 8
                              characters.
                           </FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="cpassword"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel className="text-lg">
                              Confirm Password
                           </FormLabel>
                           <FormControl>
                              <Input type="password" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <Button
                     onClick={form.handleSubmit(onSubmit)}
                     className="w-full"
                  >
                     Submit
                  </Button>
               </form>
               <div className="flex justify-between items-center">
                  <Separator className="w-1/4 " />
                  <p className="text-muted-foreground text-sm md:text-md">
                     OR CONTINUE WITH
                  </p>
                  <Separator className="w-1/4" />
               </div>
               <Button type="submit" className="w-full">
                  Sign in with Google
               </Button>
               <p className="px-8 text-center text-sm text-muted-foreground">
                  By clicking continue, you agree to our{' '}
                  <NavLink
                     to="/terms"
                     className="underline underline-offset-4 hover:text-primary"
                  >
                     Terms of Service
                  </NavLink>{' '}
                  and{' '}
                  <NavLink
                     to="/privacy"
                     className="underline underline-offset-4 hover:text-primary"
                  >
                     Privacy Policy
                  </NavLink>
                  .
               </p>
            </div>
         </div>
      </Form>
   );
};

export default Register;
