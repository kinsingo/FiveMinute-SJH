// @ts-ignore
import FacebookIcon from "@mui/icons-material/Facebook";
// @ts-ignore
import TwitterIcon from "@mui/icons-material/Twitter";
// @ts-ignore
import InstagramIcon from "@mui/icons-material/Instagram";
// @ts-ignore
import PinterestIcon from "@mui/icons-material/Pinterest";
// @ts-ignore
import GitHubIcon from "@mui/icons-material/GitHub";

// Material Kit 2 PRO React examples
import CenteredFooter from "./components/CenteredFooter";

export default function BMTFooter() {
  const company = {
    href: "/",
    name: "Kamdong Insight",
  };
  const links = [
    { href: "/", name: "Company" },
    { href: "/", name: "About Us" },
    { href: "/", name: "Team" },
    { href: "/", name: "Products" },
    { href: "/", name: "Blog" },
    { href: "/", name: "License" },
  ];
  const socials = [
    {
      icon: <FacebookIcon fontSize="small" />,
      link: "/",
      name: "Facebook",
    },
    {
      icon: <TwitterIcon fontSize="small" />,
      link: "/",
      name: "Twitter",
    },
    {
      icon: <InstagramIcon fontSize="small" />,
      link: "/",
      name: "Instagram",
    },
    {
      icon: <PinterestIcon fontSize="small" />,
      link: "/",
      name: "Pinterest",
    },
    {
      icon: <GitHubIcon fontSize="small" />,
      link: "/",
      name: "GitHub",
    },
  ];

  return <CenteredFooter company={company} links={links} socials={socials} />;
}
