"use client";

import { useState } from "react";

// react-router components
import Link from "next/link";

// @mui material components
import Collapse from "@mui/material/Collapse";
import MuiLink from "@mui/material/Link";

// Material Kit 2 PRO React componentsc
import MKBox from "@/MKcomponents/MKBox";
import MKTypography from "@/MKcomponents/MKTypography";

// Material Kit 2 PRO React examples
import DefaultNavbarDropdown from "./DefaultNavbarDropdown";

interface DefaultNavbarMobileProps {
  routes: RouteItem[];
  open: boolean;
  light?: boolean;
}

function DefaultNavbarMobile({
  routes,
  open,
  light = false,
}: DefaultNavbarMobileProps) {
  const [collapse, setCollapse] = useState("");

  const handleSetCollapse = (name: string) =>
    collapse === name ? setCollapse("") : setCollapse(name);

  const renderNavbarItems = routes.map(
    ({
      name,
      icon,
      collapse: routeCollapses,
      href,
      route,
      collapse: navCollapse,
    }) => {
      if (!navCollapse) {
        return (
          <MKBox
            key={name}
            mx={1}
            p={1}
            display="flex"
            alignItems="baseline"
            color={light ? "white" : "dark"}
            opacity={light ? 1 : 0.6}
            sx={{ cursor: "pointer", userSelect: "none" }}
            component={route ? Link : MuiLink }
            href={route || href}
            target={href ? "_blank" : ""}
            rel={href ? "noreferrer" : ""}
          >
            <MKTypography
              variant="body2"
              lineHeight={1}
              color="inherit"
              sx={{ alignSelf: "center", "& *": { verticalAlign: "middle" } }}
            >
              {icon}
            </MKTypography>
            <MKTypography
              variant="button"
              fontWeight="regular"
              textTransform="capitalize"
              color={light ? "white" : "dark"}
              sx={{ fontWeight: "100%", ml: 1, mr: 0.25 }}
            >
              {name}
            </MKTypography>
          </MKBox>
        );
      } else {
        return (
          <DefaultNavbarDropdown
            key={name}
            name={name}
            icon={icon}
            collapseStatus={name === collapse}
            onClick={() => handleSetCollapse(name)}
            href={href}
            route={route}
          >
            <MKBox
              sx={{ height: "15rem", maxHeight: "15rem", overflowY: "scroll" }}
            >
              {routeCollapses &&
                routeCollapses.map((item) => (
                  <MKBox key={item.name} px={2}>
                    {item.collapse ? (
                      <>
                        <MKTypography
                          display="block"
                          variant="button"
                          fontWeight="bold"
                          textTransform="capitalize"
                          py={1}
                          px={0.5}
                        >
                          {item.name}
                        </MKTypography>
                        {item.collapse.map((el) => (
                          <MKTypography
                            key={el.name}
                            component={el.route ? Link : MuiLink}
                            href={el.route || el.href}
                            target={el.href ? "_blank" : ""}
                            rel={el.href ? "noreferrer" : "noreferrer"}
                            minWidth="11.25rem"
                            display="block"
                            variant="button"
                            color="text"
                            textTransform="capitalize"
                            fontWeight="regular"
                            py={0.625}
                            px={2}
                            sx={({
                              palette: { grey, dark },
                              borders: { borderRadius },
                            }) => ({
                              borderRadius: borderRadius.md,
                              cursor: "pointer",
                              transition: "all 300ms linear",

                              "&:hover": {
                                backgroundColor: grey[200],
                                color: dark.main,
                              },
                            })}
                          >
                            {el.name}
                          </MKTypography>
                        ))}
                      </>
                    ) : (
                      <MKBox
                        key={item.name}
                        display="block"
                        component={item.route ? Link : MuiLink}
                        href={item.route || item.href}
                        target={item.href ? "_blank" : ""}
                        rel={item.href ? "noreferrer" : "noreferrer"}
                        sx={({
                          palette: { grey, dark },
                          borders: { borderRadius },
                        }) => ({
                          borderRadius: borderRadius.md,
                          cursor: "pointer",
                          transition: "all 300ms linear",
                          py: 1,
                          px: 1.625,

                          "&:hover": {
                            backgroundColor: grey[200],
                            color:dark.main,

                            "& *": {
                              color: dark.main,
                            },
                          },
                        })}
                      >
                        <MKTypography
                          display="block"
                          variant="button"
                          fontWeight="bold"
                          textTransform="capitalize"
                        >
                          {item.name}
                        </MKTypography>
                        <MKTypography
                          display="block"
                          variant="button"
                          color="text"
                          fontWeight="regular"
                          sx={{ transition: "all 300ms linear" }}
                        >
                          {item.description}
                        </MKTypography>
                      </MKBox>
                    )}
                  </MKBox>
                ))}
            </MKBox>
          </DefaultNavbarDropdown>
        );
      }
    }
  );

  return (
    <Collapse in={Boolean(open)} timeout="auto" unmountOnExit>
      <MKBox width="calc(100% + 1.625rem)" my={2} ml={-2}>
        {renderNavbarItems}
      </MKBox>
    </Collapse>
  );
}

export default DefaultNavbarMobile;
