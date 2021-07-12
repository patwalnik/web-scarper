const response = (success, code, data) => {
    return {
      success,
      code,
      data
    };
  };
  
  const Handler = {
    response,
  };
  
  export default Handler;