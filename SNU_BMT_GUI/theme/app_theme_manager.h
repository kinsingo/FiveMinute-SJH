#ifndef APP_THEME_MANAGER_H
#define APP_THEME_MANAGER_H

#pragma once
#include "logmanager.h"

using namespace std;

class AppThemeManager
{
private:
    shared_ptr<LogManager> logManage;
    bool isDarkTheme;
    QWidget* target;

private:
    void SetDarkModalTheme();
    void SetLightModalTheme();
    void SetDarkTheme(const int& transparent);
    void SetLightTheme(const int& transparent);

public:
    explicit AppThemeManager(shared_ptr<LogManager> logManage,QWidget* target, bool isDarkTheme);
    void SetDarkTheme();
    void SetLightTheme();
    void SetNormalTheme();
    void SetModalTheme();
    bool GetIsDarkTheme();
};

#endif // APP_THEME_MANAGER_H
