import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
   AlignJustify,
   Play,
   Lightbulb,
   LogOut,
   Settings,
   User,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';

const NavLinks = () => {
   return (
      <>
         <NavLink to="/" className="bg-mutant-foreground">
            Home
         </NavLink>
      </>
   );
};
const Navbar = () => {
   const config = {
      headers: {
         'Content-Type': 'application/json',
      },
      withCredentials: true,
   };
   const [user, setUser] = useState<any>();
   const navigate = useNavigate();
   const [isOpen, setIsOpen] = useState(false);
   const { isLoggedIn, logout } = useAuthStore();
   const [loggedin, setLoggedIn] = useState(isLoggedIn);
   const [theme1, setTheme1] = useState(true);
   const { setTheme } = useTheme();

   const toggleNavbar = () => {
      setIsOpen(!isOpen);
   };
   const toggleTheme = () => {
      if (theme1) {
         setTheme('dark');
      } else {
         setTheme('light');
      }
      setTheme1(!theme1);
   };
   // useEffect(() => {
   //    const checkAccessTokenValidity = async () => {
   //       if (accessToken) {
   //          const decodedToken = parseJwt(accessToken);
   //          const expirationTime = decodedToken.exp * 1000;
   //          const currentTime = Date.now();

   //          if (expirationTime < currentTime) {
   //             try {
   //                await refreshTokens(); // Refresh the tokens
   //             } catch (error) {
   //                console.error('Error refreshing tokens:', error);
   //                navigate('/login');
   //             }
   //          }
   //       }
   //    };

   //    checkAccessTokenValidity();
   // }, [accessToken, navigate, refreshTokens]);
   useEffect(() => {
      const handleResize = () => {
         if (window.innerWidth > 768) {
            setIsOpen(false);
         }
      };
      toggleTheme();
      window.addEventListener('resize', handleResize);
      return () => {
         window.removeEventListener('resize', handleResize);
      };
   }, []);
   const logOut = async () => {
      setUser(null);
      setLoggedIn(false);
      logout();
      await axios
         .post('http://localhost:8000/api/v1/users/logout', {}, config)
         .then(() => {
            navigate('/');
         })
         .catch((err) => {
            console.log(err);
         });
   };
   useEffect(() => {
      if (isLoggedIn) {
         setLoggedIn(true);
         axios
            .get('http://localhost:8000/api/v1/users/current-user', config)
            .then((res) => {
               setUser(res.data.data);
            })
            .catch(function (error) {
               console.log(error);
            });
      }
   }, [isLoggedIn]);
   return (
      <header className="bg-background top-0 z-[20] mx-auto flex flex-wrap w-full items-center justify-between p-4 text-foreground ">
         <div className="flex items-center">
            <div className="flex logo h-10 w-10 items-center">
               <Play
                  size={30}
                  className="text-primary"
                  strokeWidth={3}
                  onClick={() => {
                     navigate('/');
                  }}
               />
            </div>
            <h1 className="text-xlhover:italic">Viewify</h1>
         </div>
         <Input
            className="w-1/3  max-sm:hidden"
            id="search"
            placeholder="Search"
         />
         <nav className="flex w-1/3 justify-end items-center">
            <div className="hidden w-full justify-around md:flex">
               <NavLinks />
            </div>
            <div className="justify-end md:hidden mr-2">
               <AlignJustify onClick={toggleNavbar} className="bg-background" />
            </div>
            <Toggle aria-label="Toggle bold" onClick={toggleTheme}>
               <Lightbulb className="h-4 w-4 mx-1" />
               <p className="text-base">{theme1 ? 'Dark' : 'Light'}</p>
            </Toggle>
         </nav>
         {loggedin ? (
            <DropdownMenu>
               <DropdownMenuTrigger>
                  <Avatar>
                     <AvatarImage src={user?.avatar?.url} />
                     <AvatarFallback>Avatar</AvatarFallback>
                  </Avatar>
               </DropdownMenuTrigger>
               <DropdownMenuContent>
                  <DropdownMenuItem
                     onClick={() => navigate(`/profile/${user?._id}`)}
                  >
                     <div className="flex justify-between items-center">
                        <div className="mr-6">My Profile</div>
                        <User size={20} strokeWidth={2} />
                     </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                     <div className="flex justify-between items-center">
                        <div className="mr-9">Settings</div>
                        <Settings size={20} strokeWidth={2} />
                     </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logOut()}>
                     <div className="flex justify-between items-center">
                        <div className="mr-11">Logout</div>
                        <LogOut size={20} strokeWidth={2} />
                     </div>
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         ) : (
            <Button
               variant="default"
               className="text-base"
               onClick={() => {
                  navigate('/login');
               }}
            >
               Login
            </Button>
         )}
         {isOpen && (
            <div className="flex flex-col items-center my-3 basis-full">
               <NavLinks />
            </div>
         )}
         <Input
            className="w-full mt-2 sm:hidden"
            id="search"
            placeholder="Search"
         />
      </header>
   );
};

export default Navbar;
