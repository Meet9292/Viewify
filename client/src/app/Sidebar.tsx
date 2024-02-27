import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Settings } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
const Subscriptions = (props: any) => {
   const subscriptions = props.subscriptions;
   const navigate = useNavigate();

   return (
      <>
         {subscriptions.map((subscriber: any) => (
            <div
               key={subscriber._id}
               className="mt-3 flex justify-center lg:justify-start"
            >
               <Button
                  variant="ghost"
                  className="flex flex-row justify-between mx-3"
                  onClick={() => {
                     navigate(`/profile/${subscriber._id}`);
                  }}
               >
                  <Avatar className="h-8 w-8  lg:mr-2">
                     <AvatarImage
                        className="rounded-full"
                        src={subscriber.avatar.url}
                     />
                     <AvatarFallback>Avatar</AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:block">
                     {subscriber.channelName}
                  </div>
               </Button>
            </div>
         ))}
      </>
   );
};
const Sidebar = () => {
   const [subscribe, setSubscribed] = useState([]);
   const location = useLocation();
   const { isLoggedIn } = useAuthStore();
   const items = [
      {
         href: '/',
         title: 'Home',
         symbol: <Home strokeWidth={2} />,
      },
      {
         href: '/settings',
         title: 'Settings',
         symbol: <Settings strokeWidth={2} />,
      },
   ];

   const config = {
      withCredentials: true,
   };
   useEffect(() => {
      const fetchUserData = async () => {
         const res = await axios.get(
            'http://localhost:8000/api/v1/subscriptions/subscribedChannel',
            config
         );
         if (res.data.data === null) {
            setSubscribed([]);
         } else {
            setSubscribed(res.data.data[0].channelDetails);
         }
      };
      if (isLoggedIn) {
         fetchUserData();
      } else {
         setSubscribed([]);
      }
   }, [isLoggedIn]);

   return (
      <>
         <nav className="flex mt-5 mx-3 flex-col justify-center lg:space-x-0 lg:space-y-1">
            {items.map((item) => (
               <NavLink
                  key={item.href}
                  to={item.href}
                  className={cn(
                     buttonVariants({ variant: 'ghost' }),
                     '/' + location.pathname.split('/')[1] === item.href
                        ? 'bg-muted hover:bg-muted'
                        : 'hover:bg-transparent'
                  )}
               >
                  <div className="hidden lg:block text-start">{item.title}</div>
                  <div className="block lg:hidden justify-center">
                     {item.symbol}
                  </div>
               </NavLink>
            ))}
         </nav>
         <Separator orientation="horizontal" className=" rounded m-3" />
         <Button variant="ghost" className="mt-1" disabled>
            Subscriptions
         </Button>
         <Subscriptions subscriptions={subscribe} />
      </>
   );
};

export default Sidebar;
