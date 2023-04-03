import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/home";

export const App = () => {

  return (
    <div className="App">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
};
