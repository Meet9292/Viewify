import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
const Nav = () => {
   const location = useLocation();
   const items = [
      { href: '/settings', title: 'Profile' },
      { href: '/settings/uploads', title: 'Uploads' },
      { href: '/settings/upload-video', title: 'Upload Video' },
      { href: '/settings/delete-video', title: 'Delete Video' },
   ];
   return (
      <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
         {items.map((item) => (
            <NavLink
               key={item.href}
               to={item.href}
               className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  location.pathname === item.href
                     ? 'bg-muted hover:bg-muted'
                     : 'hover:bg-transparent',
                  'justify-start'
               )}
            >
               {item.title}
            </NavLink>
         ))}
      </nav>
   );
};
const Settings = () => {
   return (
      <>
         <div className="w-full h-max">
            <div className="space-y-6 p-10 pb-16 sm:block border-2 rounded-md m-4">
               <div className="space-y-0.5">
                  <h2 className="text-2xl font-bold tracking-tight">
                     Settings
                  </h2>
                  <p className="text-muted-foreground">
                     Manage your account settings and set e-mail preferences.
                  </p>
               </div>
               <Separator className="my-6" />
               <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                  <aside className="-mx-4 lg:w-1/5">
                     <Nav />
                  </aside>
                  <Separator orientation="vertical" />
                  <div className="flex-1 w-full">
                     <Outlet />
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default Settings;
