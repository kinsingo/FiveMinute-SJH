/** 
  All of the routes for the Material Kit 2 PRO React React are added here,
  You can add a new route, customize the routes and delete the routes here.
  Once you add a new route on this file it will be visible automatically on the Navbar.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `name` key is used for the name of the route on the Navbar.
  2. The `icon` key is used for the icon of the route on the Navbar.
  3. The `collapse` key is used for making a collapsible item on the Navbar that contains other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  4. The `route` key is used to store the route location which is used for the react router.
  5. The `href` key is used to store the external links location.
  6. The `component` key is used to store the component of its route.
  7. The `dropdown` key is used to define that the item should open a dropdown for its collapse items .
  8. The `description` key is used to define the description of
          a route under its name.
  9. The `columns` key is used to define that how the content should look inside the dropdown menu as columns,
          you can set the columns amount based on this key.
  10. The `rowsPerColumn` key is used to define that how many rows should be in a column.
*/

// @mui material components

//@mui/material/Icon 대신 **@mui/icons-material**을 사용하여 Icon을 SVG 아이콘으로 바꾼 코드입니다. 이렇게 하면 Material Icons 폰트에 의존하지 않으므로 Next.js와 호환성이 더 좋아집니다.
//import Icon from "@mui/material/Icon"; 대신 아래 코드를 사용하세요.
//import AssessmentIcon from "@mui/icons-material/Assessment";
//import DashboardIcon from "@mui/icons-material/Dashboard";
import KitchenIcon from '@mui/icons-material/Kitchen';
import AccessTimeIcon  from '@mui/icons-material/AccessTime';
import AppsIcon from '@mui/icons-material/Apps';
//import ContactsIcon from "@mui/icons-material/Contacts";
//import ArticleIcon from "@mui/icons-material/Article";

const routes : RouteItem[] = [
  {
    name: "식자재 관리",
    icon: <KitchenIcon/>,
    columns: 2,
    rowsPerColumn: 2,
    collapse: [
      {
        name: "강남점",
        collapse: [
          {
            name: "재고 업데이트",
            route: "/inventory/Gangnam/update",
          },
          {
            name: "재고 상태",
            route: "/inventory/Gangnam/status",
          },
        ],
      },
      {
        name: "수내점",
        collapse: [
          {
            name: "재고 업데이트",
            route: "/inventory/Bundang/update",
          },
          {
            name: "재고 상태",
            route: "/inventory/Bundang/status",
          },
        ],
      },
      {
        name: "관악점",
        collapse: [
          {
            name: "재고 업데이트",
            route: "/inventory/Sinlim/update",
          },
          {
            name: "재고 상태",
            route: "/inventory/Sinlim/status",
          },
        ],
      },
    ],
  },
  {
    name: "근태 관리",
    icon: <AccessTimeIcon/>,
    collapse: [
      {
        name: "대시보드",
        route: "/attendance/",
      },
    ],
  },
  {
    name: "모바일앱",
    icon: <AppsIcon/>,
    collapse: [
      {
        name: "다운로드",
        route: "/mobileApp/",
      },
    ],
  },
];

export default routes;