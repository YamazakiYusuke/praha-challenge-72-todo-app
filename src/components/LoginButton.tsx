import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";
import React from "react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button
      variant="contained"
      sx={{
        bgcolor: 'white',
        color: 'primary.main',
        '&:hover': {
          bgcolor: 'rgba(255, 255, 255, 0.9)',
        }
      }}
      onClick={() => loginWithRedirect()}
    >
      Log In
    </Button>
  );
};

export default LoginButton;