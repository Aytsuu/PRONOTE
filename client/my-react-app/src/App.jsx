import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './Header.jsx'
import MainContent from './MainContent.jsx'


const queryClient = new QueryClient()

const App = () => {

  return (<>
          <QueryClientProvider client={queryClient}> 
            <Header/>
            <MainContent/>
          </QueryClientProvider>
        </>);
}

export default App
