import { createTheme, responsiveFontSizes } from "@mui/material";

export let theme = createTheme({
  // palette: {
  //   primary: {
  //   }
  // },
  // typography: {
  //   title: {
  //     fontWeight: 700,
  //     color: "rgba(255,255,255,0.95)",
  //     fontSize: "24px",
  //   },
  //   actors: {
  //     color: "orange",
  //     fontSize: "17px",
  //     marginRight: "10px",
  //     fontWeight: 400,
  //   },
  //   quality: {
  //     fontSize: "17px",
  //     padding: "5px 10px",
  //     backgroundColor: "rgba(60,60,60,0.7)",
  //     marginRight: "10px",
  //     borderRadius: "3px",
  //   },
  //   status: {
  //     fontSize: "17px",
  //     padding: "5px 10px",
  //     backgroundColor: "#ffd60d",
  //     marginRight: "10px",
  //     borderRadius: "3px",
  //     color: "#000",
  //     fontWeight: 500,
  //   },
  // },
  // components: {
  //   // Name of the component
  //   MuiButton: {
  //     variants: [
  //       // {
  //       //   props: { variant: "text" },
  //       //   style: {
  //       //     backgroundColor: "rgba(35,35,35,0.7)",
  //       //     '&:hover': {
  //       //       backgroundColor: "rgba(35,35,35,1)",
  //       //     }
  //       //   },
  //       // },
  //       {
  //         props: { variant: "contained", color: "primary" },
  //         style: {
  //           textTransform: "none",
  //         },
  //       },
  //       {
  //         props: { size: "large" },
  //         style: {
  //           textTransform: "none",
  //           width: "200px",
  //           height: "60px",
  //         },
  //       },
  //       {
  //         props: { size: "medium" },
  //         style: {
  //           textTransform: "none",
  //           width: "150px",
  //           height: "50px",
  //         },
  //       },
  //       {
  //         props: { size: "small" },
  //         style: {
  //           textTransform: "none",
  //           width: "120px",
  //           height: "40px",
  //         },
  //       },
  //       {
  //         props: { fullWidth: true },
  //         style: {
  //           width: "100%",
  //         },
  //       },
  //       {
  //         props: { variant: "watch" },
  //         style: {
  //           backgroundColor: "#ffba28",
  //           color: "#000",
  //           "&:hover": {
  //             backgroundColor: "#ffba28",
  //           },
  //         },
  //       },
  //     ],
  //   },
  //   MuiTextField: {
  //     variants: [
  //       {
  //         props: { variant: "standard", multiline: true },
  //         style: {
  //           color: "rgba(255,255,255,0.8)",
  //           label: {
  //             zIndex: 5,
  //             left: "10px",
  //             top: "5px",
  //           },
  //           input: {
  //             backgroundColor: "rgb(40,40,40)",
  //             color: "rgba(255,255,255,0.8)",
  //             "&::after": {
  //               border: "2px solid red",
  //             },
  //           },
  //         },
  //       },
  //     ],
  //     styleOverrides: {
  //       root: {
  //         // color: 'rgba(255,255,255,0.8)',
  //         // inputProps={{ style: { color: "red" } }}
  //         input: {
  //           backgroundColor: "rgba(255,255,255,0.8)",
  //           // background: 'rgb(100,100,100)',
  //           padding: "15px 10px",
  //         },
  //       },
  //     },
  //     // variants: [
  //     //   {
  //     //     props: { variant: 'standard' },
  //     //     style: {
  //     //       // borderBottom: '1px solid red',
  //     //       color: 'red',
  //     //       // backgroundColor: 'rgb(45,45,45)',
  //     //       // "&:hover": {
  //     //       //   backgroundColor: 'rgb(55,55,55)'
  //     //       // }
  //     //     },
  //     //   },
  //     // ],
  //   },
  //   MuiAppBar: {
  //     styleOverrides: {
  //       root: {
  //         backgroundColor: "rgba(1,0,6,0.95)",
  //       },
  //     },
  //   },
  //   // MuiTable: {
  //   //   styleOverrides: {
  //   //     root: {
  //   //       background: 'transparent'
  //   //     }
  //   //   }
  //   // },
  //   MuiTableBody: {
  //     styleOverrides: {
  //       root: {
  //         background: "transparent",
  //       },
  //     },
  //   },
  //   MuiTableCell: {
  //     variants: [
  //       {
  //         props: { variant: "detail" },
  //         style: {
  //           color: "#ffbf00",
  //           maxWidth: "100px",
  //         },
  //       },
  //     ],
  //     styleOverrides: {
  //       root: {
  //         background: "transparent",
  //         color: "rgba(255,255,255,0.8)",
  //         fontSize: "14px",
  //         border: "none",
  //         padding: "7px 10px 10px 0",
  //         maxWidth: "20px",
  //       },
  //     },
  //   },
  //   // MuiTab: {
  //   // },
  //   // MuiTableBody: {
  //   //   styleOverrides: {
  //   //     root: {
  //   //       background: 'transparent'
  //   //     }
  //   //   }
  //   // },
  //   // MuiTableCell: {
  //   //   styleOverrides: {
  //   //     root: {
  //   //       background: 'transparent',
  //   //       color: 'rgba(255,255,255,0.8)',
  //   //       fontSize: '17px',
  //   //       border: 'none',
  //   //       padding: '20px',
  //   //       maxWidth: '150px'
  //   //     }
  //   //   }
  //   // },
  //   // MuiTablePagination: {
  //   //   styleOverrides: {
  //   //     root: {
  //   //       background: 'transparent',
  //   //       color: 'rgba(255,255,255,0.8)',
  //   //     }
  //   //   }
  //   // },
  //   // MuiToggleButton: {
  //   //   styleOverrides: {
  //   //     root: {
  //   //       color: 'rgba(255,255,255,0.8)',
  //   //       background: 'rgb(15,15,15)',
  //   //       transition: '0.3s',
  //   //       // "&:hover": {
  //   //       //   background: 'rgb(25,25,25)',
  //   //       // },
  //   //       // "	.Mui-selected": {
  //   //       //   background: 'rgb(50,50,50)',
  //   //       // }
  //   //     },
  //   //     // selected: {
  //   //     //   background: 'rgb(50,50,50)',
  //   //     // },
  //   //   }
  //   // },
  //   // MuiRating: {
  //   //   styleOverrides: {
  //   //     root: {
  //   //       color: 'rgba(255,255,255,0.8)',
  //   //       background: 'rgb(25,12,25)',
  //   //       transition: '0.3s',
  //   //       // " .MuiRating-icon": {
  //   //       //   background: 'rgb(25,25,25)',
  //   //       // },
  //   //       // "	.Mui-selected": {
  //   //       //   background: 'rgb(50,50,50)',
  //   //       // }
  //   //     },
  //   //   }
  //   // }
  // },
});

theme = responsiveFontSizes(theme);

theme.typography.h1 = {
  color: "#fff",
  fontSize: "46px",
  fontWeight: 700,
};
theme.typography.h2 = {
  color: "#fff",
  fontSize: "40px",
  fontWeight: 700,
};
theme.typography.h3 = {
  color: "#fff",
  fontSize: "33px",
};
theme.typography.h4 = {
  color: "#fff",
  fontSize: "28px",
};
theme.typography.h5 = {
  color: "#05264e",
  fontSize: "23px",
};
theme.typography.h6 = {
  color: "#fff",
  fontSize: "16px",
};
theme.typography.body1 = {
  color: "lightgray",
  fontSize: "16px",
  // lineHeight: '25px'
};
theme.typography.body2 = {
  color: "lightgray",
  fontSize: "13px",
  fontWeight: 500,
};
