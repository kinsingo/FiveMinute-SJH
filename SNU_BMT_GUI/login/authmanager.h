#ifndef AUTHMANAGER_H
#define AUTHMANAGER_H
#include "loginbutton.h"
#include "logindialogmodal.h"
#include "app_theme_manager.h"
#include "logmanager.h"

class AuthManager
{
private:
    shared_ptr<LoginButton> loginBtn;
    shared_ptr<loginDialogModal> loginForm;
    shared_ptr<AppThemeManager> mainFormThemeManager;
    shared_ptr<LogManager> logManager;
public:
    AuthManager(shared_ptr<loginDialogModal> loginForm, QPushButton* btnAuth, shared_ptr<AppThemeManager> mainFormThemeManager, shared_ptr<LogManager> logManager);
public:
    void Authentication();
};

#endif // AUTHMANAGER_H
