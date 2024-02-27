import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
   ResizableHandle,
   ResizablePanel,
   ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dot, Share } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import axios from 'axios';
const VideoCardHorizontal = (props: any) => {
   const videos = props.videos;

   const navigate = useNavigate();

   return (
      <ScrollArea className="w-full whitespace-nowrap rounded-md border-0">
         <div className="flex w-max space-x-4">
            {videos.map((video: any) => (
               <Card
                  className="border-0 shadow-none p-2 mx-auto w-[300px]"
                  key={video._id}
               >
                  <CardContent className="p-1">
                     <AspectRatio
                        ratio={16 / 9}
                        className="bg-muted"
                        onClick={() => {
                           navigate(`/video/${video._id}`);
                        }}
                     >
                        <img
                           src={video.thumbnail.url}
                           alt="Photo by Drew Beamer"
                           className="rounded-md object-cover w-full"
                        />
                     </AspectRatio>
                  </CardContent>
                  <div className="flex mt-4 p-1 items-center">
                     <CardHeader>
                        <CardTitle className="text-lg text-wrap">
                           {video.title}
                        </CardTitle>
                        <div className="flex items-center ">
                           <CardDescription>
                              {video.views} Views
                           </CardDescription>
                           <Dot size={20} strokeWidth={3} className="m-1" />
                           <CardDescription>
                              {' '}
                              {video.description}
                           </CardDescription>
                        </div>
                     </CardHeader>
                  </div>
               </Card>
            ))}
         </div>
         <ScrollBar orientation="horizontal" />
      </ScrollArea>
   );
};

const UserInfo = () => {
   const { profileId } = useParams();
   const [user, setUser] = useState<any>();
   const [videos, setVideos] = useState([]);
   const [subscribed, setSubscribed] = useState<boolean | null>(null);
   const config = {
      withCredentials: true,
   };
   useEffect(() => {
      const fetchUserData = async () => {
         try {
            const res = await axios.get(
               `http://localhost:8000/api/v1/users/channel/${profileId}`,
               config
            );
            setUser(res.data.data);

            const subscribedRes = await axios.get(
               `http://localhost:8000/api/v1/subscriptions/subscribed/${res.data.data._id}`,
               config
            );
            setSubscribed(subscribedRes.data.data === 'true');

            const videosRes = await axios.get(
               `http://localhost:8000/api/v1/videos/getvideo/${res.data.data._id}`,
               config
            );
            setVideos(videosRes.data.data);
         } catch (error) {
            console.error('Error fetching user data:', error);
         }
      };

      fetchUserData();
   }, [profileId, subscribed]);

   const handleSubscribe = async () => {
      try {
         const res = await axios.post(
            `http://localhost:8000/api/v1/subscriptions/subscribe/${user._id}`,
            {},
            config
         );
         if (res.status === 200) {
            setSubscribed(!subscribed);
         } else {
            console.log('Something Went Wrong');
         }
      } catch (error) {
         console.error('Error subscribing:', error);
      }
   };

   return (
      <div className="w-full h-screen overflow-y-auto flex justify-center">
         <ResizablePanelGroup
            direction="vertical"
            className="w-full rounded-lg mx-2"
         >
            <ResizablePanel defaultSize={35} minSize={35} maxSize={40}>
               <div className="flex items-center justify-center p-4">
                  <AspectRatio ratio={21 / 9}>
                     <img
                        src={user?.coverImage?.url || 'default-avatar-url'}
                        alt="Image"
                        className="rounded-md w-full h-[220px]"
                     />
                  </AspectRatio>
               </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={65}>
               <div className="flex flex-wrap justify-between items-center ">
                  <div className="m-8 flex flex-row justify-start items-center">
                     <Avatar className="h-20 w-20">
                        <AvatarImage
                           src={user?.avatar?.url || 'default-avatar-url'}
                        />
                        <AvatarFallback>Avatar</AvatarFallback>
                     </Avatar>
                     <div className="ml-4 space-y-2">
                        <h1 className="text-3xl text-primary max-[390px]:text-xl ">
                           {user?.channelName}
                        </h1>
                        <div className="flex flex-row max-[390px]:text-sm">
                           <p className="text-muted-foreground text-md ">
                              {' '}
                              {user?.subscribersCount} Subscribers
                           </p>
                           <Dot size={20} strokeWidth={3} className="m-1" />
                           <p className="text-muted-foreground">
                              {user?.totalVideos} videos
                           </p>
                        </div>
                     </div>
                  </div>
                  <div className="">
                     <Button
                        className="m-5"
                        onClick={() => {
                           handleSubscribe();
                        }}
                     >
                        {subscribed ? 'Unsubscribe' : 'Subscribe'}
                     </Button>
                     <Button variant="ghost">
                        <div className="mr-2">Share </div> <Share />
                     </Button>
                  </div>
               </div>
               <VideoCardHorizontal videos={videos} />
            </ResizablePanel>
         </ResizablePanelGroup>
      </div>
   );
};

export default UserInfo;
