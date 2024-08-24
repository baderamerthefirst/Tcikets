

const accessToken = localStorage.getItem("accessToken");
function removeAccessToken(params) {
  
  localStorage.removeItem("accessToken");
}

export  {
    accessToken,
    removeAccessToken
  };
  
