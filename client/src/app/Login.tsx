import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '../store/authStore';
import BeatLoader from 'react-spinners/BeatLoader';
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const formSchema: any = z.object({
   email: z.string().email({
      message: 'Email is not valid',
   }),
   password: z
      .string()
      .min(8, { message: 'Your Password Has atleast 8 characters' }),
});

const Login = () => {
   const [loading, setLoading] = useState(false);
   const { login } = useAuthStore();
   const navigate = useNavigate();
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         email: '',
         password: '',
      },
   });
   const onSubmit = async (values: z.infer<typeof formSchema>) => {
      const config = {
         headers: { 'Content-Type': 'application/json' },
         withCredentials: true,
      };
      setLoading(true);
      axios
         .post(
            'http://localhost:8000/api/v1/users/login',
            {
               email: values.email,
               password: values.password,
            },
            config
         )
         .then((res) => {
            if (res.status === 200) {
               login(
                  res.data.data.user.email,
                  res.data.data.accessToken,
                  res.data.data.refreshToken
               );
               navigate('/');
               setLoading(false);
            } else {
               console.log(res.status);
            }
         })
         .catch(function (error) {
            console.log(error);
         });
   };

   return (
      <Form {...form}>
         <div className="w-full h-screen flex items-center justify-center">
            <div className="w-[360px] min-[470px]:w-[450px] border-2 p-8 space-y-4 rounded-xl shadow-sm">
               <div className="flex justify-end ">
                  <Button
                     variant="outline"
                     onClick={() => {
                        navigate('/register');
                     }}
                  >
                     Signup
                  </Button>
               </div>
               <form className="space-y-4 mb-4">
                  <header className="text-center text-3xl pb-2 font-semibold">
                     <p>Login</p>
                  </header>
                  <FormField
                     control={form.control}
                     name="email"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel className="text-lg">Email</FormLabel>
                           <FormControl>
                              <Input type="email" {...field} />
                           </FormControl>
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
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <Button
                     onClick={form.handleSubmit(onSubmit)}
                     className="w-full"
                  >
                     {loading ? <BeatLoader color="#05313d" /> : 'Submit'}
                  </Button>
               </form>
               <div className="flex justify-between items-center">
                  <Separator className="w-1/4 " />
                  <p className="text-muted-foreground text-sm md:text-md">
                     OR CONTINUE WITH
                  </p>
                  <Separator className="w-1/4" />
               </div>
               <Button onClick={() => navigate('/')} className="w-full">
                  Log in with Google
               </Button>
            </div>
         </div>
      </Form>
   );
};

export default Login;
