#include "authmanager.h"
#include "snu_bmt_gui.h"

AuthManager::AuthManager(shared_ptr<loginDialogModal> loginForm, QPushButton* btnAuth, shared_ptr<AppThemeManager> mainFormThemeManager, shared_ptr<LogManager> logManager)
{
    this->loginBtn = make_shared<LoginButton>(btnAuth);
    this->loginForm = loginForm;
    this->mainFormThemeManager = mainFormThemeManager;
    this->logManager = logManager;
}

void AuthManager::Authentication()
{
    if(loginForm->isUserValid())
    {
        loginBtn->setLoginStyle();
        logManager->WriteHighLightLogMessage(loginForm->getUserEmail() + " Logged Out");
        loginForm->resetState();
    }
    else
    {
        // 배경 어둡게 설정 (모달 느낌)
        mainFormThemeManager->SetModalTheme();

        // Login Form 실행 (부모 Form, 즉 현재 Form 은, loginForm(QDialog) 종료 전까지 Disabled 상태)
        loginForm->resetState();
        int result = loginForm->exec();//exec : Modal 방식, show : Non-Modal 방식
        if (result == QDialog::Accepted) {
            logManager->WriteHighLightLogMessage(loginForm->getUserEmail() + " Logged in successfully!");
            loginBtn->setLogoutStlye();
        } else {
            logManager->SetErrorTextColor("Login Failed!");
            loginBtn->setLoginStyle();
        }

        // 배경 복원
        mainFormThemeManager->SetNormalTheme();
    }
}




