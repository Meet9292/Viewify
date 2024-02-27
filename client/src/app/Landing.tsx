import {
   ResizableHandle,
   ResizablePanel,
   ResizablePanelGroup,
} from '@/components/ui/resizable';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
const Landing = () => {
   return (
      <>
         <div className="max-md:hidden">
            <ResizablePanelGroup direction="horizontal">
               <ResizablePanel defaultSize={15} maxSize={15} minSize={10}>
                  <Sidebar />
               </ResizablePanel>
               <ResizableHandle className="h-screen" />
               <ResizablePanel defaultSize={85} maxSize={90}>
                  <Outlet />
               </ResizablePanel>
            </ResizablePanelGroup>
         </div>
         <div className="md:hidden">
            <Outlet />
         </div>
      </>
   );
};

export default Landing;
