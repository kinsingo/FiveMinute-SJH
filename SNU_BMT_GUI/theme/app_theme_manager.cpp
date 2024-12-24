#include "app_theme_manager.h"
#include <QApplication>
#include <QPalette>
#include <QMenuBar>

AppThemeManager::AppThemeManager(shared_ptr<LogManager> logManage,QWidget* target, bool isDarkTheme)
{
    this->logManage = logManage;
    this->target= target;
    this->isDarkTheme = isDarkTheme;
}

bool AppThemeManager::GetIsDarkTheme()
{
    return this->isDarkTheme;
}

void AppThemeManager::SetDarkTheme(const int& transparent)
{
    isDarkTheme = true;
    QPalette pallete = target->palette();//현재 pallete 불러오기

     // Active 상태 정의
    pallete.setColor(QPalette::Window, QColor(53, 53, 53,transparent));
    pallete.setColor(QPalette::WindowText, QColor(255,255,255,transparent));
    pallete.setColor(QPalette::Base, QColor(0,0,0,transparent)); // Background color for input fields
    pallete.setColor(QPalette::AlternateBase, QColor(53, 53, 53,transparent));
    pallete.setColor(QPalette::ToolTipBase, QColor(255,255,255,transparent));
    pallete.setColor(QPalette::ToolTipText, QColor(255,255,255,transparent));
    pallete.setColor(QPalette::Text, QColor(255,255,255,transparent));
    pallete.setColor(QPalette::Button, QColor(53, 53, 53,transparent));
    pallete.setColor(QPalette::ButtonText, QColor(255,255,255,transparent));
    pallete.setColor(QPalette::BrightText, QColor(255,0,0,transparent));


    // Disabled 상태 정의
    pallete.setColor(QPalette::Disabled, QPalette::Window, QColor(80, 80, 80, transparent)); // 비활성화된 배경
    pallete.setColor(QPalette::Disabled, QPalette::WindowText, QColor(150, 150, 150, transparent)); // 비활성화된 텍스트
    pallete.setColor(QPalette::Disabled, QPalette::Text, QColor(150, 150, 150, transparent)); // 일반 텍스트
    pallete.setColor(QPalette::Disabled, QPalette::Button, QColor(80, 80, 80, transparent)); // 비활성화된 버튼
    pallete.setColor(QPalette::Disabled, QPalette::ButtonText, QColor(150, 150, 150, transparent)); // 비활성화된 버튼 텍스트

    //수정된 pallete 설정
    target->setPalette(pallete);

    //logMananger 설정
    logManage->SetTextColor(pallete.color(QPalette::WindowText));
    logManage->changeAllTestColor(pallete.color(QPalette::WindowText));
    logManage->SetHighLightTextColor(QColor(130, 130, 255,transparent));//Pale Blue
    logManage->SetErrorTextColor(QColor(255, 130, 130,transparent));//Pale Red
}

void AppThemeManager::SetLightTheme(const int& transparent)
{
    isDarkTheme = false;
    QPalette pallete = target->palette();//현재 pallete 불러오기

    // Active 상태 정의
    pallete.setColor(QPalette::Window, QColor(240, 240, 240,transparent));  // Background color
    pallete.setColor(QPalette::WindowText, QColor(0,0,0,transparent));  // Text color
    pallete.setColor(QPalette::Base, QColor(255, 255, 255,transparent));  // Background color for input fields
    pallete.setColor(QPalette::AlternateBase, QColor(225, 225, 225,transparent));  // Alternate row background color
    pallete.setColor(QPalette::ToolTipBase, QColor(255, 255, 255,transparent));  // Tooltip background color
    pallete.setColor(QPalette::ToolTipText, QColor(0,0,0,transparent));  // Tooltip text color
    pallete.setColor(QPalette::Text, QColor(0,0,0,transparent));  // General text color
    pallete.setColor(QPalette::Button, QColor(240, 240, 240,transparent));  // Button background color
    pallete.setColor(QPalette::ButtonText, QColor(0,0,0,transparent));  // Button text color
    pallete.setColor(QPalette::BrightText, QColor(255,0,0,transparent));  // Highlighted text color
    //pallete.setColor(QPalette::Highlight, QColor(76, 163, 224,transparent));  // Highlighted item background color
    //pallete.setColor(QPalette::HighlightedText, QColor(255, 255, 255,transparent));  // Highlighted item text color

    // Disabled 상태 정의
    pallete.setColor(QPalette::Disabled, QPalette::Window, QColor(220, 220, 220, transparent)); // 비활성화된 배경
    pallete.setColor(QPalette::Disabled, QPalette::WindowText, QColor(150, 150, 150, transparent)); // 비활성화된 텍스트
    pallete.setColor(QPalette::Disabled, QPalette::Text, QColor(150, 150, 150, transparent)); // 일반 텍스트
    pallete.setColor(QPalette::Disabled, QPalette::Button, QColor(200, 200, 200, transparent)); // 비활성화된 버튼
    pallete.setColor(QPalette::Disabled, QPalette::ButtonText, QColor(150, 150, 150, transparent)); // 비활성화된 버튼 텍스트

    //수정된 pallete 설정
    target->setPalette(pallete);

    //logMananger 설정
    logManage->SetTextColor(pallete.color(QPalette::WindowText));
    logManage->changeAllTestColor(pallete.color(QPalette::WindowText));
    logManage->SetHighLightTextColor(QColor(0, 0, 200,transparent));//Dark Blue
    logManage->SetErrorTextColor(QColor(200, 0, 0,transparent));//Dark Red
}

void AppThemeManager::SetDarkTheme()
{
    const int& transparent = 255;
    SetDarkTheme(transparent);
}

void AppThemeManager::SetDarkModalTheme()
{
    const int& transparent = 50;
    SetDarkTheme(transparent);
}

void AppThemeManager::SetLightTheme()
{
    const int& transparent = 255;
    SetLightTheme(transparent);
}

void AppThemeManager::SetLightModalTheme()
{
    const int& transparent = 50;
    SetLightTheme(transparent);
}


void AppThemeManager::SetNormalTheme()
{
    if(isDarkTheme)
        SetDarkTheme();
    else
        SetLightTheme();
}

void AppThemeManager::SetModalTheme()
{
    if(isDarkTheme)
        SetDarkModalTheme();
    else
        SetLightModalTheme();
}

