import React from "react";
import { createClient } from "@supabase/supabase-js";
import { AiOutlineCloseCircle, AiOutlineUserAdd } from "react-icons/ai";
import { Button, Form } from "react-bootstrap";
import { BSAlert } from "../components/alert/alert";
import { FiLogOut } from "react-icons/fi";
import Cookies from "js-cookie";

export const Home = () => {
  const [data, setData] = React.useState<any>();
  const [playerName, setPlayerName] = React.useState<any>();
  const [playerId, setPlayedId] = React.useState<any>();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLogged, setIsLogged] = React.useState(false);
  const [errorAlert, setErrorAlert] = React.useState<boolean>(false);
  const [successAlert, setSuccessAlert] = React.useState<boolean>(false);
  const [successMessage, setSuccessMessage] = React.useState<any>("");
  const [errorMessage, setErrorMessage] = React.useState<any>("");

  const supabase = createClient(
    "https://kxlvygospkwywvhihovx.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4bHZ5Z29zcGt3eXd2aGlob3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk3OTMwMjMsImV4cCI6MTk5NTM2OTAyM30.ljM8xbUTatbsFrxQkMvhtgpO1Gu2NiASLvExMD0ATXY"
  );

  console.log(localStorage.getItem('sb-kxlvygospkwywvhihovx-auth-token'))
  
  const fetchData = async () => {
    const { data, status } = await supabase.from("five").select();
    if (status === 200) setData(data);
    setPlayedId(data?.map((data) => data.id));
  };

  const handleAddPlayer = async () => {
    await supabase.from("five").insert([{ players: playerName }]);
    fetchData();
  };

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    console.log(error);
    if (error) {
      console.log(error);
      handleErrorMessage(error.message);
    } else {
      setIsLogged(true);
      setEmail(email);
      localStorage.setItem("user", email);
    }
  };

  const handleDisconnect = async () => {
    let { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    }
    setIsLogged(false);
    localStorage.removeItem("user");
    localStorage.removeItem("discord");
  };

  React.useEffect(() => {
    if (localStorage.getItem("user")) {
      setIsLogged(true);
    }
  }, []);

  const handleCreateUser = async () => {
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) {
      setEmail("");
      setPassword("");
      handleErrorMessage(error.message);
    } else {
      handleSuccessMessage("Success creating your account");
    }
  };

  const handleErrorMessage = (message: string) => {
    setErrorAlert(true);
    setErrorMessage(message);
    setTimeout(() => {
      setErrorAlert(false);
    }, 4000);
  };
  const handleSuccessMessage = (message: string) => {
    setSuccessAlert(true);
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessAlert(false);
    }, 4000);
  };

  const handleRemovePlayer = async (playerId: string) => {
    setPlayedId(playerId);
    const { data } = await supabase.from("five").delete().eq("id", playerId);
    fetchData();
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  React.useEffect(() => {
    const isLoggedIn = Cookies.get("isLoggedIn");
    if (isLoggedIn) {
      setIsLogged(true);
    }
  }, []);

  function handleSubmit(event: any) {
    event.preventDefault();
    handleSignIn();
  }

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  React.useEffect(() => {
    if (localStorage.getItem("discord")) {
      setIsLogged(true);
    }
  }, []);

  async function signInWithDiscord() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
    });
    if (data.provider) {
      localStorage.setItem("discord", data.url!);
      handleSuccessMessage("Auth réussie");
      setIsLogged(true);
    }
  }

  return (
    <React.Fragment>
      {successAlert && <BSAlert variant={"success"} text={successMessage} />}
      {errorAlert && <BSAlert variant={"danger"} text={errorMessage} />}
      {isLogged && (
        <div className="d-flex mt-3 justify-content-end align-items-center px-4 w-100">
          <div
            onClick={() => handleDisconnect()}
            className="d-flex cursor-pointer align-items-center"
          >
            {" "}
            <span className="me-2">Se déconnecter</span>
            <FiLogOut size={20} />
          </div>
        </div>
      )}
      <div className="d-flex flex-column justify-content-center align-items-center w-100">
        <div className="w-50">
          <h1 className="my-3">FIVE ⚽</h1>
          <h5 className="mb-5">dimanche 23 avril, à 16h00</h5>

          {isLogged && (
            <div>
              <ul className="p-0">
                {data?.map((data: any) => (
                  <div className="d-flex align-items-center justify-content-center">
                    <span className="me-3 my-2 w-100" key={data.id}>
                      {data.players}
                    </span>
                    <span onClick={() => handleRemovePlayer(data.id)}>
                      <AiOutlineCloseCircle
                        className="cursor-pointer"
                        color="crimson"
                        size={20}
                      />
                    </span>
                  </div>
                ))}
              </ul>
              <div className="d-flex align-items-center w-100 justify-content-center">
                <input
                  onChange={(event) => setPlayerName(event.target.value)}
                  placeholder="Pseudo"
                  className="form-control me-3 w-100"
                />
                <AiOutlineUserAdd
                  onClick={() => handleAddPlayer()}
                  style={{ cursor: "pointer" }}
                  color="grey"
                  size={26}
                />
              </div>
            </div>
          )}

          {!isLogged && (
            <div className="w-100 mt-5">
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    autoFocus
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <div className="d-flex w-100  justify-content-between">
                  <div className="d-flex">
                    <Button
                      className="mt-4 me-3 cursor-pointer"
                      type="submit"
                      disabled={!validateForm()}
                    >
                      Se connecter
                    </Button>
                    {/* <Button
                      onClick={() => signInWithDiscord()}
                      className="mt-4 cursor-pointer"
                      type="submit"
                      variant="secondary"
                    >
                      Discord
                    </Button> */}
                  </div>
                  <Button
                    onClick={() => handleCreateUser()}
                    className="cursor-pointer mt-4"
                    variant="outline"
                  >
                    S'inscrire
                  </Button>
                </div>
              </Form>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};
