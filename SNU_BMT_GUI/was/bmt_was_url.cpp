
#include "bmt_was_url.h"

QString BMT_WAS_URL::getBaseURL()
{
    return isDev ? "http://localhost:3000" : "https://snu-bmt-next-js-deployment.vercel.app";
}

QString BMT_WAS_URL::getLoginURL()
{
    return getBaseURL() +  "/api/bmt-gui-app-auth";
}

QString BMT_WAS_URL::getResultURL()
{
    return getBaseURL() + "/api/bmt-gui-app-database";
}
