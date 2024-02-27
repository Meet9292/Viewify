import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import * as z from 'zod';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import BeatLoader from 'react-spinners/BeatLoader';
import { Textarea } from '@/components/ui/textarea';
const videoFormSchema = z.object({
   title: z
      .string()
      .min(2, {
         message: 'Title must be at least 2 characters.',
      })
      .max(30, {
         message: 'Title  must not be longer than 30 characters.',
      }),
   description: z.string().max(160).min(4),
});

type VideoFormValues = z.infer<typeof videoFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<VideoFormValues> = {
   title: '',
   description: '',
};

const UploadVideo = () => {
   const [loading, setLoading] = useState(false);
   const [files, setFiles] = useState({ video: '', thumbnail: '' });
   const form = useForm<VideoFormValues>({
      resolver: zodResolver(videoFormSchema),
      defaultValues,
      mode: 'onChange',
   });
   const { register } = useForm();
   const handleFileChange = (fieldName: any, e: any) => {
      setFiles({
         ...files,
         [fieldName]: e.target.files[0], // Assuming only one file is selected
      });
   };
   const onSubmitUpload = (data: VideoFormValues) => {
      setLoading(true);
      const config = {
         withCredentials: true,
      };
      const fd = new FormData();
      fd.append('video', files.video);
      fd.append('thumbnail', files.thumbnail);
      fd.append('title', data.title);
      fd.append('description', data.description);
      setLoading(true);
      axios
         .post('http://localhost:8000/api/v1/videos/uploadVideo', fd, config)
         .then((res) => {
            if (res.status === 200) {
               setLoading(false);
               console.log(res);
            } else {
               console.log('Something Went Wrong');
            }
         })
         .catch((error) => {
            console.error('Error fetching user data:', error);
         });
   };

   return (
      <Form {...form}>
         <form
            className="space-y-8"
            onSubmit={form.handleSubmit(onSubmitUpload)}
         >
            <FormField
               control={form.control}
               name="title"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel className="text-xl">Video Title</FormLabel>
                     <FormControl>
                        <Input placeholder="shadcn" {...field} />
                     </FormControl>
                     <FormDescription>
                        Write the title to display.
                     </FormDescription>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               name="video"
               render={() => (
                  <FormItem>
                     <FormLabel className="text-xl">Upload The Video</FormLabel>
                     <FormControl>
                        <Input
                           type="file"
                           {...register('video')}
                           onChange={(e) => handleFileChange('video', e)}
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               name="thumbnail"
               render={() => (
                  <FormItem>
                     <FormLabel className="text-xl">Thumbnail</FormLabel>
                     <FormControl>
                        <Input
                           type="file"
                           {...register('thumbnail')}
                           onChange={(e) => handleFileChange('thumbnail', e)}
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="description"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel className="text-xl">
                        Video Description
                     </FormLabel>
                     <FormControl>
                        <Textarea
                           placeholder="Type your message here."
                           {...field}
                        />
                     </FormControl>
                     <FormDescription>
                        Write the description For the video
                     </FormDescription>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <Button type="submit">
               {loading ? <BeatLoader color="#05313d" /> : 'Submit'}
            </Button>
         </form>
      </Form>
   );
};

export default UploadVideo;
