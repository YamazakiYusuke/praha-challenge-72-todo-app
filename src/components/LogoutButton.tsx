import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";
import React from "react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button
      variant="outlined"
      color="inherit"
      sx={{
        color: 'white',
        borderColor: 'white',
        '&:hover': {
          borderColor: 'rgba(255, 255, 255, 0.8)',
          backgroundColor: 'rgba(255, 255, 255, 0.08)'
        }
      }}
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
    >
      Log Out
    </Button>
  );
};

export default LogoutButton;