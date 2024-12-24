#include "loginbutton.h"

LoginButton::LoginButton(QPushButton* btn) {
    this->btn = btn;
    this->setLoginStyle();
}

void LoginButton::setLoginStyle()
{
    //info (setStyleSheet 가 Pallete 보다 우선순위가 높음, 즉 overwrite 함)
    btn->setText("login");
    btn->setStyleSheet(
        "QPushButton {"
        "   background-color: #1A73E8;"
        "   color: white;"
        "   border: 1px solid #1050f4;"
        "   border-radius: 7px;"
        "   height: 20px;"
        "}"
        "QPushButton:hover {"
        "   background-color: #1662C4;"
        "}"
        "QPushButton:pressed {"
        "   background-color: #0F4CB5;" // 기존 호버 색(#1662C4)보다 어두운 파란색
        "}"
        );
}

void LoginButton::setLogoutStlye()
{
    //secondary (setStyleSheet 가 Pallete 보다 우선순위가 높음, 즉 overwrite 함)
    btn->setText("logout");
    btn->setStyleSheet(
        "QPushButton {"
        "   background-color: #7b809a;"
        "   color: white;"
        "   border: 1px solid #110e0e;"
        "   border-radius: 7px;"
        "   height: 20px;"
        "}"
        "QPushButton:hover {"
        "   background-color: #8f93a9;"
        "}"
        "QPushButton:pressed {"
        "   background-color: #6b6f84;" // 기존 호버 색(#8f93a9)보다 어두운 회색
        "}"
        );
}

