#ifndef BMT_WAS_URL_H
#define BMT_WAS_URL_H

#include <QString>

class BMT_WAS_URL
{
private:
    const static bool isDev = false;
public:
    static QString getBaseURL();
    static QString getLoginURL();
    static QString getResultURL();
};

#endif // BMT_WAS_URL_H


