import {BrowserRouter, Routes, Route} from "react-router-dom";
import IdeasList from "./pages/Ideas/IdeasList";
import AddIdea from "./pages/Ideas/AddIdea";
import EditIdea from "./pages/Ideas/EditIdea";
import Idea from "./pages/Ideas/Idea";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Users/Signup";
import Login from "./pages/Users/Login";
import VerifyAccount from "./pages/Users/VerifyAccount";
import AuthGuard from "./components/AuthGuard";

const App = () => {
  return <BrowserRouter>
    <Routes>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/verify-email" element={<VerifyAccount/>}/>

      <Route element={<AuthGuard/>}>
        <Route path="/" element={<IdeasList/>}/>
        <Route path="/add" element={<AddIdea/>}/>
        <Route path="/:id" element={<Idea/>}/>
        <Route path="/edit/:id" element={<EditIdea/>}/>
      </Route>

      <Route path="*" element={<NotFound/>}/>

    </Routes>
  </BrowserRouter>
}

export default App