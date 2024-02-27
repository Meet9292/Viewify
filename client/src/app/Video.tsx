// import { useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dot, Heart, SendHorizontal, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { Textarea } from '@/components/ui/textarea';

const VideoSidebar = () => {
   const navigate = useNavigate();
   const [videos, setVideos] = useState<any>([]);
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
      <div className="flex flex-col mt-4">
         {videos.map((video: any) => (
            <Card
               className="flex flex-row shadow-none p-2 border-0 w-full"
               key={video._id}
               onClick={() => {
                  navigate('/video/1234');
               }}
            >
               <CardContent className="flex-none p-1 h-full w-[230px]">
                  <img
                     src={video?.thumbnail.url}
                     alt="Video Thumbnail"
                     className="rounded-md object-cover "
                  />
               </CardContent>
               <CardHeader>
                  <CardTitle className="text-lg text-wrap">
                     {video.title}
                  </CardTitle>
                  <div className="flex ">
                     <Avatar className="h-7 w-7">
                        <AvatarImage src={video.ownerDetails.avatar.url} />
                        <AvatarFallback>CN</AvatarFallback>
                     </Avatar>
                     <div className="ml-2 text-primary">
                        <p>{video.ownerDetails.channelName}</p>
                     </div>
                  </div>
                  <div className="flex items-center ">
                     <CardDescription>{video.views} Views</CardDescription>
                     <Dot size={20} strokeWidth={3} className="m-1" />
                     <CardDescription>
                        {' '}
                        {video.createdAt.slice(0, 10)}
                     </CardDescription>
                  </div>
               </CardHeader>
            </Card>
         ))}
      </div>
   );
};
const Video = () => {
   const [comment, setComment] = useState('');
   const [comments, setComments] = useState<any>([]);
   const { videoId } = useParams();
   const [user, setUser] = useState<any>();
   const { isLoggedIn } = useAuthStore();
   const [subscribed, setSubscribed] = useState<boolean | null>(null);
   const [like, setLike] = useState('none');
   const [video, setVideo] = useState<any>();
   const navigate = useNavigate();
   const config = {
      withCredentials: true,
   };
   useEffect(() => {
      axios
         .get(`http://localhost:8000/api/v1/videos/${videoId}`, config)
         .then((res) => {
            setVideo(res.data.data);
            getComment();
            if (res.data.data.isSubscribed === true) {
               setSubscribed(true);
            } else {
               setSubscribed(false);
            }
            if (res.data.data.isLiked === true) {
               setLike('red');
            } else {
               setLike('none');
            }
         });
   }, [videoId, subscribed, like]);
   const handleToggleLikes = async (videoId: string) => {
      try {
         const likedVideo: any = await axios.post(
            `http://localhost:8000/api/v1/likes/toggle/v/${videoId}`,
            {},
            config
         );
         if (likedVideo && like === 'red') {
            setLike('none');
         } else if (likedVideo && like === 'none') {
            setLike('red');
         }
      } catch (error) {
         console.log(error);
      }
   };
   const handleSubscribe = async (ownerId: string) => {
      try {
         const res = await axios.post(
            `http://localhost:8000/api/v1/subscriptions/subscribe/${ownerId}`,
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
   const handleComment = async (videoId: string) => {
      try {
         const res = await axios.post(
            `http://localhost:8000/api/v1/comments/${videoId}`,
            { content: comment },
            config
         );
         if (res) {
            getComment();
         }
      } catch (error) {
         console.log(error);
      }
   };
   useEffect(() => {
      if (isLoggedIn) {
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
   const getComment = () => {
      axios
         .get(`http://localhost:8000/api/v1/comments/${videoId}`, config)
         .then((res) => {
            if (res) {
               setComments(res.data.data);
            } else {
               setComments([]);
            }
         });
   };
   if (!video) {
      return <div>Loading...</div>; // or show a loader or handle the loading state
   }

   return (
      <>
         <div className="flex flex-row h-max">
            <div className="flex flex-col w-full lg:basis-3/5 border-0">
               <div className="mx-4 md:mx-8">
                  <iframe
                     src={video?.video.url}
                     className="rounded-lg object-cover w-full h-[300px] md:h-[500px]"
                  />
               </div>
               <div className="mx-8 mb-2 lg:-mt-4 lg:mx-12">
                  <p className="text-xl">{video.title}</p>
               </div>
               <div className="mx-6 mt-4 px-4 flex flex-row flex-wrap justify-start items-center">
                  <Avatar
                     className="h-14 w-14"
                     onClick={() => {
                        navigate(`/profile/${video.ownerDetails._id}`);
                     }}
                  >
                     <AvatarImage src={video.ownerDetails.avatar.url} />
                     <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                     <p className="text-primary text-2xl ">
                        {video.ownerDetails.channelName}
                     </p>
                     <div className="flex flex-row max-[390px]:text-sm">
                        <p className="text-muted-foreground text-md ">
                           {' '}
                           {video.subscribersCount} Subscribers
                        </p>
                     </div>
                  </div>
                  <div className="flex flex-row flex-1  justify-between ml-4 mt-8 min-[674px]:mt-0 ">
                     <Button
                        className=""
                        onClick={() => {
                           handleSubscribe(video.owner);
                        }}
                     >
                        {subscribed ? 'Unsubscribe' : 'Subscribe'}
                     </Button>
                     <div className="flex justify-end">
                        <Button
                           variant="ghost"
                           onClick={() => {
                              handleToggleLikes(video._id);
                           }}
                        >
                           <div className="mr-2">{video.noOfLikes} </div>
                           <Heart color="red" fill={like} />
                        </Button>
                        <Button variant="ghost">
                           <div className="mr-2">Share </div> <Share />
                        </Button>
                     </div>
                  </div>
               </div>
               <div className=" m-4 border-2 h-40 rounded-md text-gray-500 p-4">
                  {video.description}
               </div>
               <div className="m-4 border-2 h-full rounded-md text-gray-500 px-4">
                  <div className="h-16 flex flex-row items-center">
                     <div className="text-2xl">30,000 Comments</div>
                  </div>
                  <div className="mt-3 flex flex-row">
                     <Avatar>
                        <AvatarImage src={user?.avatar?.url} />
                        <AvatarFallback>Avatar</AvatarFallback>
                     </Avatar>
                     <div className="w-full pl-3">
                        <Textarea
                           placeholder="Add Your Comment"
                           onChange={(e) => {
                              setComment(e.target.value);
                           }}
                        />
                     </div>
                     <div className="pl-4">
                        <SendHorizontal
                           className="text-primary"
                           onClick={() => {
                              handleComment(video._id);
                           }}
                        />
                     </div>
                  </div>
                  <div className="mt-6">
                     {comments.map((comment: any) => (
                        <div
                           className="mt-3 flex items-center"
                           key={comment._id}
                        >
                           <Avatar>
                              <AvatarImage
                                 src={comment.ownerDetails?.avatar?.url}
                              />
                              <AvatarFallback>Avatar</AvatarFallback>
                           </Avatar>
                           <h1 className="ml-3">{comment.content}</h1>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
            <div className="basis-2/5 border-0 hidden lg:block">
               <VideoSidebar />
            </div>
         </div>
      </>
   );
};

export default Video;
