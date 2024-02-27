import { useEffect, useState } from 'react';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const VideosCard = () => {
   const navigate = useNavigate();
   const [videos, setVideos] = useState([]);
   useEffect(() => {
      const getallVideos = async () => {
         const res = await axios.get(
            'http://localhost:8000/api/v1/videos/getallvideo'
         );
         setVideos(res.data.data);
      };
      getallVideos();
   }, []);
   return (
      <>
         <div className="grid grid-cols-1 min-[600px]:grid-cols-2 lg:grid-cols-3">
            {videos.map((video: any) => (
               <Card
                  className="border-0 shadow-none mx-auto mt-2 max-[470px]:w-full max-[600px]:w-[430px] min-[600px]:w-full"
                  key={video?._id}
               >
                  <CardContent
                     className="mt-6"
                     onClick={() => navigate(`/video/${video?._id}`)}
                  >
                     <AspectRatio ratio={16 / 9} className=" w-full h-60">
                        <img
                           src={video.thumbnail.url}
                           alt="Photo by Drew Beamer"
                           className="rounded-md object-cover h-full"
                        />
                     </AspectRatio>
                  </CardContent>
                  <div className="flex p-6 items-center">
                     <Avatar
                        onClick={() => {
                           navigate(`/profile/${video.owner}`);
                        }}
                     >
                        <AvatarImage src={video.ownerDetails.avatar.url} />
                        <AvatarFallback>CN</AvatarFallback>
                     </Avatar>
                     <CardHeader>
                        <CardTitle className="text-lg">{video.title}</CardTitle>
                        <CardDescription>{video.channelName}</CardDescription>
                        <div className="flex items-center ">
                           <CardDescription>
                              {video.views} Views
                           </CardDescription>
                           <Dot size={20} strokeWidth={3} className="m-1" />
                           <CardDescription>
                              {' '}
                              {video.createdAt.slice(0, 10)}
                           </CardDescription>
                        </div>
                     </CardHeader>
                  </div>
               </Card>
            ))}
         </div>
      </>
   );
};

export default VideosCard;
