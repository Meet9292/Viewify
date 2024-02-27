import { Route, Routes } from 'react-router-dom';
import Home from './app/Home';
import Register from './app/Register';
import Login from './app/Login';
import Settings from './app/Settings';
import VideosCard from './app/VideosCard';
import UpdateProfile from './app/UpdateProfile';
import Uploads from './app/Uploads';
import UserInfo from './app/UserInfo';
import Landing from './app/Landing';
import Video from './app/Video';
import DeleteVideo from './app/DeleteVideo';
import UploadVideo from './app/UploadVideo';

function App() {
   return (
      <>
         <Routes>
            <Route path="/" element={<Home />}>
               <Route path="/" element={<Landing />}>
                  <Route index element={<VideosCard />} />
                  <Route path="/settings" element={<Settings />}>
                     <Route index element={<UpdateProfile />} />
                     <Route path="/settings/uploads" element={<Uploads />} />
                     <Route
                        path="/settings/upload-video"
                        element={<UploadVideo />}
                     />
                     <Route
                        path="/settings/delete-video"
                        element={<DeleteVideo />}
                     />
                  </Route>
               </Route>
               <Route path="/profile/:profileId" element={<UserInfo />} />
               <Route path="/video/:videoId" element={<Video />}></Route>
            </Route>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
         </Routes>
      </>
   );
}

export default App;
