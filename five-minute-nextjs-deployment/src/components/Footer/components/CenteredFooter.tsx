'use client';

// @mui material components
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

// Material Kit 2 PRO React components
import MKBox from "@/MKcomponents/MKBox";
import MKTypography from "@/MKcomponents/MKTypography";

import { motion } from "framer-motion";
const MotionTypography = motion.create(MKTypography);

interface Company {
  href: string; // 회사 URL
  name: string; // 회사 이름
}

interface Link {
  href: string; // 링크 URL
  name: string; // 링크 이름
}

interface Social {
  icon: React.ReactNode; // 소셜 아이콘 (React Node)
  link: string; // 소셜 링크 URL
  name: string; // 소셜 이름
}

 interface CenteredFooterProps {
  company: Company; // 회사 정보
  links: Link[]; // 링크 목록
  socials: Social[]; // 소셜 미디어 정보
  light?: boolean; // 테마 설정
}

function CenteredFooter({ company, links, socials, light = false } : CenteredFooterProps) {
  const { href, name } = company;

  const year = new Date().getFullYear();
  const renderLinks = links.map((link) => (
    <MotionTypography
      key={link.name}
      component={Link}
      href={link.href}
      variant="body2"
      color={light ? "white" : "secondary"}
      fontWeight="regular"
      whileHover={{ scale: 1.3 }}
    >
      {link.name}
    </MotionTypography>
  ));

  const renderSocials = socials.map((social) => (
    <MotionTypography
      key={social.name}
      component={Link}
      href={social.link}
      variant="body1"
      color={light ? "white" : "secondary"}
      fontWeight="regular"
      whileHover={{ scale: 1.3 }}
    >
      {social.icon}
    </MotionTypography>
  ));

  return (
    <MKBox component="footer" py={6}>
      <Grid container justifyContent="center">
        <Grid item xs={10} lg={8}>
          <Stack
            direction="row"
            flexWrap="wrap"
            justifyContent="center"
            spacing={{ xs: 2, lg: 3, xl: 6 }}
            mb={3}
          >
            {renderLinks}
          </Stack>
        </Grid>
        <Grid item xs={12} lg={8}>
          <Stack
            display="flex"
            direction="row"
            justifyContent="center"
            spacing={3}
            mt={1}
            mb={3}
          >
            {renderSocials}
          </Stack>
        </Grid>
        <Grid item xs={12} lg={8} sx={{ textAlign: "center" }}>
          <MKTypography variant="body2" color={light ? "white" : "secondary"}>
            Copyright &copy; {year} by{" "}
            <MKTypography
              component={Link}
              href={href}
              target="_blank"
              rel="noreferrer"
              variant="body2"
              color={light ? "white" : "secondary"}
            >
              {name}
            </MKTypography>
          </MKTypography>
        </Grid>
      </Grid>
    </MKBox>
  );
}

export default CenteredFooter;
