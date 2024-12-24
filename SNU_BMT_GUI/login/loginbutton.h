#ifndef LOGINBUTTON_H
#define LOGINBUTTON_H

#include <QPushButton>

class LoginButton
{
private:
    QPushButton* btn;

public:
    LoginButton(QPushButton* btn);
    void setLoginStyle();
    void setLogoutStlye();
};

#endif // LOGINBUTTON_H
