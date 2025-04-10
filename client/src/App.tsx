import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ThemeDetails from "@/pages/ThemeDetails";
import Categories from "@/pages/Categories";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/theme/:id" component={ThemeDetails} />
      <Route path="/categories" component={Categories} />
      <Route path="/profile" component={Profile} />
<Route path="/login" component={Login} />
<Route path="/register" component={Register} />
      <Route path="/top-rated" component={Home} />
      <Route path="/new-releases" component={Home} />
      <Route path="/trending" component={Home} />
      <Route path="/favorites" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
